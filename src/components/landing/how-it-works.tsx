import { Search, ShieldCheck, Ticket } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Find Your Event",
    description: "Search or browse events, find the perfect ticket.",
    icon: Search,
  },
  {
    number: "2",
    title: "Buy or Exchange",
    description: "Purchase securely or swap tickets with other fans.",
    icon: ShieldCheck,
  },
  {
    number: "3",
    title: "Enjoy the Show",
    description: "Get your verified ticket and make memories.",
    icon: Ticket,
  },
];

export default function HowItWorks() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Simple by design
        </p>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          How It Works
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          From discovery to the front row, getting your hands on verified
          tickets takes just three easy steps.
        </p>
      </div>

      <div className="relative mt-12">
        <div
          aria-hidden="true"
          className="absolute left-[16.66%] right-[16.66%] top-6 hidden lg:block"
        >
          <div className="h-0 w-full border-t-2 border-dashed border-primary/25" />
        </div>

        <div className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="gradient-primary flex size-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/25">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full border-2 border-white bg-secondary text-[11px] font-bold text-white shadow-sm">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}