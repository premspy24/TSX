"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, PlusCircle, Ticket, User } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/sell", icon: PlusCircle, label: "Sell" },
  { href: "/dashboard/tickets", icon: Ticket, label: "Tickets" },
  { href: "/dashboard", icon: User, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/20 glass md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-[10px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-foreground/50 hover:text-foreground/70"
              )}
            >
              <Icon className={cn("size-5", active && "text-primary")} />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
