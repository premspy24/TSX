"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  Upload,
  FileText,
  Tag,
  Armchair,
  Ticket,
  Shield,
  Camera,
  IndianRupee,
  X,
  Plus,
  Share2,
  Copy,
  BadgeCheck,
} from "lucide-react";
import { cn, formatCurrency, formatDate, calculatePlatformFee, calculateSellerPayout } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { DEMO_EVENTS, EVENT_CATEGORIES } from "@/lib/mock-data";
import type { SellStep, TicketType } from "@/types";

type FormData = {
  eventId: string;
  customEvent: {
    name: string;
    date: string;
    venue: string;
    category: string;
  };
  ticketType: TicketType;
  section: string;
  row: string;
  seat: string;
  quantity: number;
  originalPrice: number;
  sellingPrice: number;
  ticketFile: File | null;
  transferMethod: string;
  description: string;
  verificationChecked: boolean;
  termsChecked: boolean;
  proofFile: File | null;
};

const STEPS: { key: SellStep; label: string; number: number }[] = [
  { key: "event", label: "Select Event", number: 1 },
  { key: "details", label: "Ticket Details", number: 2 },
  { key: "verification", label: "Verification", number: 3 },
  { key: "preview", label: "Preview", number: 4 },
  { key: "publish", label: "Publish", number: 5 },
];

const TICKET_TYPES: { value: TicketType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "vip", label: "VIP" },
  { value: "premium", label: "Premium" },
  { value: "general", label: "General" },
  { value: "standing", label: "Standing" },
  { value: "box", label: "Box" },
];

const TRANSFER_METHODS = [
  { value: "instant_transfer", label: "Instant Transfer" },
  { value: "manual_transfer", label: "Manual Transfer" },
  { value: "meet_at_venue", label: "Meet at Venue" },
];

export default function SellPage() {
  const [currentStep, setCurrentStep] = useState<SellStep>("event");
  const [searchQuery, setSearchQuery] = useState("");
  const [showManualForm, setShowManualForm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProofDragOver, setIsProofDragOver] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    eventId: "",
    customEvent: { name: "", date: "", venue: "", category: "" },
    ticketType: "standard",
    section: "",
    row: "",
    seat: "",
    quantity: 1,
    originalPrice: 0,
    sellingPrice: 0,
    ticketFile: null,
    transferMethod: "instant_transfer",
    description: "",
    verificationChecked: false,
    termsChecked: false,
    proofFile: null,
  });

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return DEMO_EVENTS;
    return DEMO_EVENTS.filter(
      (e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedEvent = useMemo(() => {
    return DEMO_EVENTS.find((e) => e.id === formData.eventId) || null;
  }, [formData.eventId]);

  const platformFee = calculatePlatformFee(formData.sellingPrice);
  const sellerPayout = calculateSellerPayout(formData.sellingPrice);
  const isBelowOriginal = formData.sellingPrice > 0 && formData.originalPrice > 0 && formData.sellingPrice < formData.originalPrice;

  const stepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "event":
        return !!(formData.eventId || (showManualForm && formData.customEvent.name && formData.customEvent.date));
      case "details":
        return formData.sellingPrice > 0 && formData.quantity >= 1;
      case "verification":
        return formData.verificationChecked && formData.termsChecked;
      case "preview":
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (step: SellStep) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getEventDisplayName = () => {
    if (selectedEvent) return selectedEvent.name;
    if (showManualForm && formData.customEvent.name) return formData.customEvent.name;
    return "";
  };

  const getCategoryLabel = (value: string) => {
    return EVENT_CATEGORIES.find((c) => c.value === value)?.label || value;
  };

  const renderProgress = () => (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isActive = step.key === currentStep;
          const isCompleted = stepIndex > i;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-9 sm:size-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                    isCompleted && "bg-success text-white shadow-md shadow-success/25",
                    isActive && "bg-primary text-white ring-4 ring-primary/20 shadow-lg shadow-primary/25",
                    !isActive && !isCompleted && "bg-foreground/5 text-muted border-2 border-border"
                  )}
                >
                  {isCompleted ? <Check className="size-4 sm:size-5" strokeWidth={3} /> : step.number}
                </div>
                <span
                  className={cn(
                    "hidden sm:block text-xs font-medium transition-colors",
                    isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 sm:mx-3 mb-5 sm:mb-0 flex-1">
                  <div
                    className={cn(
                      "h-0.5 rounded-full transition-all duration-500",
                      isCompleted ? "bg-success" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 sm:hidden flex items-center justify-between">
        <span className="text-xs font-medium text-primary">
          Step {stepIndex + 1} of {STEPS.length}
        </span>
        <span className="text-xs font-medium text-muted">
          {STEPS[stepIndex].label}
        </span>
      </div>
    </div>
  );

  const renderEventSelection = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Select Your Event</h2>
        <p className="mt-1 text-sm text-muted">Choose the event you want to sell tickets for</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
        <input
          type="text"
          placeholder="Search events by name, venue, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm text-foreground shadow-sm transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredEvents.map((event) => {
            const isSelected = formData.eventId === event.id;
            return (
              <button
                key={event.id}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, eventId: event.id }));
                  setShowManualForm(false);
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border-2 bg-white p-4 text-left transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/30 hover:shadow-md"
                )}
              >
                {isSelected && (
                  <div className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/25">
                    <Check className="size-4" strokeWidth={3} />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Ticket className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground line-clamp-2">{event.name}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3" />
                        {formatDate(event.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3" />
                        {event.venue.city}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {getCategoryLabel(event.category)}
                      </Badge>
                      <Badge
                        variant={event.availableTickets <= 15 ? "danger" : "success"}
                        size="sm"
                      >
                        {event.availableTickets} tickets left
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No events found"
          description="Try a different search or add your event manually below"
        />
      )}

      <div className="border-t border-border pt-6">
        {!showManualForm ? (
          <button
            onClick={() => setShowManualForm(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <Plus className="size-4" />
            Can&apos;t find your event? Add it manually
          </button>
        ) : (
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Add Event Manually</CardTitle>
                <button
                  onClick={() => setShowManualForm(false)}
                  className="flex size-7 items-center justify-center rounded-lg text-muted hover:bg-foreground/5 hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Event Name"
                    required
                    placeholder="e.g. Coldplay: Music of the Spheres"
                    value={formData.customEvent.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customEvent: { ...prev.customEvent, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <Input
                  label="Date"
                  type="date"
                  required
                  value={formData.customEvent.date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customEvent: { ...prev.customEvent, date: e.target.value },
                    }))
                  }
                />
                <Input
                  label="Venue"
                  placeholder="e.g. Jio World Centre, Mumbai"
                  value={formData.customEvent.venue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customEvent: { ...prev.customEvent, venue: e.target.value },
                    }))
                  }
                />
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Category
                  </label>
                  <Select
                    value={formData.customEvent.category}
                    onValueChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        customEvent: { ...prev.customEvent, category: val },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderTicketDetails = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Ticket Details</h2>
        <p className="mt-1 text-sm text-muted">
          Provide details about the tickets you want to sell
          {getEventDisplayName() && (
            <span className="ml-1 font-medium text-primary">— {getEventDisplayName()}</span>
          )}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Ticket Type <span className="text-danger">*</span>
              </label>
              <Select
                value={formData.ticketType}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, ticketType: val as TicketType }))
                }
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">Quantity</label>
              <div className="flex h-11 items-center rounded-xl border border-border bg-white">
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: Math.max(1, prev.quantity - 1),
                    }))
                  }
                  className="flex size-full items-center justify-center px-3 text-muted hover:text-foreground transition-colors"
                >
                  <span className="text-lg font-medium">−</span>
                </button>
                <span className="flex-1 text-center text-sm font-semibold text-foreground tabular-nums">
                  {formData.quantity}
                </span>
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: Math.min(10, prev.quantity + 1),
                    }))
                  }
                  className="flex size-full items-center justify-center px-3 text-muted hover:text-foreground transition-colors"
                >
                  <span className="text-lg font-medium">+</span>
                </button>
              </div>
            </div>
            <Input
              label="Section"
              placeholder="e.g. A, VIP, P1"
              value={formData.section}
              onChange={(e) => setFormData((prev) => ({ ...prev, section: e.target.value }))}
              icon={<Armchair className="size-4" />}
            />
            <Input
              label="Row"
              placeholder="e.g. 5, 12"
              value={formData.row}
              onChange={(e) => setFormData((prev) => ({ ...prev, row: e.target.value }))}
            />
            <div className="sm:col-span-2">
              <Input
                label="Seat"
                placeholder="e.g. 12, 45A"
                value={formData.seat}
                onChange={(e) => setFormData((prev) => ({ ...prev, seat: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Original Price"
              type="number"
              required
              placeholder="0"
              min={0}
              value={formData.originalPrice || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  originalPrice: Number(e.target.value),
                }))
              }
              icon={<IndianRupee className="size-4" />}
            />
            <Input
              label="Selling Price"
              type="number"
              required
              placeholder="0"
              min={1}
              value={formData.sellingPrice || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sellingPrice: Number(e.target.value),
                }))
              }
              icon={<IndianRupee className="size-4" />}
              error={formData.sellingPrice > 0 && formData.sellingPrice < 10 ? "Price must be at least ₹10" : undefined}
            />
          </div>
          {formData.sellingPrice > 0 && (
            <div className="mt-4 rounded-xl bg-foreground/[0.03] p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Platform fee (10%)</span>
                <span className="font-medium text-foreground">{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Your earnings</span>
                <span className="font-semibold text-success">{formatCurrency(sellerPayout)}</span>
              </div>
              {isBelowOriginal && (
                <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-success">
                  <Tag className="size-3" />
                  Priced below original — more likely to sell fast!
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Ticket File
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) setFormData((prev) => ({ ...prev, ticketFile: file }));
            }}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-foreground/[0.02]"
            )}
            onClick={() => document.getElementById("ticket-file-input")?.click()}
          >
            {formData.ticketFile ? (
              <>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-success/10 text-success">
                  <FileText className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{formData.ticketFile.name}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, ticketFile: null }));
                    }}
                    className="mt-1 text-xs text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Drop your ticket file here or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted">Accepts images and PDFs up to 10MB</p>
                </div>
              </>
            )}
            <input
              id="ticket-file-input"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFormData((prev) => ({ ...prev, ticketFile: file }));
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Transfer Method
              </label>
              <Select
                value={formData.transferMethod}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, transferMethod: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSFER_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Description
                </label>
                <span className="text-xs text-muted tabular-nums">
                  {formData.description.length}/280
                </span>
              </div>
              <textarea
                maxLength={280}
                rows={3}
                placeholder="Why are you selling? Any special details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition-all placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Ticket Verification</h2>
        <p className="mt-1 text-sm text-muted">
          Help us verify your ticket to build buyer trust
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-5">
          <label
            className={cn(
              "flex items-start gap-3.5 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200",
              formData.verificationChecked
                ? "border-success bg-success/5"
                : "border-border hover:border-primary/30"
            )}
          >
            <input
              type="checkbox"
              checked={formData.verificationChecked}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  verificationChecked: e.target.checked,
                }))
              }
              className="sr-only"
            />
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200",
                formData.verificationChecked
                  ? "border-success bg-success text-white"
                  : "border-border"
              )}
            >
              {formData.verificationChecked && <Check className="size-3.5" strokeWidth={3} />}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                I confirm this ticket is genuine and legally transferable
              </p>
              <p className="mt-0.5 text-xs text-muted">
                By checking this, you affirm the authenticity of your ticket
              </p>
            </div>
          </label>

          <label
            className={cn(
              "flex items-start gap-3.5 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200",
              formData.termsChecked
                ? "border-success bg-success/5"
                : "border-border hover:border-primary/30"
            )}
          >
            <input
              type="checkbox"
              checked={formData.termsChecked}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  termsChecked: e.target.checked,
                }))
              }
              className="sr-only"
            />
            <div
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200",
                formData.termsChecked
                  ? "border-success bg-success text-white"
                  : "border-border"
              )}
            >
              {formData.termsChecked && <Check className="size-3.5" strokeWidth={3} />}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                I understand that listing fake tickets will result in account suspension
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Our zero-tolerance policy protects all users on the platform
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Upload Purchase Proof
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsProofDragOver(true);
            }}
            onDragLeave={() => setIsProofDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsProofDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) setFormData((prev) => ({ ...prev, proofFile: file }));
            }}
            className={cn(
              "flex flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer",
              isProofDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-foreground/[0.02]"
            )}
            onClick={() => document.getElementById("proof-file-input")?.click()}
          >
            {formData.proofFile ? (
              <>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-success/10 text-success">
                  <Camera className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{formData.proofFile.name}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, proofFile: null }));
                    }}
                    className="mt-1 text-xs text-danger hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Camera className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Upload screenshot or PDF of purchase confirmation
                  </p>
                  <p className="mt-1 text-xs text-muted">Optional but recommended for faster verification</p>
                </div>
              </>
            )}
            <input
              id="proof-file-input"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFormData((prev) => ({ ...prev, proofFile: file }));
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl bg-foreground/[0.03] border border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Verification status</span>
          <Badge variant="warning">
            <Clock className="size-3" />
            Pending
          </Badge>
        </div>
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Verification Process</p>
            <p className="mt-0.5 text-xs text-muted">
              Our team will verify your ticket within 24 hours. Verified tickets get a trust badge and appear higher in search results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Preview Your Listing</h2>
        <p className="mt-1 text-sm text-muted">Review everything before publishing</p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              {formData.ticketType}
            </Badge>
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              {formData.quantity} ticket{formData.quantity > 1 ? "s" : ""}
            </Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-white line-clamp-2">
            {getEventDisplayName()}
          </h3>
          {selectedEvent && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {formatDate(selectedEvent.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {selectedEvent.time}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {selectedEvent.venue.name}
              </span>
            </div>
          )}
          {(formData.section || formData.row || formData.seat) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {formData.section && <Badge className="bg-white/20 text-white backdrop-blur-sm">Section {formData.section}</Badge>}
              {formData.row && <Badge className="bg-white/20 text-white backdrop-blur-sm">Row {formData.row}</Badge>}
              {formData.seat && <Badge className="bg-white/20 text-white backdrop-blur-sm">Seat {formData.seat}</Badge>}
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {formData.description && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted mb-1">Description</p>
              <p className="text-sm text-foreground">{formData.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-foreground/[0.03] p-3">
              <p className="text-xs text-muted">Transfer Method</p>
              <p className="mt-0.5 text-sm font-medium text-foreground capitalize">
                {formData.transferMethod.replace(/_/g, " ")}
              </p>
            </div>
            <div className="rounded-xl bg-foreground/[0.03] p-3">
              <p className="text-xs text-muted">Verification</p>
              <p className="mt-0.5 text-sm font-medium text-foreground capitalize flex items-center gap-1">
                {formData.verificationChecked ? (
                  <>
                    <BadgeCheck className="size-4 text-success" />
                    Pending Review
                  </>
                ) : (
                  "Not verified"
                )}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Selling price</span>
              <span className="font-medium text-foreground">{formatCurrency(formData.sellingPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Platform fee (10%)</span>
              <span className="font-medium text-danger">-{formatCurrency(platformFee)}</span>
            </div>
            <div className="border-t border-border pt-2.5 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Your payout</span>
              <span className="text-lg font-bold text-success">{formatCurrency(sellerPayout)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Everything look right?</p>
            <Button variant="ghost" size="sm" onClick={() => goToStep("details")}>
              Edit details
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPublish = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="relative flex flex-col items-center text-center py-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
          <div className="relative flex size-20 items-center justify-center rounded-full bg-success text-white shadow-xl shadow-success/30 animate-pop-in">
            <Check className="size-10" strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-2 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Your ticket is now listed!
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Your listing for <span className="font-medium text-foreground">{getEventDisplayName()}</span> is live and visible to buyers.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button size="lg" leftIcon={<BadgeCheck className="size-4" />} rightIcon={<ChevronRight className="size-4" />} onClick={() => {}}>
            View Listing
          </Button>
          <Button
            size="lg"
            variant="outline"
            leftIcon={<Plus className="size-4" />}
            onClick={() => window.location.reload()}
          >
            List Another Ticket
          </Button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Button variant="secondary" leftIcon={<Share2 className="size-4" />} onClick={() => {}}>
            Share Listing
          </Button>
          <Button
            variant="ghost"
            leftIcon={<Copy className="size-4" />}
            onClick={() => {
              navigator.clipboard?.writeText("https://ticketswapx.com/listing/demo");
            }}
          >
            Copy Link
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-purple-500/5 border border-primary/10 p-6 text-center">
        <div className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/5 blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-purple-500/5 blur-2xl" aria-hidden="true" />
        <div className="relative">
          <div className="flex justify-center gap-1.5 mb-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "size-2 rounded-full animate-slide-up",
                  i % 3 === 0 && "bg-primary",
                  i % 3 === 1 && "bg-success",
                  i % 3 === 2 && "bg-warning"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-foreground">
            Pro tip: Listings with verified tickets sell 3x faster!
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "event":
        return renderEventSelection();
      case "details":
        return renderTicketDetails();
      case "verification":
        return renderVerification();
      case "preview":
        return renderPreview();
      case "publish":
        return renderPublish();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Sell a Ticket</h1>
          <p className="mt-1 text-sm text-muted">
            List your tickets in a few easy steps
          </p>
        </div>

        {renderProgress()}

        {renderCurrentStep()}

        {currentStep !== "publish" && (
          <div className="sticky bottom-20 sm:bottom-0 mt-8 flex items-center justify-between gap-3 bg-surface pt-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-t border-border sm:border-0">
            <Button
              variant="ghost"
              leftIcon={<ChevronLeft className="size-4" />}
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              Back
            </Button>
            <Button
              onClick={goNext}
              disabled={!canProceed()}
              rightIcon={stepIndex < STEPS.length - 1 ? <ChevronRight className="size-4" /> : <Check className="size-4" />}
            >
              {stepIndex === STEPS.length - 2 ? "Publish Listing" : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
