"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clapperboard,
  Clock,
  Drama,
  LandPlot,
  MapPin,
  Mic2,
  Music2,
  Palette,
  Presentation,
  Sparkles,
  Ticket,
  Volleyball,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import type { Event, EventCategory } from "@/types";

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

const CATEGORY_ICONS: Record<EventCategory, React.ReactNode> = {
  concert: <Music2 className="size-8" aria-hidden="true" />,
  cricket: <LandPlot className="size-8" aria-hidden="true" />,
  football: <Volleyball className="size-8" aria-hidden="true" />,
  comedy: <Mic2 className="size-8" aria-hidden="true" />,
  festival: <Palette className="size-8" aria-hidden="true" />,
  movie: <Clapperboard className="size-8" aria-hidden="true" />,
  conference: <Presentation className="size-8" aria-hidden="true" />,
  theatre: <Drama className="size-8" aria-hidden="true" />,
  other: <Ticket className="size-8" aria-hidden="true" />,
};

export type EventCardProps = {
  event: Event;
  className?: string;
};

function EventCard({ event, className }: EventCardProps) {
  const gradient = CATEGORY_GRADIENTS[event.category];
  const icon = CATEGORY_ICONS[event.category];
  const ticketsLeft = event.availableTickets;

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/10",
        className
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br",
          gradient
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" aria-hidden="true" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-2/3 text-white/25 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <div className="absolute left-3 top-3 flex gap-2">
          {event.featured ? (
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm">
              <Sparkles className="size-3" aria-hidden="true" />
              Featured
            </Badge>
          ) : null}
        </div>
        <Badge className="absolute right-3 top-3 bg-black/30 uppercase tracking-wide text-white backdrop-blur-sm">
          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
        </Badge>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-white sm:text-lg">
            {event.name}
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-primary" aria-hidden="true" />
            {formatDate(event.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" aria-hidden="true" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary" aria-hidden="true" />
            {event.venue.name}, {event.venue.city}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Starting from</p>
            <p className="mt-0.5 text-xl font-bold text-foreground">
              {formatCurrency(event.basePrice)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant={ticketsLeft <= 15 ? "danger" : ticketsLeft <= 60 ? "warning" : "success"}>
              <Ticket className="size-3" aria-hidden="true" />
              {ticketsLeft} left
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}

export { EventCard };