"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Tag,
  DollarSign,
  Flag,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/listings", label: "Listings", icon: Tag },
  { href: "/admin/transactions", label: "Transactions", icon: DollarSign },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:pb-16 lg:pt-8">
      <div className="min-w-0 flex-1 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="size-5" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Admin Panel</p>
            <p className="text-xs text-muted">TicketSwapX Management</p>
          </div>
          <Badge variant="default" size="sm" className="ml-2">
            Admin
          </Badge>
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
            Admin
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
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-border pt-5">
            <div className="rounded-2xl bg-gradient-to-br from-danger/10 via-warning/5 to-transparent p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Shield className="size-4 text-danger" />
                Admin Access
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                You have full platform management privileges.
              </p>
            </div>
          </div>
        </aside>
        {children}
      </div>
    </div>
  );
}
