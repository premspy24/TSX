"use client";

import { use } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  MapPin,
  Shield,
  Star,
  Tag,
  Ticket,
  ArrowLeft,
  MessageSquare,
  ShoppingCart,
  Eye,
  Heart,
  Users,
  CreditCard,
  Zap,
  Handshake,
  Car,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/cn";
import { DEMO_EVENTS, DEMO_LISTINGS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/ui/event-card";
import {
  CATEGORY_GRADIENTS,
} from "@/components/ui/event-card";
import type { TicketListing } from "@/types";

const TRANSFER_METHOD_LABELS: Record<string, { icon: React.ReactNode; label: string }> = {
  instant_transfer: { icon: <Zap className="size-3.5" />, label: "Instant Transfer" },
  manual_transfer: { icon: <Handshake className="size-3.5" />, label: "Manual Transfer" },
  meet_at_venue: { icon: <Car className="size-3.5" />, label: "Meet at Venue" },
};

const VERIFICATION_STYLES: Record<string, string> = {
  verified: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  rejected: "bg-danger/10 text-danger",
};

function ListingCard({ listing }: { listing: TicketListing }) {
  const transfer = TRANSFER_METHOD_LABELS[listing.transferMethod] ?? {
    icon: <Ticket className="size-3.5" />,
    label: listing.transferMethod,
  };
  const verificationStyle = VERIFICATION_STYLES[listing.verificationStatus] ?? "";
  const discount = Math.round(
    ((listing.originalPrice - listing.sellingPrice) / listing.originalPrice) * 100
  );

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-foreground/10">
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="capitalize">{listing.ticketType}</Badge>
            {listing.verified ? (
              <Badge className="bg-success/10 text-success">
                <BadgeCheck className="size-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="warning">In Review</Badge>
            )}
            <Badge variant="outline" className={cn("capitalize", verificationStyle)}>
              {listing.verificationStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {listing.section && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  Section
                </p>
                <p className="mt-0.5 font-medium text-foreground">{listing.section}</p>
              </div>
            )}
            {listing.row && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  Row
                </p>
                <p className="mt-0.5 font-medium text-foreground">{listing.row}</p>
              </div>
            )}
            {listing.seat && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  Seat
                </p>
                <p className="mt-0.5 font-medium text-foreground">{listing.seat}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Quantity
              </p>
              <p className="mt-0.5 font-medium text-foreground">
                {listing.quantity} ticket{listing.quantity > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Transfer:
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                {transfer.icon}
                {transfer.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {listing.seller.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {listing.seller.name}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted">
                  <Star className="size-3 fill-warning text-warning" />
                  {listing.seller.rating}
                  {listing.seller.verified && (
                    <BadgeCheck className="size-3.5 text-primary" />
                  )}
                </p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3.5" />
                {listing.views}
              </span>
              <span className="inline-flex items-center gap-1">
                <Heart className="size-3.5" />
                {listing.watchers}
              </span>
            </div>
          </div>

          {listing.description && (
            <p className="text-sm leading-relaxed text-muted">
              {listing.description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 border-t border-dashed border-slate-300 bg-surface/50 px-6 py-6 sm:w-56 sm:border-l sm:border-t-0">
          <div className="text-center">
            <p className="text-xs text-muted">Selling for</p>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {formatCurrency(listing.sellingPrice)}
            </p>
            {listing.originalPrice > listing.sellingPrice && (
              <p className="mt-0.5 text-sm text-success font-medium">
                {discount > 0 ? `${discount}% off` : ""}
              </p>
            )}
            {listing.originalPrice !== listing.sellingPrice && (
              <p className="text-xs text-muted line-through">
                {formatCurrency(listing.originalPrice)}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <Link href={`/tickets/${listing.id}`}>
              <Button className="w-full" leftIcon={<ShoppingCart />}>
                Buy Now
              </Button>
            </Link>
            <Link href="/exchange">
              <Button variant="outline" className="w-full" leftIcon={<MessageSquare />}>
                Make Exchange Offer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const event = DEMO_EVENTS.find((e) => e.id === id);
  const listings = DEMO_LISTINGS.filter(
    (l) => l.eventId === id && l.status === "active"
  );

  if (!event) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            icon={<Ticket />}
            title="Event not found"
            description="The event you're looking for doesn't exist or has been removed."
            action={
              <Link href="/discover">
                <Button variant="secondary" leftIcon={<ArrowLeft />}>
                  Back to Discover
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const similarEvents = DEMO_EVENTS.filter(
    (e) => e.category === event.category && e.id !== event.id
  ).slice(0, 3);

  const gradient = CATEGORY_GRADIENTS[event.category];
  const lowestPrice = listings.length
    ? Math.min(...listings.map((l) => l.sellingPrice))
    : event.basePrice;

  return (
    <div className="min-h-screen bg-surface">
      <div className="relative overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            gradient
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to Discover
          </Link>

          <div className="flex flex-col gap-2">
            <Badge className="w-fit bg-white/20 text-white backdrop-blur-sm uppercase tracking-wider">
              {event.category}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {event.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {formatDate(event.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                {event.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {event.venue.name}, {event.venue.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {event.name}
                    </h2>
                    <Badge className="mt-2 capitalize">{event.category}</Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <CalendarDays className="size-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Date
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Clock className="size-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Time
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {event.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Venue
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {event.venue.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <MapPin className="size-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Address
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {event.venue.address}, {event.venue.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                      Organizer
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {event.organizer}
                    </p>
                  </div>

                  <div className="border-t border-border pt-5">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                      About this event
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {event.description}
                    </p>
                  </div>

                  {event.tags.length > 0 && (
                    <div className="border-t border-border pt-5">
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            <Tag className="size-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="flex flex-col items-center py-5 text-center">
                  <Ticket className="size-5 text-primary" />
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {event.totalTickets.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted">Total Tickets</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center py-5 text-center">
                  <Users className="size-5 text-success" />
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {event.availableTickets}
                  </p>
                  <p className="text-xs text-muted">Available</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center py-5 text-center">
                  <CreditCard className="size-5 text-primary" />
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {formatCurrency(lowestPrice)}
                  </p>
                  <p className="text-xs text-muted">Price from</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  Available Tickets
                </h2>
                {listings.length > 0 && (
                  <Badge variant="outline">{listings.length} listing{listings.length !== 1 ? "s" : ""}</Badge>
                )}
              </div>

              {listings.length > 0 ? (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Ticket />}
                  title="No tickets listed yet"
                  description="Be the first to list tickets for this event!"
                  action={
                    <Link href="/sell">
                      <Button leftIcon={<Ticket />}>Sell Tickets</Button>
                    </Link>
                  }
                />
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Event Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Base price</span>
                    <span className="font-bold text-foreground">
                      {formatCurrency(event.basePrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Available tickets</span>
                    <span className="font-semibold text-foreground">
                      {event.availableTickets}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Listed tickets</span>
                    <span className="font-semibold text-foreground">
                      {listings.length}
                    </span>
                  </div>
                  {listings.length > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Lowest price</span>
                      <span className="font-bold text-success">
                        {formatCurrency(lowestPrice)}
                      </span>
                    </div>
                  )}
                  <Button className="w-full mt-2" asChild>
                    <Link href="/discover">Browse All Events</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-success/20 bg-success/5">
              <CardContent className="flex items-start gap-3 pt-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Shield className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Buyer Protection
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    This listing is protected by TicketSwapX Buyer Protection. Your
                    payment is held securely until the tickets are delivered.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {similarEvents.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="mb-6 text-xl font-bold text-foreground">
              Similar Events
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similarEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
