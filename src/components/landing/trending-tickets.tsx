import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { TicketCard } from "@/components/ui/ticket-card";
import { DEMO_LISTINGS } from "@/lib/mock-data";

export default function TrendingTickets() {
  const trending = [...DEMO_LISTINGS]
    .sort((a, b) => b.watchers - a.watchers)
    .slice(0, 6);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <TrendingUp className="size-4" aria-hidden="true" />
            Most watched right now
          </p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Trending Tickets
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

      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3">
        {trending.map((listing) => (
          <TicketCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}