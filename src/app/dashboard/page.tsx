"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Search,
  Sparkles,
  Tag,
  Ticket,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn, formatCurrency, formatDate, timeAgo } from "@/lib/cn";
import { useAuthStore, useNotificationStore } from "@/store";
import {
  DEMO_EVENTS,
  DEMO_LISTINGS,
  DEMO_ORDERS,
  DEMO_TRANSACTIONS,
  DEMO_USERS,
} from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

const activeListings = DEMO_LISTINGS.filter((l) => l.status === "active");
const soldOrders = DEMO_ORDERS.filter((o) =>
  ["completed", "transferred"].includes(o.orderStatus)
);
const totalEarnings = soldOrders.reduce((sum, o) => sum + o.sellerPayout, 0);
const pendingOrders = DEMO_ORDERS.filter(
  (o) => o.orderStatus === "pending" || o.paymentStatus === "pending"
);

const stats = [
  {
    label: "Active Listings",
    icon: Tag,
    value: String(activeListings.length),
    delta: "+8.3%",
    up: true,
    gradient: "bg-gradient-to-br from-primary via-accent to-violet-500",
  },
  {
    label: "Tickets Sold",
    icon: Ticket,
    value: String(soldOrders.length),
    delta: "+12.5%",
    up: true,
    gradient: "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500",
  },
  {
    label: "Total Earnings",
    icon: Wallet,
    value: formatCurrency(totalEarnings),
    delta: "+5.4%",
    up: true,
    gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
  },
  {
    label: "Pending Payments",
    icon: CreditCard,
    value: String(pendingOrders.length),
    delta: "-3.1%",
    up: false,
    gradient: "bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500",
  },
];

const quickActions = [
  { href: "/sell", label: "List a Ticket", desc: "Sell a spare ticket", icon: Sparkles },
  { href: "/discover", label: "Browse Events", desc: "Find your next event", icon: Search },
  { href: "/exchange", label: "View Exchanges", desc: "Swap tickets with others", icon: ArrowLeftRight },
];

const typeMeta: Record<string, { label: string; className: string }> = {
  purchase: { label: "Purchase", className: "text-success bg-success/10" },
  sale: { label: "Sale", className: "text-primary bg-primary/10" },
  payout: { label: "Payout", className: "text-warning bg-warning/10" },
  refund: { label: "Refund", className: "text-danger bg-danger/10" },
};

const statusMeta: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
};

function StatCard(props: (typeof stats)[number]) {
  const { label, icon: Icon, value, delta, up, gradient } = props;
  const DeltaIcon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl text-white shadow-md shadow-foreground/10",
              gradient
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-semibold",
              up ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            )}
          >
            <DeltaIcon className="size-3" aria-hidden="true" />
            {delta}
          </span>
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          <p className="mt-0.5 text-xs font-medium text-muted">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const currentUser = useAuthStore((s) => s.user) ?? DEMO_USERS[0];
  const notifications = useNotificationStore((s) => s.notifications);
  const today = new Date();

  const upcomingEvents = DEMO_EVENTS.filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentTransactions = [...DEMO_TRANSACTIONS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const welcomeDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {currentUser.name.split(" ")[0]}!
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <CalendarDays className="size-4" aria-hidden="true" />
            {welcomeDate}
          </p>
        </div>
        <Button asChild leftIcon={<ArrowRight className="rotate-180" />}>
          <Link href="/sell">Sell a Ticket</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-4.5 text-primary" aria-hidden="true" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest dashboard updates</CardDescription>
            </div>
            <Link
              href="/dashboard/notifications"
              className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {notifications.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="Your latest updates will show up here."
              />
            ) : (
              <ul className="divide-y divide-border">
                {notifications.slice(0, 5).map((n) => {
                  const readBg = n.read ? "bg-border" : "bg-primary";
                  return (
                    <li
                      key={n.id}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <span className={cn("mt-1 size-2 shrink-0 rounded-full", readBg)} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{n.message}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted">{timeAgo(n.createdAt)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4.5 text-primary" aria-hidden="true" />
              Quick Actions
            </CardTitle>
            <CardDescription>Jump back into the action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">{action.label}</span>
                    <span className="block truncate text-xs text-muted">{action.desc}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-4.5 text-primary" aria-hidden="true" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Events you may want to catch</CardDescription>
            </div>
            <Link
              href="/discover"
              className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {upcomingEvents.length === 0 ? (
              <EmptyState
                title="No upcoming events"
                description="We'll show you events as they get announced."
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {upcomingEvents.map((event) => {
                  const date = new Date(event.date);
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="group overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                    >
                      <div className="flex items-center gap-3 border-b border-border bg-foreground/[0.02] p-3">
                        <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <span className="text-base font-bold leading-none">
                            {date.getDate()}
                          </span>
                          <span className="text-[10px] font-semibold uppercase">
                            {date.toLocaleDateString("en-IN", { month: "short" })}
                          </span>
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                            {event.name}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
                            <MapPin className="size-3 shrink-0" aria-hidden="true" />
                            {event.venue?.name ?? event.venue?.city ?? "TBA"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <span className="text-sm font-bold text-foreground">
                          {formatCurrency(event.basePrice)}<span className="text-xs font-medium text-muted">/ticket</span>
                        </span>
                        <ArrowRight
                          className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-4.5 text-primary" aria-hidden="true" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Your latest payments</CardDescription>
            </div>
            <Link
              href="/dashboard/transactions"
              className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {recentTransactions.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Your payment history will appear here."
              />
            ) : (
              <ul className="divide-y divide-border">
                {recentTransactions.map((t) => {
                  const type = typeMeta[t.type] ?? typeMeta.purchase;
                  const status = statusMeta[t.status] ?? statusMeta.pending;
                  return (
                    <li key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-xl",
                          type.className
                        )}
                      >
                        <CreditCard className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{type.label}</p>
                        <p className="truncate text-xs text-muted">
                          {formatDate(t.createdAt)} · {t.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          ₹{t.netAmount.toLocaleString("en-IN")}
                        </p>
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {recentTransactions.length > 0 && (
              <div className="mt-3 pt-3 text-center">
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  All payments are protected
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
