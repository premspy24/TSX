"use client";

import * as React from "react";
import {
  Armchair,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  MapPin,
  Star,
  Ticket,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import type { EventCategory, TicketListing } from "@/types";

export const CATEGORY_GRADIENTS: Record<EventCategory, string> = {
  concert: "from-indigo-600 via-violet-600 to-purple-600",
  cricket: "from-amber-500 via-orange-500 to-orange-600",
  football: "from-emerald-500 via-emerald-600 to-teal-600",
  comedy: "from-rose-500 via-pink-500 to-pink-600",
  festival: "from-violet-600 via-purple-600 to-fuchsia-600",
  movie: "from-slate-600 via-slate-700 to-gray-800",
  conference: "from-blue-600 via-blue-500 to-cyan-500",
  theatre: "from-orange-500 via-orange-600 to-red-600",
  other: "from-slate-700 via-slate-800 to-slate-900",
};

export type TicketCardProps = {
  listing: TicketListing;
  compact?: boolean;
  className?: string;
};

function TicketCard({ listing, compact = false, className }: TicketCardProps) {
  const { event, sellingPrice, quantity, ticketType, verified, section, row, seat } =
    listing;
  const gradient = CATEGORY_GRADIENTS[event.category];

  const seatLabel = [section ? `Section ${section}` : null, row ? `Row ${row}` : null, seat ? `Seat ${seat}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/10",
        className
      )}
    >
      <div className={cn("relative bg-gradient-to-br p-4 text-white sm:p-5", gradient)}>
        <div className="flex items-center justify-between gap-2">
          <Badge className="bg-white/20 text-white backdrop-blur-sm [&>svg]:size-3">
            {ticketType}
          </Badge>
          {verified ? (
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              <BadgeCheck aria-hidden="true" />
              Verified
            </Badge>
          ) : (
            <Badge variant="warning" className="bg-white/20 text-white backdrop-blur-sm">
              In review
            </Badge>
          )}
        </div>
        <h3
          className={cn(
            "mt-3 font-semibold leading-snug text-white",
            compact ? "line-clamp-1 text-sm" : "line-clamp-2 text-lg"
          )}
        >
          {event.name}
        </h3>
        <div
          className={cn(
            "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-white/85",
            compact && "text-[11px] text-white/75"
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
            {formatDate(event.date)}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{event.venue.name}</span>
          </span>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-300 p-4 sm:p-5">
        {compact ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-muted">
              <Armchair className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <span className="truncate">{seatLabel || "No seat assigned"}</span>
            </div>
            <p className="shrink-0 text-base font-bold text-foreground">
              {formatCurrency(sellingPrice)}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <TicketInfo
                icon={<Armchair className="size-4" aria-hidden="true" />}
                label="Seat"
                value={seatLabel || "General admission"}
              />
              <TicketInfo
                icon={<Ticket className="size-4" aria-hidden="true" />}
                label="Ticket type"
                value={`${ticketType} · ${quantity} qty`}
              />
              <TicketInfo
                icon={<MapPin className="size-4" aria-hidden="true" />}
                label="Venue"
                value={`${event.venue.name}, ${event.venue.city}`}
              />
              <TicketInfo
                icon={<CalendarDays className="size-4" aria-hidden="true" />}
                label="Date"
                value={formatDate(event.date)}
              />
            </div>
            <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted">Price</p>
                <p className="mt-0.5 text-xl font-bold text-foreground">
                  {formatCurrency(sellingPrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Seller</p>
                <p className="mt-0.5 flex items-center justify-end gap-1 text-sm font-medium text-foreground">
                  <span className="max-w-[120px] truncate">{listing.seller.name}</span>
                  <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
                  <span className="font-semibold">{listing.seller.rating}</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {!compact ? (
        <div className="flex items-center justify-between px-4 pb-4 sm:px-5 sm:pb-5">
          <p className="text-xs text-muted">
            Listed {formatDate(listing.createdAt)} · {quantity} ticket{quantity > 1 ? "s" : ""}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
            View ticket
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      ) : null}
    </article>
  );
}

type TicketInfoProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function TicketInfo({ icon, label, value }: TicketInfoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary [&>svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export { TicketCard };