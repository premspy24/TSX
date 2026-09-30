"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Ticket,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore, useNotificationStore } from "@/store";
import { DEMO_USERS } from "@/lib/mock-data";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/sell", label: "Sell" },
  { href: "/exchange", label: "Exchange" },
];

export function Navbar() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="relative flex size-9 items-center justify-center rounded-xl gradient-primary">
                  <span className="text-lg font-black text-white leading-none">X</span>
                  <div className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-secondary" />
                </div>
                <span className="hidden text-lg font-bold sm:block text-gradient">
                  TicketSwapX
                </span>
              </Link>

              <div className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden flex-1 md:block">
              <div
                className={cn(
                  "relative mx-auto flex max-w-md items-center rounded-xl border bg-white/60 transition-all duration-200",
                  searchFocused
                    ? "border-primary/40 ring-2 ring-primary/10 shadow-sm"
                    : "border-border"
                )}
              >
                <Search className="ml-3 size-4 shrink-0 text-muted" />
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <>
                  <button
                    className="relative rounded-xl p-2.5 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    aria-label="Notifications"
                  >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <div ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition-colors hover:bg-foreground/5"
                    >
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-4 text-muted transition-transform duration-200",
                          dropdownOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-border bg-white shadow-xl shadow-black/5 animate-fade-in">
                        <div className="border-b border-border px-4 py-3">
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            <LayoutDashboard className="size-4" />
                            My Dashboard
                          </Link>
                          <Link
                            href="/dashboard/tickets"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            <Ticket className="size-4" />
                            My Tickets
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            <User className="size-4" />
                            Profile
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            <Settings className="size-4" />
                            Settings
                          </Link>
                        </div>
                        <div className="border-t border-border py-1">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              logout();
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-danger/5"
                          >
                            <LogOut className="size-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    href="/login"
                    onClick={(e) => {
                      e.preventDefault();
                      login(DEMO_USERS[0].email, "demo");
                    }}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl p-2.5 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm animate-slide-up">
            <div className="flex h-full flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span className="text-lg font-bold text-gradient">TicketSwapX</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl p-2 text-foreground/70 transition-colors hover:bg-foreground/5"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <div className="mb-4 flex items-center rounded-xl border border-border bg-white/60 px-3 md:hidden">
                  <Search className="size-4 shrink-0 text-muted" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full bg-transparent px-2.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {isAuthenticated && user && (
                  <div className="mt-4 space-y-1 border-t border-border pt-4">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      <LayoutDashboard className="size-4" />
                      My Dashboard
                    </Link>
                    <Link
                      href="/dashboard/tickets"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      <Ticket className="size-4" />
                      My Tickets
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      <Settings className="size-4" />
                      Settings
                    </Link>
                  </div>
                )}
              </div>

              <div className="border-t border-border px-3 py-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileOpen(false);
                        login(DEMO_USERS[0].email, "demo");
                      }}
                      className="block w-full rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
