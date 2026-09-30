"use client";

import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  PackageCheck,
  Send,
  Ticket,
  TicketX,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "@/lib/cn";
import { useAuthStore } from "@/store";
import { DEMO_ORDERS, DEMO_USERS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketCard } from "@/components/ui/ticket-card";
import type { Order } from "@/types";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

const ORDER_STATUS_META: Record<
  Order["orderStatus"],
  { label: string; variant: BadgeVariant; icon: typeof Clock }
> = {
  pending: { label: "Pending", variant: "warning", icon: Clock },
  payment_processing: { label: "Payment Processing", variant: "info", icon: Clock },
  payment_complete: { label: "Payment Complete", variant: "info", icon: CheckCircle2 },
  transferring: { label: "Transferring", variant: "warning", icon: Send },
  transferred: { label: "Transferred", variant: "info", icon: PackageCheck },
  completed: { label: "Completed", variant: "success", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "outline", icon: TicketX },
  refunded: { label: "Refunded", variant: "danger", icon: TicketX },
  disputed: { label: "Disputed", variant: "danger", icon: Clock },
};

function CountBadge({ count }: { count: number }) {
  return (
    <span className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
      {count}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  const meta = ORDER_STATUS_META[order.orderStatus];
  const StatusIcon = meta.icon;
  const seatLabel = [
    order.listing.section ? `Section ${order.listing.section}` : null,
    order.listing.row ? `Row ${order.listing.row}` : null,
    order.listing.seat ? `Seat ${order.listing.seat}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="overflow-hidden">
      <TicketCard listing={order.listing} compact />
      <div className="flex items-end justify-between gap-3 border-t border-border bg-foreground/[0.03] px-4 py-3.5 sm:px-5">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <StatusIcon className="size-3.5 text-muted" aria-hidden="true" />
            <Badge variant={meta.variant} size="sm">
              {meta.label}
            </Badge>
          </div>
          {order.transferCode ? (
            <p className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-white px-2 py-1 font-mono text-[11px] font-medium text-foreground/70 ring-1 ring-border">
              <Send className="size-3 shrink-0 text-muted" aria-hidden="true" />
              <span className="truncate">{order.transferCode}</span>
            </p>
          ) : (
            <p className="text-[11px] text-muted">{order.quantity} × {seatLabel || "General admission"}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-base font-bold tabular-nums text-foreground">
            {formatCurrency(order.totalPrice)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {order.quantity} × ticket{order.quantity > 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function MyTicketsPage() {
  const currentUser = useAuthStore((s) => s.user) ?? DEMO_USERS[0];
  const upcomingOrders = DEMO_ORDERS.filter((o) => o.buyerId === "u3" || o.buyerId === "u4");
  const soldOrders = DEMO_ORDERS.filter((o) => o.sellerId === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Tickets
          </h1>
          <p className="mt-1 text-sm text-muted">
            Every ticket you&apos;ve bought, sold or transferred.
          </p>
        </div>
        <Button asChild leftIcon={<Ticket className="size-4" />}>
          <Link href="/discover">Browse Events</Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="w-full justify-start overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsTrigger value="upcoming" className="gap-1.5">
            <Ticket className="size-3.5" aria-hidden="true" />
            Upcoming
            {upcomingOrders.length > 0 && <CountBadge count={upcomingOrders.length} />}
          </TabsTrigger>
          <TabsTrigger value="used" className="gap-1.5">
            <CalendarCheck2 className="size-3.5" aria-hidden="true" />
            Used
          </TabsTrigger>
          <TabsTrigger value="sold" className="gap-1.5">
            <TrendingUp className="size-3.5" aria-hidden="true" />
            Sold
            {soldOrders.length > 0 && <CountBadge count={soldOrders.length} />}
          </TabsTrigger>
          <TabsTrigger value="transferred" className="gap-1.5">
            <Send className="size-3.5" aria-hidden="true" />
            Transferred
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcomingOrders.length === 0 ? (
            <EmptyState
              icon={<Ticket className="size-7" aria-hidden="true" />}
              title="No upcoming tickets"
              description="Your tickets for upcoming events will show up here."
              action={
                <Button asChild leftIcon={<Ticket className="size-4" />}>
                  <Link href="/discover">Browse Events</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {upcomingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="used" className="mt-4">
          <EmptyState
            icon={<CalendarCheck2 className="size-7" aria-hidden="true" />}
            title="No used tickets"
            description="Tickets you scan at the venue will be moved here."
          />
        </TabsContent>

        <TabsContent value="sold" className="mt-4">
          {soldOrders.length === 0 ? (
            <EmptyState
              icon={<TrendingUp className="size-7" aria-hidden="true" />}
              title="No sales yet"
              description="Tickets you sell will appear here with payout details."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {soldOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transferred" className="mt-4">
          <EmptyState
            icon={<Send className="size-7" aria-hidden="true" />}
            title="No transfers yet"
            description="Tickets you transfer to friends and family will appear here."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}