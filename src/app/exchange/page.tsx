"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ArrowLeftRight,
  ArrowRight,
  Send,
  Check,
  X,
  Clock,
  BadgeCheck,
  Star,
  MessageSquare,
  Ticket,
  Calendar,
  MapPin,
  Plus,
  Eye,
  Repeat,
} from "lucide-react";
import { formatDate } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { DEMO_EVENTS, DEMO_EXCHANGES } from "@/lib/mock-data";
import type { TicketListing, TicketType, ExchangeStatus } from "@/types";

type ExchangeForm = {
  haveEventId: string;
  haveTicketType: TicketType;
  haveSection: string;
  haveSeat: string;
  haveQuantity: number;
  wantEventId: string;
  wantTicketType: string;
  wantNotes: string;
  message: string;
};

const TICKET_TYPES: { value: string; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "standard", label: "Standard" },
  { value: "vip", label: "VIP" },
  { value: "premium", label: "Premium" },
  { value: "general", label: "General" },
  { value: "standing", label: "Standing" },
  { value: "box", label: "Box" },
];

const STATUS_CONFIG: Record<
  ExchangeStatus,
  { label: string; variant: "default" | "success" | "danger" | "warning" | "info" | "outline" }
> = {
  pending: { label: "Pending", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  countered: { label: "Countered", variant: "info" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

const MY_EXCHANGES = [
  { ...DEMO_EXCHANGES[0], status: "pending" as ExchangeStatus },
  { ...DEMO_EXCHANGES[1], status: "accepted" as ExchangeStatus },
];

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState("create");
  const [myExchangesSubTab, setMyExchangesSubTab] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState<ExchangeForm>({
    haveEventId: "",
    haveTicketType: "standard",
    haveSection: "",
    haveSeat: "",
    haveQuantity: 1,
    wantEventId: "",
    wantTicketType: "any",
    wantNotes: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedHaveEvent = useMemo(
    () => DEMO_EVENTS.find((e) => e.id === form.haveEventId) || null,
    [form.haveEventId]
  );

  const selectedWantEvent = useMemo(
    () => DEMO_EVENTS.find((e) => e.id === form.wantEventId) || null,
    [form.wantEventId]
  );

  const filteredExchangeRequests = useMemo(() => {
    if (!searchQuery.trim()) return DEMO_EXCHANGES;
    const q = searchQuery.toLowerCase();
    return DEMO_EXCHANGES.filter(
      (ex) =>
        ex.requesterListing.event.name.toLowerCase().includes(q) ||
        ex.targetListing.event.name.toLowerCase().includes(q) ||
        ex.requester.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedExchanges = useMemo(() => {
    const groups: Record<string, typeof MY_EXCHANGES> = {
      pending: [],
      accepted: [],
      rejected: [],
      completed: [],
    };
    MY_EXCHANGES.forEach((ex) => {
      if (groups[ex.status]) groups[ex.status].push(ex);
    });
    return groups;
  }, []);

  const canSubmit = form.haveEventId && form.wantEventId && form.message.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitted(true);
  };

  const renderExchangeCard = (listing: TicketListing, side: "has" | "wants") => (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Ticket className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted uppercase tracking-wide">
          {side === "has" ? "Has" : "Wants"}
        </p>
        <p className="truncate text-sm font-medium text-foreground">
          {listing.event.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="outline" size="sm">{listing.ticketType}</Badge>
          <span className="text-xs text-muted">×{listing.quantity}</span>
        </div>
      </div>
    </div>
  );

  const renderCreateTab = () => {
    if (isSubmitted) {
      return (
        <div className="animate-fade-in">
          <SuccessView onReset={() => {
            setIsSubmitted(false);
            setForm({
              haveEventId: "",
              haveTicketType: "standard",
              haveSection: "",
              haveSeat: "",
              haveQuantity: 1,
              wantEventId: "",
              wantTicketType: "any",
              wantNotes: "",
              message: "",
            });
          }} />
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ticket className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">I Have</h3>
              <p className="text-xs text-muted">Select the ticket you want to exchange</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Event <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={form.haveEventId}
                    onValueChange={(val) => setForm((prev) => ({ ...prev, haveEventId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your event" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEMO_EVENTS.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedHaveEvent && (
                  <div className="rounded-xl bg-foreground/[0.03] p-3 flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Ticket className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{selectedHaveEvent.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                        <Calendar className="size-3" />
                        {formatDate(selectedHaveEvent.date)}
                        <MapPin className="size-3 ml-1" />
                        {selectedHaveEvent.venue.city}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Ticket Type</label>
                    <Select
                      value={form.haveTicketType}
                      onValueChange={(val) => setForm((prev) => ({ ...prev, haveTicketType: val as TicketType }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TICKET_TYPES.filter((t) => t.value !== "any").map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Quantity</label>
                    <div className="flex h-11 items-center rounded-xl border border-border bg-white">
                      <button
                        onClick={() => setForm((p) => ({ ...p, haveQuantity: Math.max(1, p.haveQuantity - 1) }))}
                        className="flex size-full items-center justify-center px-3 text-muted hover:text-foreground"
                      >
                        <span className="text-lg">−</span>
                      </button>
                      <span className="flex-1 text-center text-sm font-semibold tabular-nums">{form.haveQuantity}</span>
                      <button
                        onClick={() => setForm((p) => ({ ...p, haveQuantity: Math.min(10, p.haveQuantity + 1) }))}
                        className="flex size-full items-center justify-center px-3 text-muted hover:text-foreground"
                      >
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  <Input
                    label="Section"
                    placeholder="Optional"
                    value={form.haveSection}
                    onChange={(e) => setForm((p) => ({ ...p, haveSection: e.target.value }))}
                  />
                  <Input
                    label="Seat"
                    placeholder="Optional"
                    value={form.haveSeat}
                    onChange={(e) => setForm((p) => ({ ...p, haveSeat: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ArrowLeftRight className="size-5" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-success/10 text-success">
              <Ticket className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">I Want</h3>
              <p className="text-xs text-muted">Tell us what you&apos;re looking for</p>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Event <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={form.wantEventId}
                    onValueChange={(val) => setForm((prev) => ({ ...prev, wantEventId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select the event you want" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEMO_EVENTS.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedWantEvent && (
                  <div className="rounded-xl bg-foreground/[0.03] p-3 flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                      <Ticket className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{selectedWantEvent.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
                        <Calendar className="size-3" />
                        {formatDate(selectedWantEvent.date)}
                        <MapPin className="size-3 ml-1" />
                        {selectedWantEvent.venue.city}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Ticket Type Preference
                  </label>
                  <Select
                    value={form.wantTicketType}
                    onValueChange={(val) => setForm((prev) => ({ ...prev, wantTicketType: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Any section is fine, prefer evening shows..."
                    value={form.wantNotes}
                    onChange={(e) => setForm((p) => ({ ...p, wantNotes: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="size-4 text-primary" />
              <label className="text-sm font-medium text-foreground">Exchange Proposal</label>
            </div>
            <textarea
              rows={3}
              required
              placeholder="Write a message explaining why you'd like to exchange..."
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-4">
            {form.haveEventId && form.wantEventId && (
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted mb-3">
                  Exchange Preview
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted uppercase">Have</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedHaveEvent?.name || "Not selected"}
                    </p>
                    <p className="text-xs text-muted">{form.haveTicketType} · {form.haveQuantity}×</p>
                  </div>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ArrowLeftRight className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-[10px] text-muted uppercase">Want</p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedWantEvent?.name || "Not selected"}
                    </p>
                    <p className="text-xs text-muted">{form.wantTicketType === "any" ? "Any type" : form.wantTicketType}</p>
                  </div>
                </div>
              </div>
            )}
            <Button
              size="lg"
              className="w-full"
              disabled={!canSubmit}
              loading={false}
              leftIcon={<Send className="size-4" />}
              onClick={handleSubmit}
            >
              Submit Exchange Request
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderBrowseTab = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
        <input
          type="text"
          placeholder="Search exchange requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm text-foreground shadow-sm transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filteredExchangeRequests.length === 0 ? (
        <EmptyState
          title="No exchange requests found"
          description="Try a different search or check back later"
        />
      ) : (
        <div className="space-y-4">
          {filteredExchangeRequests.map((exchange) => (
            <Card key={exchange.id} hover>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {renderExchangeCard(exchange.requesterListing, "has")}
                    <div className="hidden sm:flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary self-center">
                      <ArrowRight className="size-4" />
                    </div>
                    <div className="sm:hidden flex items-center justify-center">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary rotate-90">
                        <ArrowRight className="size-4" />
                      </div>
                    </div>
                    {renderExchangeCard(exchange.targetListing, "wants")}
                  </div>

                  {exchange.message && (
                    <div className="rounded-xl bg-foreground/[0.03] p-3">
                      <p className="text-sm text-foreground">&ldquo;{exchange.message}&rdquo;</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={exchange.requester.name}
                        src={exchange.requester.avatar}
                        size="sm"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-foreground">
                            {exchange.requester.name}
                          </span>
                          {exchange.requester.verified && (
                            <BadgeCheck className="size-3.5 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <Star className="size-3 fill-warning text-warning" />
                          {exchange.requester.rating}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" leftIcon={<Eye className="size-3.5" />}>
                        View
                      </Button>
                      <Button size="sm" leftIcon={<Send className="size-3.5" />}>
                        Send Proposal
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderMyExchangesTab = () => (
    <div className="space-y-4 animate-fade-in">
      <Tabs value={myExchangesSubTab} onValueChange={setMyExchangesSubTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="size-3.5" />
            Pending
            {groupedExchanges.pending.length > 0 && (
              <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-warning/20 text-[10px] font-bold text-warning">
                {groupedExchanges.pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted" className="gap-1.5">
            <Check className="size-3.5" />
            Accepted
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <X className="size-3.5" />
            Rejected
          </TabsTrigger>
          <TabsTrigger value="completed">
            <Check className="size-3.5" />
            Completed
          </TabsTrigger>
        </TabsList>

        {(["pending", "accepted", "rejected", "completed"] as const).map((status) => (
          <TabsContent key={status} value={status}>
            {groupedExchanges[status].length === 0 ? (
              <EmptyState
                title={`No ${status} exchanges`}
                description={
                  status === "pending"
                    ? "You don't have any pending exchange requests"
                    : status === "accepted"
                    ? "No accepted exchanges yet"
                    : status === "rejected"
                    ? "No rejected exchanges"
                    : "No completed exchanges yet"
                }
                icon={
                  status === "pending" ? (
                    <Clock className="size-7" />
                  ) : status === "accepted" ? (
                    <Check className="size-7" />
                  ) : status === "rejected" ? (
                    <X className="size-7" />
                  ) : (
                    <BadgeCheck className="size-7" />
                  )
                }
              />
            ) : (
              <div className="space-y-3">
                {groupedExchanges[status].map((exchange) => (
                  <Card key={exchange.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant={STATUS_CONFIG[exchange.status].variant} size="sm">
                            {STATUS_CONFIG[exchange.status].label}
                          </Badge>
                          <span className="text-xs text-muted">
                            {formatDate(exchange.createdAt)}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          {renderExchangeCard(exchange.requesterListing, "has")}
                          <div className="flex items-center justify-center">
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary sm:rotate-0 rotate-90">
                              <ArrowRight className="size-4" />
                            </div>
                          </div>
                          {renderExchangeCard(exchange.targetListing, "wants")}
                        </div>
                        {exchange.message && (
                          <p className="text-sm text-muted italic">&ldquo;{exchange.message}&rdquo;</p>
                        )}
                        {status === "pending" && (
                          <div className="flex items-center gap-2 pt-2 border-t border-border">
                            <Button variant="ghost" size="sm" className="text-danger" leftIcon={<X className="size-3.5" />}>
                              Decline
                            </Button>
                            <Button size="sm" leftIcon={<Check className="size-3.5" />}>
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Repeat className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Exchange Tickets</h1>
              <p className="text-sm text-muted">Swap your tickets with other fans</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="create" className="flex-1 gap-1.5">
              <Plus className="size-3.5" />
              Create Request
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex-1 gap-1.5">
              <Search className="size-3.5" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="my-exchanges" className="flex-1 gap-1.5">
              <MessageSquare className="size-3.5" />
              My Exchanges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">{renderCreateTab()}</TabsContent>
          <TabsContent value="browse">{renderBrowseTab()}</TabsContent>
          <TabsContent value="my-exchanges">{renderMyExchangesTab()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
        <div className="relative flex size-20 items-center justify-center rounded-full bg-success text-white shadow-xl shadow-success/30 animate-pop-in">
          <Check className="size-10" strokeWidth={3} />
        </div>
      </div>
      <div className="space-y-2 animate-slide-up">
        <h2 className="text-2xl font-bold text-foreground">Exchange Request Sent!</h2>
        <p className="text-muted max-w-sm mx-auto">
          We&apos;ll notify you when someone responds to your exchange request.
        </p>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button onClick={onReset} variant="secondary" leftIcon={<Plus className="size-4" />}>
          Create Another
        </Button>
        <Button variant="ghost">
          View My Exchanges
        </Button>
      </div>
    </div>
  );
}
