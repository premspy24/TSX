import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/cn";

const testimonials = [
  {
    quote:
      "Found Coldplay tickets at an amazing price. The verification process gave me confidence. Best platform!",
    name: "Priya S.",
    city: "Mumbai",
  },
  {
    quote:
      "Sold my unused IPL tickets in 5 minutes. Payment was instant. Love TicketSwapX!",
    name: "Arjun M.",
    city: "Bangalore",
  },
  {
    quote:
      "Exchanged my Ed Sheeran ticket for an Arijit Singh one. Both parties were happy. Brilliant concept!",
    name: "Neha G.",
    city: "Delhi",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-sm text-warning" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Real fans, real stories
        </p>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          What Our Users Say
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Thousands of fans trust TicketSwapX for every show, match, and
          festival.
        </p>
      </div>

      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0 [scrollbar-width:thin]">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.name}
            hover
            className="flex w-[85%] shrink-0 snap-center flex-col sm:w-[60%] lg:w-auto"
          >
            <CardContent className="flex flex-1 flex-col gap-5 p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Quote className="size-5" aria-hidden="true" />
                </span>
                <Stars />
              </div>
              <blockquote className="text-sm leading-relaxed text-foreground/80">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-auto flex items-center gap-3 border-t border-border pt-5">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-bold text-white">
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted">{testimonial.city}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}