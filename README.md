# TicketSwapX

**Your ticket. Someone else's seat. A smarter way to go.**

A production-quality ticket exchange and resale marketplace. Buy, sell, and exchange event tickets safely with people who actually want to go.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

The app ships with demo data and any email/password works on the login screen. Try:

- `priya@example.com` — verified seller with VIP listings
- `arjun@example.com` — cricket fan with IPL tickets
- `neha@example.com` — top-rated seller with festival passes
- `admin@ticketswapx.com` — admin access to `/admin`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS v4 + Radix UI + Lucide icons |
| State | Zustand |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL (schema in `src/lib/db/schema.ts`) |
| Auth | JWT + OAuth + OTP (in `src/lib/auth/`) |
| Payments | Gateway abstraction — Razorpay / Stripe plug-in |
| Storage | Cloud object storage abstraction (S3-ready) |

## Pages

### Public
- `/` — Landing page with hero, search, popular events, how-it-works, trust, testimonials, FAQ
- `/discover` — Browse and filter events by category, city, date, price
- `/events/[id]` — Event details with available tickets
- `/tickets/[id]` — Ticket listing with secure checkout flow
- `/exchange` — Create and browse ticket exchange requests
- `/sell` — 5-step ticket listing flow (Event → Details → Verify → Preview → Publish)

### Auth
- `/auth/login` — Email/password, Google, phone OTP
- `/auth/register` — Create account with validation
- `/auth/forgot-password` — Password reset

### User Dashboard
- `/dashboard` — Overview with stats, activity, quick actions
- `/dashboard/tickets` — Upcoming / Used / Sold / Transferred
- `/dashboard/listings` — Active / Sold / Expired / Draft listings
- `/dashboard/exchanges` — Pending / Accepted / Rejected / Completed
- `/dashboard/transactions` — Full transaction history with fees
- `/dashboard/notifications` — In-app notifications
- `/dashboard/settings` — Profile, preferences, security

### Admin
- `/admin` — Metrics, charts, GMV, platform revenue
- `/admin/users` — User management
- `/admin/events` — Event catalog management
- `/admin/listings` — Listing moderation + verification
- `/admin/transactions` — Transaction monitoring
- `/admin/reports` — Fraud reports & disputes
- `/admin/settings` — Platform fees, gateway, notifications

## API

REST API under `/api/` — same host as the app:

```
POST /api/auth/login          POST /api/auth/register
GET  /api/events              POST /api/events
GET  /api/events/[id]
GET  /api/listings            POST /api/listings
GET  /api/listings/[id]
GET  /api/orders              POST /api/orders
GET  /api/orders/[id]
GET  /api/exchanges           POST /api/exchanges
GET  /api/exchanges/[id]
GET  /api/notifications
GET  /api/reviews             POST /api/reviews
GET  /api/reports             POST /api/reports
GET  /api/admin/stats
```

All responses use `{ success: boolean, data?: T, error?: string }`.

## Architecture

```
src/
├── app/              # Pages + API routes (Next.js App Router)
├── components/
│   ├── ui/           # Button, Card, Input, Badge, Modal, etc.
│   ├── layout/       # Navbar, footer, mobile bottom nav
│   ├── landing/      # Landing page sections
│   ├── dashboard/    # Dashboard components
│   └── admin/        # Admin components
├── lib/
│   ├── db/           # PostgreSQL schema + connection abstraction
│   ├── auth/         # JWT, hashing, OAuth, OTP
│   ├── payments/     # Payment gateway abstraction
│   ├── notifications/# Email / push / in-app services
│   ├── storage/      # Object storage abstraction
│   ├── verification/ # Ticket verification workflow
│   ├── mock-data.ts  # Demo data (clearly labeled)
│   └── cn.ts         # Class merging + formatters
├── store/            # Zustand stores (auth, notifications, cart)
└── types/            # Shared TypeScript types
```

## Key Design Decisions

- **Security**: Raw card data is never stored. Payments go through a gateway abstraction (`RazorpayProvider`, `StripeProvider`). Resale legality is confirmed by sellers before listing.
- **Verification**: Tickets are verified via QR/barcode validation, metadata checks, and duplicate-listing detection. Sensitive ticket data is never exposed publicly.
- **Fees**: 10% flat platform fee shown transparently at every step. Sellers see estimated payout before publishing.
- **Scaling**: The API layer is stateless (JWT auth). Database schema uses UUIDs, indexed foreign keys, and audit timestamps on every table — ready for connection pooling and read replicas.

## Demo Content

All events, listings, and users are sample data provided for demonstration purposes. They will be replaced by real data when API credentials are configured.