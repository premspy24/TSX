import { KeyRound, Lock, ShieldCheck, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Verified Tickets",
    description:
      "Every ticket is verified through our multi-step verification process.",
    icon: ShieldCheck,
    iconClassName: "bg-success/10 text-success",
  },
  {
    title: "Buyer Protection",
    description:
      "Full refund if your ticket doesn't work. We've got your back.",
    icon: Lock,
    iconClassName: "bg-accent/10 text-accent",
  },
  {
    title: "Secure Transfers",
    description:
      "End-to-end encrypted ticket transfers. Your data is safe.",
    icon: KeyRound,
    iconClassName: "bg-violet-500/10 text-violet-600",
  },
  {
    title: "Trusted Sellers",
    description:
      "Seller ratings and reviews help you pick the best.",
    icon: Star,
    iconClassName: "bg-warning/10 text-warning",
  },
];

export default function TrustSection() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Built on trust
        </p>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Why Users Trust Us
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Buying event tickets should feel exciting, never risky. Here&apos;s
          how we keep every transaction safe.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.title}
              hover
              className="flex h-full flex-col items-start p-6"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-2xl [&>svg]:size-6 ${feature.iconClassName}`}
              >
                <Icon aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}