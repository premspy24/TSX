"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const faqs = [
  {
    question: "How does ticket verification work?",
    answer:
      "Every ticket goes through a multi-step process: document checks, seller identity verification, and a cross-check against the original booking. Only tickets that pass all checks are marked as Verified and shown on the marketplace.",
  },
  {
    question: "What if my ticket doesn't work at the event?",
    answer:
      "You're covered. If a verified ticket fails at entry, our Buyer Protection gives you a full refund to your original payment method. Just report it within 72 hours of the event and our team handles the rest.",
  },
  {
    question: "How do I sell my ticket?",
    answer:
      "Simple. Pick your event, upload your ticket details, complete a quick verification, set your price, and publish. Your listing goes live in under 2 minutes, and you get paid as soon as a buyer completes checkout.",
  },
  {
    question: "Can I exchange tickets with someone?",
    answer:
      "Yes! Use the Exchange feature to send swap requests to other listings. You can negotiate a direct ticket-for-ticket trade, and both parties stay protected until both sides confirm the exchange.",
  },
  {
    question: "What are the fees?",
    answer:
      "We charge a flat 10% platform fee on the final selling price. The fee is deducted from the seller's payout, and buyers see the all-in price upfront. No hidden charges, ever.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Absolutely. Payments are processed through encrypted, PCI-DSS compliant gateways. We never store your card details on our servers, and every transaction is monitored by our security team around the clock.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Got questions?
        </p>
        <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mt-10 space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <Card key={faq.question} className="overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-foreground/5 sm:px-6 sm:py-5"
              >
                <span className="text-sm font-semibold text-foreground sm:text-base">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-muted transition-transform duration-300",
                    isOpen && "rotate-180 text-primary"
                  )}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-panel-${index}`}
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6 sm:pb-6">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}