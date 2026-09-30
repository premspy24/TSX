import Link from "next/link";
import { ArrowLeftRight, ArrowRight, BadgeIndianRupee, ShoppingBag, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const cards = [
  {
    title: "Buy Tickets",
    description:
      "Find tickets to your favorite events at the best prices.",
    cta: "Explore Listings",
    href: "/discover",
    icon: ShoppingBag,
    gradient: "bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600",
    ctaClassName: "bg-white text-indigo-600 hover:bg-white/90",
  },
  {
    title: "Sell Tickets",
    description:
      "Turn your unused tickets into money. List in under 2 minutes.",
    cta: "Start Selling",
    href: "/sell",
    icon: BadgeIndianRupee,
    gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
    ctaClassName: "bg-white text-orange-600 hover:bg-white/90",
  },
  {
    title: "Exchange Tickets",
    description:
      "Swap tickets with other fans. Get what you really want.",
    cta: "Browse Exchanges",
    href: "/exchange",
    icon: ArrowLeftRight,
    gradient: "bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600",
    ctaClassName: "bg-white text-sky-600 hover:bg-white/90",
  },
];

export default function FeatureCards() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          One marketplace, endless possibilities
        </p>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          You&apos;re covered
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Whether you&apos;re grabbing a last-minute seat or clearing out your
          calendar, TicketSwapX has you covered.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={cn(
                "card-hover relative flex flex-col overflow-hidden rounded-3xl p-8 text-white",
                card.gradient
              )}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 opacity-15"
              >
                <Ticket className="size-40" />
              </div>
              <div className="relative flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="relative mt-6 text-xl font-bold tracking-tight">
                {card.title}
              </h3>
              <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-white/80">
                {card.description}
              </p>
              <div className="relative mt-auto pt-8">
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "w-full shadow-lg shadow-black/10 sm:w-auto",
                    card.ctaClassName
                  )}
                >
                  <Link href={card.href}>
                    {card.cta}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}