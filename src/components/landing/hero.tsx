"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, BadgeCheck, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const statistics = [
  { value: "50K+", label: "Tickets Sold" },
  { value: "100K+", label: "Happy Users" },
  { value: "₹200M+", label: "GMV" },
];

const floatingTickets = [
  { left: "5%", top: "18%", rotate: "-12deg", delay: "0s", duration: "5s" },
  { left: "12%", top: "62%", rotate: "8deg", delay: "0.8s", duration: "6s" },
  { left: "82%", top: "16%", rotate: "10deg", delay: "0.4s", duration: "5.5s" },
  { left: "76%", top: "68%", rotate: "-8deg", delay: "1.2s", duration: "4.5s" },
  { left: "44%", top: "12%", rotate: "4deg", delay: "1.6s", duration: "7s" },
  { left: "55%", top: "80%", rotate: "-6deg", delay: "0.6s", duration: "6.5s" },
];

export default function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-32 -bottom-40 size-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        {floatingTickets.map((ticket, index) => (
          <div
            key={index}
            className="absolute hidden sm:block"
            style={{ left: ticket.left, top: ticket.top }}
          >
            <div
              className="animate-float flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/30 backdrop-blur-sm"
              style={{
                transform: `rotate(${ticket.rotate})`,
                animationDelay: ticket.delay,
                animationDuration: ticket.duration,
              }}
            >
              <Ticket className="size-6" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="flex flex-col items-center py-20 text-center sm:py-24 md:py-28"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm sm:text-sm">
              <BadgeCheck className="size-4 text-emerald-300" aria-hidden="true" />
              India&apos;s trusted ticket marketplace
              <Sparkles className="size-3.5 text-amber-300" aria-hidden="true" />
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            Turn unused tickets into{" "}
            <span className="text-gradient bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              unforgettable experiences.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Buy, sell, and exchange event tickets through a marketplace built
            around verification and trust.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" className="shadow-lg shadow-indigo-950/30">
              <Link href="/discover">
                Explore Tickets
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
            >
              <Link href="/sell">Sell Your Ticket</Link>
            </Button>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-12 grid w-full max-w-3xl grid-cols-3 gap-6 border-t border-white/10 pt-8 sm:mt-16 sm:gap-8"
          >
            {statistics.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </dd>
                <dd className="text-xs font-medium text-white/55 sm:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}