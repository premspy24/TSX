"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Eye,
  Heart,
  MapPin,
  Pencil,
  Plus,
  Power,
  Tag,
  Ticket,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/cn";
import { DEMO_EVENTS, DEMO_LISTINGS } from "@/lib/mock-data";
import type { TicketListing } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ListingStatus = "active" | "sold" | "expired" | "draft";
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

const LISTING_STATUS_META: Record<ListingStatus, { label: string; variant: BadgeVariant }> = {
  active: { label: "Active", variant: "success" },
  sold: { label: "Sold", variant: "default" },
  expired: { label: "Expired", variant: "outline" },
  draft: { label: "Draft", variant: "outline" },
};

const TABS: {
  key: ListingStatus;
  label: string;
  icon: typeof Ticket;
  emptyTitle: string;
  emptyDescription: string;
}[] = [
  {
    key: "active",
    label: "Active",
    icon: Ticket,
    emptyTitle: "No active listings",
    emptyDescription: "Your live listings that are visible to buyers appear here.",
  },
  {
    key: "sold",
    label: "Sold",
    icon: Tag,
    emptyTitle: "No sold listings",
    emptyDescription: "Listings that have been fully purchased appear here.",
  },
  {
    key: "expired",
    label: "Expired",
    icon: CalendarDays,
    emptyTitle: "No expired listings",
    emptyDescription: "Listings past their event date are moved here automatically.",
  },
  {
    key: "draft",
    label: "Draft",
    icon: Pencil,
    emptyTitle: "No drafts",
    emptyDescription: "Listings you save without publishing will appear here.",
  },
];

function buildMyListings(): TicketListing[] {
  const owned = DEMO_LISTINGS.filter((l) => l.sellerId === "u1");
  const base = owned.length >= 2 ? owned : DEMO_LISTINGS.slice(0, 2);
  return [
    ...base,
    {
      ...base[0],
      id: `${base[0].id}-sold`,
      status: "sold",
      views: 412,
      watchers: 34,
      updatedAt: "2026-09-10",
    },
    {
      ...base[1],
      id: `${base[1].id}-expired`,
      status: "expired",
      views: 688,
      watchers: 21,
      updatedAt: "2026-09-08",
    },
    {
      ...DEMO_LISTINGS[0],
      id: "l1-draft",
      event: DEMO_EVENTS[10],
      eventId: DEMO_EVENTS[10].id,
      ticketType: "premium",
      section: "S1",
      row: "4",
      seat: "9",
      quantity: 2,
      originalPrice: 4000,
      sellingPrice: 5200,
      status: "draft",
      views: 0,
      watchers: 0,
      createdAt: "2026-09-15",
      updatedAt: "2026-09-15",
    },
  ];
}

const MY_LISTINGS = buildMyListings();

function ListingCard({
  listing,
  onDeactivate,
}: {
  listing: TicketListing;
  onDeactivate: (id: string) => void;
}) {
  const meta = LISTING_STATUS_META[listing.status];
  const seatLabel = [
    listing.section ? `Section ${listing.section}` : null,
    listing.row ? `Row ${listing.row}` : null,
    listing.seat ? `Seat ${listing.seat}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card hover className="overflow-hidden">
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {formatDate(listing.event.date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden="true" />
                {listing.event.venue.city}
              </span>
            </div>
            <Link
              href={`/events/${listing.eventId}`}
              className="mt-1.5 block truncate text-base font-semibold text-foreground transition-colors hover:text-primary"
            >
              {listing.event.name}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" size="sm">
                {listing.ticketType}
              </Badge>
              <Badge variant="outline" size="sm">
                {listing.quantity} ticket{listing.quantity > 1 ? "s" : ""}
              </Badge>
              <Badge variant={meta.variant} size="sm">
                {meta.label}
              </Badge>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold tabular-nums text-foreground">
              {formatCurrency(listing.sellingPrice)}
            </p>
            <p className="text-[11px] font-medium text-muted">/ ticket</p>
          </div>
        </div>

        <div className="rounded-xl bg-foreground/[0.03] px-3 py-2.5 text-xs font-medium text-muted">
          {seatLabel || "General admission"} ·{" "}
          {listing.transferMethod.replaceAll("_", " ")}
        </div>

        <div className="flex items-center gap-4 border-t border-border pt-3.5 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" aria-hidden="true" />
            {listing.views} views
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Heart className="size-3.5" aria-hidden="true" />
            {listing.watchers} watchers
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="secondary" size="sm" leftIcon={<Pencil className="size-3.5" />}>
          Edit
        </Button>
        {listing.status === "active" ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-danger hover:bg-danger/10 hover:text-danger"
            leftIcon={<Power className="size-3.5" />}
            onClick={() => onDeactivate(listing.id)}
          >
            Deactivate
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<TicketListing[]>(MY_LISTINGS);

  const grouped = useMemo(() => {
    const groups: Record<ListingStatus, TicketListing[]> = {
      active: [],
      sold: [],
      expired: [],
      draft: [],
    };
    listings.forEach((l) => groups[l.status].push(l));
    return groups;
  }, [listings]);

  const handleDeactivate = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "expired" as const } : l))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Listings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage the tickets you&apos;re selling on TicketSwapX.
          </p>
        </div>
        <Button asChild leftIcon={<Plus className="size-4" />}>
          <Link href="/sell">Create New Listing</Link>
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full justify-start overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const count = grouped[tab.key].length;
            return (
              <TabsTrigger key={tab.key} value={tab.key} className="gap-1.5">
                <TabIcon className="size-3.5" aria-hidden="true" />
                {tab.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "ml-0.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                      count > 0 ? "bg-primary/10 text-primary" : "bg-foreground/5 text-muted"
                    )}
                  >
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((tab) => {
          const items = grouped[tab.key];
          const TabIcon = tab.icon;
          return (
            <TabsContent key={tab.key} value={tab.key} className="mt-4">
              {items.length === 0 ? (
                <EmptyState
                  icon={<TabIcon className="size-7" aria-hidden="true" />}
                  title={tab.emptyTitle}
                  description={tab.emptyDescription}
                  action={
                    <Button asChild variant="secondary" leftIcon={<Plus className="size-4" />}>
                      <Link href="/sell">Create New Listing</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onDeactivate={handleDeactivate}
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