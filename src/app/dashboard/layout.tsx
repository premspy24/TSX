"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Tag,
  ArrowLeftRight,
  CreditCard,
  Bell,
  Settings,
  BadgeCheck,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore, useNotificationStore } from "@/store";
import { DEMO_USERS } from "@/lib/mock-data";
import { Avatar } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tickets", label: "My Tickets", icon: Ticket },
  { href: "/dashboard/listings", label: "My Listings", icon: Tag },
  { href: "/dashboard/exchanges", label: "My Exchanges", icon: ArrowLeftRight },
  { href: "/dashboard/transactions", label: "Transactions", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentUser = useAuthStore((s) => s.user) ?? DEMO_USERS[0];
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:pb-16 lg:pt-8">
      <div className="min-w-0 flex-1 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={currentUser.name} src={currentUser.avatar || undefined} alt={`${currentUser.name} avatar`} />
            <div>
              <p className="flex items-center gap-1 text-base font-semibold text-foreground">
                {currentUser.name}
                {currentUser.verified && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    <BadgeCheck className="size-3" />
                    Verified
                  </span>
                )}
              </p>
              <p className="text-xs text-muted">{currentUser.email}</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/dashboard/notifications"
              className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-white text-foreground/70 transition-colors hover:bg-foreground/5"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <ShieldCheck className="size-4 text-success" />
          Your account is protected by our buyer &amp; seller guarantee.
        </div>

        <nav className="mt-4 flex items-center gap-1 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <aside className="sticky top-16 hidden h-[calc(100vh-5rem)] w-64 shrink-0 flex-col border-r border-border pr-4 pt-6 lg:flex">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Dashboard
          </h2>
          <nav className="mt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  )}
                >
                  <Icon className="size-4.5" />
                  {item.label}
                  {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                    <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4 border-t border-border pt-5">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <MapPin className="size-4 text-primary" />
                Mumbai
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Find tickets &amp; exchanges happening near you.
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <Settings className="size-4.5" />
              Settings
            </Link>
          </div>
        </aside>
        {children}
      </div>
    </div>
  );
}
