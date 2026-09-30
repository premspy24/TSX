"use client";

import { useState } from "react";
import {
  ArrowLeftRight,
  BadgeCheck,
  Bell,
  BellOff,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  IndianRupee,
  Send,
  Settings,
  Ticket,
  Wallet,
  XCircle,
} from "lucide-react";
import { cn, timeAgo } from "@/lib/cn";
import { useNotificationStore } from "@/store";
import type { Notification, NotificationType } from "@/types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NOTIFICATION_META: Record<
  NotificationType,
  { icon: typeof Bell; className: string }
> = {
  purchase: { icon: Ticket, className: "bg-primary/10 text-primary" },
  sale: { icon: Wallet, className: "bg-success/10 text-success" },
  exchange_request: { icon: ArrowLeftRight, className: "bg-warning/10 text-warning" },
  exchange_accepted: { icon: CheckCircle2, className: "bg-success/10 text-success" },
  exchange_rejected: { icon: XCircle, className: "bg-danger/10 text-danger" },
  transfer: { icon: Send, className: "bg-accent/10 text-accent" },
  payment: { icon: CreditCard, className: "bg-primary/10 text-primary" },
  listing_expiration: { icon: Clock, className: "bg-warning/10 text-warning" },
  price_change: { icon: IndianRupee, className: "bg-warning/10 text-warning" },
  event_reminder: { icon: CalendarDays, className: "bg-accent/10 text-accent" },
  verification: { icon: BadgeCheck, className: "bg-success/10 text-success" },
  system: { icon: Settings, className: "bg-foreground/10 text-foreground/70" },
};

function NotificationRow({
  notification,
  onOpen,
}: {
  notification: Notification;
  onOpen: (id: string) => void;
}) {
  const meta = NOTIFICATION_META[notification.type] ?? NOTIFICATION_META.system;
  const Icon = meta.icon;

  return (
    <button
      onClick={() => onOpen(notification.id)}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-4 text-left transition-colors last:rounded-b-2xl hover:bg-foreground/[0.03] sm:px-5",
        !notification.read && "bg-primary/[0.04]"
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl [&>svg]:size-5",
          meta.className
        )}
        aria-hidden="true"
      >
        <Icon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "truncate text-sm font-semibold",
              notification.read ? "text-foreground/80" : "text-foreground"
            )}
          >
            {notification.title}
          </span>
          {!notification.read ? (
            <span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          ) : null}
        </span>
        <span className="mt-0.5 block text-sm leading-relaxed text-muted">
          {notification.message}
        </span>
        <span className="mt-1.5 block text-[11px] font-medium text-muted/80">
          {timeAgo(notification.createdAt)}
        </span>
      </span>
      {notification.actionUrl ? (
        <ChevronRight className="mt-1 size-4 shrink-0 text-muted" aria-hidden="true" />
      ) : null}
    </button>
  );
}

export default function NotificationsPage() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const [tab, setTab] = useState("all");

  const visible =
    tab === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleOpen = (id: string) => {
    markAsRead(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Bell className="size-6 text-primary" aria-hidden="true" />
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted">
            Updates about your tickets, payments and exchanges.
          </p>
        </div>
        <Button
          variant="secondary"
          leftIcon={<Check className="size-4" />}
          disabled={unreadCount === 0}
          onClick={markAllAsRead}
        >
          Mark all as read
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsTrigger value="all" className="gap-1.5">
            All
            <span className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {notifications.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-1.5">
            <Bell className="size-3.5" aria-hidden="true" />
            Unread
            {unreadCount > 0 && (
              <span className="ml-0.5 inline-flex size-4 items-center justify-center rounded-full bg-warning/20 text-[10px] font-bold text-warning">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {notifications.length === 0 ? (
            <EmptyState
              icon={<BellOff className="size-7" aria-hidden="true" />}
              title="No notifications"
              description="When something happens, you&apos;ll hear about it right here."
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="divide-y divide-border">
                {visible.map((n) => (
                  <NotificationRow key={n.id} notification={n} onOpen={handleOpen} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          {visible.length === 0 ? (
            <EmptyState
              icon={<BellOff className="size-7" aria-hidden="true" />}
              title="You&apos;re all caught up"
              description="No unread notifications right now."
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="divide-y divide-border">
                {visible.map((n) => (
                  <NotificationRow key={n.id} notification={n} onOpen={handleOpen} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}