"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  Plus,
  Star,
  Ticket,
  X,
} from "lucide-react";
import { formatDate } from "@/lib/cn";
import { DEMO_EXCHANGES } from "@/lib/mock-data";
import type { ExchangeRequest, ExchangeStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

const STATUS_META: Record<ExchangeStatus, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Pending", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  countered: { label: "Countered", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const TAB_ICONS: Record<string, typeof Clock> = {
  pending: Clock,
  accepted: Check,
  rejected: X,
  completed: CheckCircle2,
};

const MY_EXCHANGES: ExchangeRequest[] = [
  DEMO_EXCHANGES[0],
  DEMO_EXCHANGES[1],
  {
    ...DEMO_EXCHANGES[1],
    id: "ex3",
    status: "rejected",
    createdAt: "2026-09-09",
    updatedAt: "2026-09-10",
  },
  {
    ...DEMO_EXCHANGES[0],
    id: "ex4",
    status: "completed",
    createdAt: "2026-09-05",
    updatedAt: "2026-09-08",
  },
];

const EMPTY_COPY: Record<string, { title: string; description: string }> = {
  pending: {
    title: "No pending exchanges",
    description: "Incoming swap requests you haven&apos;t decided on appear here.",
  },
  accepted: {
    title: "No accepted exchanges",
    description: "Swaps both sides have agreed to will appear here.",
  },
  rejected: {
    title: "No rejected exchanges",
    description: "Offers you have declined will appear here.",
  },
  completed: {
    title: "No completed exchanges",
    description: "Swaps that finished successfully will appear here.",
  },
};

function ExchangeTicket({
  listing,
  side,
}: {
  listing: ExchangeRequest["requesterListing"];
  side: "has" | "wants";
}) {
  return (
    <div className="min-w-0 flex-1 rounded-xl border border-border bg-foreground/[0.02] p-3">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
        {side === "has" ? (
          <Ticket className="size-3" aria-hidden="true" />
        ) : (
          <Heart className="size-3" aria-hidden="true" />
        )}
        {side === "has" ? "Has" : "Wants"}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">
        {listing.event.name}
      </p>
      <p className="mt-0.5 text-xs text-muted">
        {listing.ticketType} · ×{listing.quantity} · {formatDate(listing.event.date)}
      </p>
    </div>
  );
}

function ExchangeCard({
  exchange,
  onAccept,
  onReject,
}: {
  exchange: ExchangeRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const meta = STATUS_META[exchange.status];

  return (
    <Card hover className="overflow-hidden">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant={meta.variant} size="sm">
            {meta.label}
          </Badge>
          <span className="text-xs text-muted">{formatDate(exchange.createdAt)}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ExchangeTicket listing={exchange.requesterListing} side="has" />
          <div className="flex shrink-0 items-center justify-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ArrowRight className="size-4 rotate-90 sm:rotate-0" aria-hidden="true" />
            </span>
          </div>
          <ExchangeTicket listing={exchange.targetListing} side="wants" />
        </div>

        {exchange.message ? (
          <blockquote className="rounded-xl bg-foreground/[0.03] px-4 py-3 text-sm italic leading-relaxed text-foreground/80">
            &ldquo;{exchange.message}&rdquo;
          </blockquote>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar
              name={exchange.requester.name}
              src={exchange.requester.avatar}
              size="sm"
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                <span className="truncate">{exchange.requester.name}</span>
                {exchange.requester.verified && (
                  <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                )}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted">
                <Star className="size-3 fill-warning text-warning" aria-hidden="true" />
                {exchange.requester.rating} rating
              </p>
            </div>
          </div>

          {exchange.status === "pending" ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-danger hover:bg-danger/10 hover:text-danger"
                leftIcon={<X className="size-3.5" />}
                onClick={() => onReject(exchange.id)}
              >
                Reject
              </Button>
              <Button
                size="sm"
                leftIcon={<Check className="size-3.5" />}
                onClick={() => onAccept(exchange.id)}
              >
                Accept
              </Button>
            </div>
          ) : (
            <p
              className={
                exchange.status === "completed"
                  ? "inline-flex items-center gap-1.5 text-xs font-semibold text-success"
                  : "text-xs font-medium text-muted"
              }
            >
              {exchange.status === "accepted" && "Waiting for both parties to finalize."}
              {exchange.status === "rejected" && "This offer was declined."}
              {exchange.status === "completed" && (
                <>
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Exchanged successfully
                </>
              )}
              {exchange.status === "countered" && "A counter offer is on the table."}
              {exchange.status === "cancelled" && "This exchange was cancelled."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyExchangesPage() {
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>(MY_EXCHANGES);

  const grouped = useMemo(() => {
    const groups: Record<string, ExchangeRequest[]> = {
      pending: [],
      accepted: [],
      rejected: [],
      completed: [],
    };
    exchanges.forEach((ex) => {
      if (groups[ex.status]) groups[ex.status].push(ex);
    });
    return groups;
  }, [exchanges]);

  const handleAccept = (id: string) => {
    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, status: "accepted", updatedAt: new Date().toISOString() }
          : ex
      )
    );
  };

  const handleReject = (id: string) => {
    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, status: "rejected", updatedAt: new Date().toISOString() }
          : ex
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <ArrowLeftRight className="size-6 text-primary" aria-hidden="true" />
            My Exchanges
          </h1>
          <p className="mt-1 text-sm text-muted">
            Swap the tickets you don&apos;t need for the ones you do.
          </p>
        </div>
        <Button asChild leftIcon={<Plus className="size-4" />}>
          <Link href="/exchange">Create Exchange</Link>
        </Button>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="w-full justify-start overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(["pending", "accepted", "rejected", "completed"] as const).map((status) => {
            const TabIcon = TAB_ICONS[status];
            const count = grouped[status].length;
            return (
              <TabsTrigger key={status} value={status} className="gap-1.5">
                <TabIcon className="size-3.5" aria-hidden="true" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {count > 0 && (
                  <span className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(["pending", "accepted", "rejected", "completed"] as const).map((status) => {
          const items = grouped[status];
          const TabIcon = TAB_ICONS[status];
          const copy = EMPTY_COPY[status];
          return (
            <TabsContent key={status} value={status} className="mt-4">
              {items.length === 0 ? (
                <EmptyState
                  icon={<TabIcon className="size-7" aria-hidden="true" />}
                  title={copy.title}
                  description={copy.description}
                  action={
                    <Button asChild variant="secondary" leftIcon={<Plus className="size-4" />}>
                      <Link href="/exchange">Create Exchange</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {items.map((exchange) => (
                    <ExchangeCard
                      key={exchange.id}
                      exchange={exchange}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}