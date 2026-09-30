import Link from "next/link";
import { ArrowRight, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section className="gradient-primary relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-24 -top-24 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 size-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <Ticket className="absolute left-[8%] top-10 size-16 rotate-[-15deg] text-white/10" />
        <Sparkles className="absolute right-[10%] top-16 size-10 text-white/15" />
        <Ticket className="absolute bottom-12 left-[20%] size-20 rotate-[12deg] text-white/10" />
        <Sparkles className="absolute bottom-16 right-[18%] size-14 text-white/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 md:py-24 lg:px-8">
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ready to find your next experience?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
          Join thousands of fans buying, selling, and exchanging tickets on
          TicketSwapX.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="w-full bg-white text-primary shadow-lg shadow-black/10 hover:bg-white/90 hover:shadow-xl sm:w-auto"
          >
            <Link href="/register">
              Get Started
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full border-2 border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10 sm:w-auto"
          >
            <Link href="/discover">Explore Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}