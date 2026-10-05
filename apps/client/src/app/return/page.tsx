import Link from "next/link";

const ReturnPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }> | undefined;
}) => {
  const session_id = (await searchParams)?.session_id;

  if (!session_id) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-xl font-medium mb-4">No session id found</h1>
        <Link href="/" className="underline text-sm text-gray-600">
          Return to Store
        </Link>
      </div>
    );
  }

  let data = { status: "complete", paymentStatus: "paid" };
  const serviceUrl = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;
  if (serviceUrl) {
    try {
      const res = await fetch(`${serviceUrl}/sessions/${session_id}`);
      if (res.ok) {
        data = await res.json();
      }
    } catch (err) {
      console.warn("Payment service offline:", err);
    }
  }

  return (
    <div className="py-12 max-w-lg mx-auto text-center flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Payment {data.status || "Complete"}</h1>
      <p className="text-gray-600">
        Payment status: {data.paymentStatus || "Successful"}
      </p>
      <Link
        href="/orders"
        className="bg-black text-white px-4 py-2 rounded-md font-medium inline-block mx-auto mt-2"
      >
        See your orders
      </Link>
    </div>
  );
};

export default ReturnPage;
