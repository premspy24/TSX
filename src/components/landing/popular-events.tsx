import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventCard } from "@/components/ui/event-card";
import { DEMO_EVENTS } from "@/lib/mock-data";

export default function PopularEvents() {
  const featuredEvents = DEMO_EVENTS.filter((event) => event.featured).slice(0, 6);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Curated picks
          </p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Popular Events
          </h2>
        </div>
        <Link
          href="/discover"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          View All
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 md:gap-5 [scrollbar-width:thin]">
        {featuredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            className="w-[280px] max-w-[280px] shrink-0 snap-start sm:w-[300px] sm:max-w-[300px]"
          />
        ))}
      </div>
    </div>
  );
}