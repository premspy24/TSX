"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock,
  CreditCard,
  Flag,
  Gauge,
  Handshake,
  Landmark,
  MapPin,
  Minus,
  Plus,
  RefreshCcw,
  Shield,
  ShieldCheck,
  Smartphone,
  Star,
  Ticket,
  Wallet,
  Zap,
  Car,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { cn, formatCurrency, formatDate, calculatePlatformFee } from "@/lib/cn";
import { DEMO_LISTINGS, DEMO_REVIEWS, DEMO_USERS } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorState } from "@/components/ui/error-state";
import { SuccessState } from "@/components/ui/success-state";
import { useCartStore } from "@/store";
import type { PaymentMethod, TicketListing } from "@/types";

const TRANSFER_METHODS: Record<string, { icon: React.ReactNode; label: string }> = {
  instant_transfer: { icon: <Zap className="size-3.5" />, label: "Instant Transfer" },
  manual_transfer: { icon: <Handshake className="size-3.5" />, label: "Manual Transfer" },
  meet_at_venue: { icon: <Car className="size-3.5" />, label: "Meet at Venue" },
};

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: "upi", label: "UPI", icon: <Smartphone className="size-4" /> },
  { value: "card", label: "Credit / Debit Card", icon: <CreditCard className="size-4" /> },
  { value: "netbanking", label: "Net Banking", icon: <Landmark className="size-4" /> },
  { value: "wallet", label: "Wallet", icon: <Wallet className="size-4" /> },
];

const BANKS = [
  { value: "hdfc", label: "HDFC Bank" },
  { value: "icici", label: "ICICI Bank" },
  { value: "sbi", label: "State Bank of India" },
  { value: "axis", label: "Axis Bank" },
  { value: "kotak", label: "Kotak Mahindra Bank" },
  { value: "idfc", label: "IDFC First Bank" },
];

const WALLETS = [
  { value: "paytm", label: "Paytm Wallet" },
  { value: "phonepe", label: "PhonePe Wallet" },
  { value: "amazonpay", label: "Amazon Pay" },
  { value: "mobikwik", label: "MobiKwik" },
];

function ListingHeader({ listing }: { listing: TicketListing }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Badge className="w-fit capitalize">{listing.ticketType}</Badge>
      <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {listing.event.name}
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4" />
          {formatDate(listing.event.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" />
          {listing.event.time}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4" />
          {listing.event.venue.name}, {listing.event.venue.city}
        </span>
      </div>
    </div>
  );
}

function TicketDetails({ listing }: { listing: TicketListing }) {
  const transfer = TRANSFER_METHODS[listing.transferMethod] ?? {
    icon: <Ticket className="size-3.5" />,
    label: listing.transferMethod,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ticket Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="capitalize">{listing.ticketType}</Badge>
          {listing.verified ? (
            <Badge variant="success">
              <BadgeCheck className="size-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="warning">
              <RefreshCcw className="size-3" />
              Verification Pending
            </Badge>
          )}
          {listing.verificationStatus === "verified" && (
            <Badge variant="outline" className="text-success">
              <CheckCircle2 className="size-3" />
              {listing.verificationStatus}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {listing.section && (
            <div className="rounded-xl bg-surface px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Section</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{listing.section}</p>
            </div>
          )}
          {listing.row && (
            <div className="rounded-xl bg-surface px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Row</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{listing.row}</p>
            </div>
          )}
          {listing.seat && (
            <div className="rounded-xl bg-surface px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Seat</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{listing.seat}</p>
            </div>
          )}
          <div className="rounded-xl bg-surface px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Available</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {listing.quantity} ticket{listing.quantity > 1 ? "s" : ""}
            </p>
          </div>
          <div className="rounded-xl bg-surface px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Transfer</p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
              {transfer.icon}
              {transfer.label}
            </p>
          </div>
        </div>

        {listing.description && (
          <p className="text-sm leading-relaxed text-muted">{listing.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function PricingCard({ listing }: { listing: TicketListing }) {
  const save = listing.originalPrice - listing.sellingPrice;
  const savePct =
    listing.originalPrice > 0
      ? Math.round((save / listing.originalPrice) * 100)
      : 0;

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted line-through">
            {formatCurrency(listing.originalPrice)}
          </span>
          {save > 0 && (
            <Badge variant="success" size="sm">
              <Gauge className="size-3" />
              You save {formatCurrency(save)} ({savePct}% off)
            </Badge>
          )}
        </div>
        <p className="text-3xl font-bold text-foreground">
          {formatCurrency(listing.sellingPrice)}
        </p>
        <p className="text-xs text-muted">per ticket, all taxes included</p>
      </CardContent>
    </Card>
  );
}

function SellerCard({ listing }: { listing: TicketListing }) {
  const seller = listing.seller;
  const reviews = DEMO_REVIEWS.filter((r) => r.revieweeId === seller.id);
  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : seller.rating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sold by</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar name={seller.name} size="lg" src={seller.avatar} />
          <div>
            <p className="flex items-center gap-1.5 font-semibold text-foreground">
              {seller.name}
              {seller.verified && <BadgeCheck className="size-4 text-primary" />}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
              <Star className="size-3.5 fill-warning text-warning" />
              {typeof avg === "number" ? avg.toFixed(1) : seller.rating.toFixed(1)}
              <span className="text-muted">rating</span>
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
          <div className="text-center">
            <p className="text-base font-bold text-foreground">{seller.totalSales}</p>
            <p className="text-xs text-muted">Tickets sold</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground">{seller.totalPurchases}</p>
            <p className="text-xs text-muted">Purchased</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-foreground">
              {seller.joinDate ? new Date(seller.joinDate).getFullYear() : "-"}
            </p>
            <p className="text-xs text-muted">Member since</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuantitySelector({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">Quantity</p>
        <p className="text-xs text-muted">Up to {max} available</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-white text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-lg font-bold text-foreground">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex size-9 items-center justify-center rounded-xl border border-border bg-white text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

function OrderSummary({ listing, quantity }: { listing: TicketListing; quantity: number }) {
  const subtotal = listing.sellingPrice * quantity;
  const fee = calculatePlatformFee(subtotal, 10);
  const total = subtotal + fee;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">
            Price ({quantity} × {formatCurrency(listing.sellingPrice)})
          </span>
          <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Platform fee (10%)</span>
          <span className="font-medium text-foreground">{formatCurrency(fee)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-dashed border-border pt-2.5 text-base">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-foreground">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ProtectionBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-success/25 bg-success/5 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
        <Shield className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          Protected by TicketSwapX Buyer Protection
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">
          Full refund if ticket doesn&apos;t work.
        </p>
      </div>
    </div>
  );
}

function TrustSignals() {
  const signals = [
    { icon: <BadgeCheck className="size-4" />, label: "Verified listing" },
    { icon: <Zap className="size-4" />, label: "Secure Transfer" },
    { icon: <ShieldCheck className="size-4" />, label: "Money Back Guarantee" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {signals.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-white px-2 py-3 text-center"
        >
          <span className="text-primary">{s.icon}</span>
          <span className="text-[11px] font-medium leading-tight text-muted">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function PaymentSection({
  listing,
  quantity,
  onSuccess,
}: {
  listing: TicketListing;
  quantity: number;
  onSuccess: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const total = listing.sellingPrice * quantity + calculatePlatformFee(listing.sellingPrice * quantity, 10);

  function handlePay() {
    let nextError = "";
    if (method === "upi" && !upiId.trim()) nextError = "Enter your UPI ID";
    if (method === "card" && (cardNumber.replace(/\s/g, "").length < 12 || !cardExpiry || cardCvv.length < 3))
      nextError = "Enter valid card details";
    if (method === "netbanking" && !bank) nextError = "Select your bank";
    if (method === "wallet" && !wallet) nextError = "Select your wallet";
    if (nextError) {
      setError(nextError);
      return;
    }
    setError("");
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      onSuccess();
    }, 1400);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">Payment Method</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PAYMENT_METHODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setMethod(p.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-xs font-medium transition-all",
                method === p.value
                  ? "border-primary bg-primary/5 text-foreground shadow-sm"
                  : "border-border bg-white text-muted hover:border-primary/40 hover:text-foreground"
              )}
            >
              <span className={method === p.value ? "text-primary" : "text-muted"}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {method === "upi" && (
        <Input
          id="upi-id"
          type="text"
          label="UPI ID"
          placeholder="yourname@upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          icon={<Smartphone className="size-4" />}
          helperText="e.g. priya@oksbi, 9876543210@ybl"
        />
      )}

      {method === "card" && (
        <div className="space-y-3">
          <Input
            id="card-number"
            type="text"
            inputMode="numeric"
            label="Card number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(
                e.target.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ")
              )
            }
            icon={<CreditCard className="size-4" />}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="card-expiry"
              type="text"
              label="Expiry"
              placeholder="MM/YY"
              value={cardExpiry}
              onChange={(e) => {
                const d = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                setCardExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
              }}
            />
            <Input
              id="card-cvv"
              type="password"
              inputMode="numeric"
              label="CVV"
              placeholder="•••"
              maxLength={4}
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
            />
          </div>
          <p className="text-xs text-muted">Demo payment — no real charge is made.</p>
        </div>
      )}

      {method === "netbanking" && (
        <div>
          <p className="mb-1.5 block text-sm font-medium text-foreground">Select your bank</p>
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a bank" />
            </SelectTrigger>
            <SelectContent>
              {BANKS.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {method === "wallet" && (
        <div>
          <p className="mb-1.5 block text-sm font-medium text-foreground">Select your wallet</p>
          <Select value={wallet} onValueChange={setWallet}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a wallet" />
            </SelectTrigger>
            <SelectContent>
              {WALLETS.map((w) => (
                <SelectItem key={w.value} value={w.value}>
                  {w.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}

      <Button className="w-full" size="lg" loading={paying} onClick={handlePay}>
        Pay {formatCurrency(total)}
      </Button>
      <p className="text-center text-xs text-muted">
        <Shield className="mr-1 inline size-3.5" />
        Your payment is protected. You&apos;ll get a transfer code instantly.
      </p>
    </div>
  );
}

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const selectListing = useCartStore((s) => s.selectListing);
  const selectedListing = useCartStore((s) => s.selectedListing);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const storeQuantity = useCartStore((s) => s.quantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const listing = useMemo(() => DEMO_LISTINGS.find((l) => l.id === id), [id]);

  const localQuantity = listing ? selectedListing && selectedListing.id === listing.id ? storeQuantity : 1 : 1;
  const quantity = listing ? Math.min(localQuantity, listing.quantity) : 1;

  const [buying, setBuying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [transferCode, setTransferCode] = useState("");

  const relatedReviews = useMemo(
    () =>
      listing
        ? DEMO_REVIEWS.filter((r) => r.revieweeId === listing.sellerId).slice(0, 3)
        : [],
    [listing]
  );

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState
          title="Listing not found"
          description="This ticket listing doesn't exist or has been removed."
          onRetry={() => router.push("/discover")}
          retryLabel="Back to Discover"
        />
      </div>
    );
  }

  function startBuy(listing: TicketListing) {
    selectListing(listing);
    setBuying(true);
    setPaid(false);
  }

  function handlePaySuccess() {
    const code = `TSX-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setTransferCode(code);
    setPaid(true);
  }

  function handleQty(n: number) {
    setQuantity(n);
  }

  return (
    <div className="min-h-screen bg-surface pb-28 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href="/discover" className="transition-colors hover:text-primary">Events</Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/events/${listing.eventId}`} className="transition-colors hover:text-primary">
            {listing.event.name}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-medium text-foreground">Tickets</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-accent p-6 text-white shadow-lg shadow-primary/20 sm:p-8">
              <ListingHeader listing={listing} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <TicketDetails listing={listing} />
              <PricingCard listing={listing} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <SellerCard listing={listing} />
              <div className="space-y-6">
                <ProtectionBanner />
                <TrustSignals />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Recent reviews from buyers
                </h2>
                <span className="text-xs text-muted">
                  {relatedReviews.length} review{relatedReviews.length !== 1 ? "s" : ""}
                </span>
              </div>
              {relatedReviews.length > 0 ? (
                <div className="space-y-3">
                  {relatedReviews.map((review) => {
                    const reviewer = DEMO_USERS.find(
                      (u) => u.id === review.reviewerId
                    );
                    return (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={reviewer?.name ?? "Unknown"}
                              src={reviewer?.avatar}
                              size="sm"
                            />
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {reviewer?.name ?? "Unknown"}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "size-3",
                                        i <= review.rating
                                          ? "fill-warning text-warning"
                                          : "fill-border text-border"
                                      )}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-muted">
                            {review.comment}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-muted">
                    No reviews yet for this seller.
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/report"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-danger"
              >
                <Flag className="size-3.5" />
                Report this listing
              </Link>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardContent className="space-y-5 pt-6">
                <p className="text-sm font-semibold text-foreground">Select quantity</p>
                <QuantitySelector value={quantity} max={listing.quantity} onChange={handleQty} />
              </CardContent>
            </Card>
            <OrderSummary listing={listing} quantity={quantity} />
            <Button
              size="lg"
              className="hidden w-full md:inline-flex"
              onClick={() => startBuy(listing)}
            >
              Buy Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="hidden w-full md:inline-flex"
              asChild
              leftIcon={<Handshake className="size-4" />}
            >
              <Link href="/exchange">Make an Exchange Offer</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">Total</p>
            <p className="text-base font-bold text-foreground">
              {formatCurrency(listing.sellingPrice * quantity + calculatePlatformFee(listing.sellingPrice * quantity, 10))}
            </p>
          </div>
          <Button size="lg" className="flex-1" onClick={() => startBuy(listing)}>
            Buy Now
          </Button>
        </div>
      </div>

      {(buying || paid) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in sm:items-center">
          <div className="relative w-full max-w-lg animate-slide-up rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl sm:p-8">
            <button
              type="button"
              onClick={() => {
                setBuying(false);
                setPaid(false);
                clearCart();
              }}
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
              aria-label="Close"
            >
              <ChevronDown className="size-4 sm:hidden" />
              <span className="hidden sm:block">✕</span>
            </button>

            {!paid ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Checkout</h2>
                  <div className="mt-3 rounded-xl bg-surface p-4">
                    <p className="text-xs text-muted">Buying</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      {listing.event.name}
                    </p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs capitalize text-muted">
                      <Ticket className="size-3" />
                      {listing.ticketType} · Qty {quantity} · {listing.section ? `Sec ${listing.section}` : "Open"}
                    </p>
                  </div>
                </div>
                <PaymentSection
                  listing={listing}
                  quantity={quantity}
                  onSuccess={handlePaySuccess}
                />
              </div>
            ) : (
              <SuccessState
                title="Payment Successful!"
                description={`Your tickets are locked in. Transfer code: ${transferCode}`}
                actions={
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => {
                      clearCart();
                      setBuying(false);
                      setPaid(false);
                      router.push("/dashboard");
                    }}
                  >
                    View in Dashboard
                  </Button>
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}