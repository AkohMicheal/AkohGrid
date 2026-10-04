import { Hono } from "hono";
import crypto from "crypto";
import Stripe from "stripe";
import stripe from "../utils/stripe.js";
import { producer } from "../utils/kafka.js";

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || "";

const webhookRoute = new Hono();

webhookRoute.get("/health", (c) => {
  return c.json({
    status: "healthy",
    gateways: ["stripe", "paystack"],
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

/**
 * Stripe Webhook Ingestion Endpoint
 */
webhookRoute.post("/stripe", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  if (!sig || !stripeWebhookSecret) {
    return c.json({ error: "Missing signature or webhook secret" }, 400);
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, stripeWebhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return c.json({ error: "Invalid signature" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      await producer.send("payment.successful", {
        value: {
          provider: "stripe",
          reference: session.id,
          userId: session.client_reference_id,
          customerEmail: session.customer_details?.email,
          amountCents: session.amount_total,
          currency: session.currency?.toUpperCase() || "USD",
          status: session.payment_status === "paid" ? "successful" : "failed",
          items: lineItems.data.map((item) => ({
            name: item.description,
            quantity: item.quantity,
            unitPriceCents: item.price?.unit_amount,
          })),
          timestamp: new Date().toISOString(),
        },
      });
      break;
    }
    default:
      break;
  }

  return c.json({ received: true });
});

/**
 * Paystack Webhook Ingestion Endpoint
 * Verifies HMAC SHA512 header x-paystack-signature against raw request body
 */
webhookRoute.post("/paystack", async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header("x-paystack-signature");

  if (!signature || !paystackSecretKey) {
    return c.json({ error: "Missing signature or Paystack secret key" }, 400);
  }

  const hash = crypto
    .createHmac("sha512", paystackSecretKey)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    console.error("Paystack webhook signature verification failed.");
    return c.json({ error: "Invalid webhook signature" }, 401);
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return c.json({ error: "Malformed JSON payload" }, 400);
  }

  const { event, data } = payload;

  if (event === "charge.success") {
    // Idempotent dispatch to Kafka payment bus
    await producer.send("payment.successful", {
      value: {
        provider: "paystack",
        reference: data.reference,
        transactionId: String(data.id),
        customerEmail: data.customer?.email,
        userId: data.metadata?.userId || null,
        orderId: data.metadata?.orderId || null,
        amountCents: data.amount, // Paystack amounts are in kobo/cents
        currency: data.currency,
        status: "successful",
        channel: data.channel,
        paidAt: data.paid_at,
        timestamp: new Date().toISOString(),
      },
    });
  }

  return c.json({ received: true, event });
});

export default webhookRoute;
