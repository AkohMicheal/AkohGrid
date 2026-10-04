# AkohGrid — Distributed Event-Driven Commerce Platform

> An enterprise microservices e-commerce and supply-chain platform engineered with Next.js 15 (App Router), an Apache Kafka event bus, dual-gateway payment reconciliation (Stripe & Paystack), and a unified PostgreSQL / Drizzle ORM relational layer.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-ef4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Bus-231f20?style=flat-square&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-c5f467?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

---

## ⚡ Architecture Overview

Modern high-concurrency commerce demands strict decoupling between high-read catalog browsing, payment reconciliation, inventory mutations, and customer notifications. AkohGrid replaces monolithic bottlenecks with an event-driven microservices architecture coordinated via Apache Kafka.

```mermaid
flowchart TD
    subgraph Frontend["Client Applications (Next.js 15 App Router)"]
        Storefront["Storefront (apps/client)\nNext.js 15 · Clerk Auth · Responsive UI"]
        AdminDashboard["Operations Dashboard (apps/admin)\nTanStack Table · Recharts · Analytics"]
    end

    subgraph EdgeGateway["API & Integration Boundary"]
        ProductSvc["Product Service (:8000)\nCatalog & Search REST API"]
        OrderSvc["Order Service (:8001)\nOrder Lifecycle & State Transitions"]
        PaymentSvc["Payment Service (:8002)\nHono · Stripe & Paystack Webhooks"]
        EmailSvc["Notification Service\nKafka Consumer · Email Dispatcher"]
    end

    subgraph Messaging["Message Broker"]
        KafkaBus["Apache Kafka Event Bus (@repo/kafka)\nTopic: payment.successful\nTopic: order.created\nTopic: inventory.updated"]
    end

    subgraph DataLayer["Persistence Layer (@repo/db)"]
        PostgresDB[(PostgreSQL / Supabase)]
    end

    Storefront -->|Browse & Filter| ProductSvc
    Storefront -->|Submit Order| OrderSvc
    Storefront -->|Initialize Payment| PaymentSvc
    AdminDashboard -->|Manage Catalog| ProductSvc
    AdminDashboard -->|Fulfill Orders| OrderSvc

    PaymentSvc -->|Cryptographic Verification| PaymentSvc
    PaymentSvc -->|Emit payment.successful| KafkaBus
    KafkaBus -->|Consume Event| OrderSvc
    KafkaBus -->|Consume Event| EmailSvc

    ProductSvc --> PostgresDB
    OrderSvc --> PostgresDB
    PaymentSvc --> PostgresDB
```

---

## 🛠️ Monorepo Topology

```text
akohgrid/
├── apps/
│   ├── client/              # Next.js 15 customer storefront (SSR, Clerk Auth, Zustand)
│   ├── admin/               # Next.js 15 back-office management portal (TanStack Query/Table)
│   ├── product-service/     # Express 5 catalog discovery service
│   ├── order-service/       # Order processing and state machine engine
│   ├── payment-service/     # Hono webhook engine with HMAC SHA512 verification
│   ├── email-service/       # Asynchronous Kafka consumer for transactional emails
│   └── auth-service/        # Identity bridge and session synchronization
└── packages/
    ├── db/                  # Unified Drizzle ORM schemas (PostgreSQL / Supabase)
    ├── kafka/               # KafkaJS connection wrappers, topics, producer & consumer
    ├── types/               # Shared TypeScript domain contracts & payloads
    ├── eslint-config/       # Strict ESLint monorepo rules
    └── typescript-config/   # Strict tsconfig baselines
```

---

## 🚀 Key Engineering Highlights

### 1. Dual-Gateway Webhook Ingestion & Idempotency
- **Stripe:** Constructs cryptographic events using official SDK signatures (`stripe-signature`).
- **Paystack:** Implements native Node.js `crypto.createHmac("sha512", secret)` validation against raw request buffers to verify `x-paystack-signature` headers before dispatch.
- **Idempotency Guarantee:** Payment records store unique transaction hashes. Webhook re-deliveries from network retries are deduplicated at the persistence boundary to prevent double-fulfillment.

### 2. Asynchronous Event Choreography with Kafka
Instead of chaining fragile synchronous HTTP calls during checkout:
1. The client completes checkout with Stripe or Paystack.
2. The payment service verifies the cryptographic webhook signature and publishes a `payment.successful` event to Apache Kafka.
3. The **Order Service** and **Email Service** independently subscribe to the topic to transition the order state to `paid` and trigger order receipts asynchronously.

### 3. Unified Relational Schema (`@repo/db`)
Replaced fragmented data stores with a unified PostgreSQL relational schema via **Drizzle ORM**:
- Strict foreign key constraints with cascade rules for order line items.
- Native PostgreSQL enums for order lifecycle states (`pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`).
- `tabular-nums` numeric consistency for price calculations in integer cents/kobo to eliminate floating-point rounding errors.

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js `20.x` or higher
- PNPM `9.x` (`npm install -g pnpm`)
- Docker & Docker Compose (for PostgreSQL & Kafka)

### 1. Clone & Install
```bash
git clone https://github.com/AkohMicheal/AkohGrid.git
cd AkohGrid
pnpm install
```

### 2. Environment Configuration
Create `.env` files in each service using the provided templates:
```bash
# Database connection (PostgreSQL / Supabase)
DATABASE_URL="postgres://postgres:postgres@localhost:5432/akohgrid"

# Apache Kafka
KAFKA_BROKERS="localhost:9092"

# Payment Gateways
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PAYSTACK_SECRET_KEY="sk_test_..."
```

### 3. Database Migrations
```bash
pnpm --filter @repo/db db:push
```

### 4. Run the Full Stack
```bash
# Spin up all applications and microservices via Turborepo
pnpm dev
```

* **Client Storefront:** [http://localhost:3002](http://localhost:3002)
* **Admin Dashboard:** [http://localhost:3003](http://localhost:3003)
* **Payment Service:** [http://localhost:8002](http://localhost:8002)

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
