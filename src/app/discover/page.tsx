"use client";

import * as React from "react";
import {
  CalendarDays,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DEMO_EVENTS, EVENT_CATEGORIES, INDIAN_CITIES } from "@/lib/mock-data";
import type { EventCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/ui/event-card";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "relevant", label: "Relevant" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "date", label: "Date: Soonest" },
  { value: "popular", label: "Most Popular" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export default function DiscoverPage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<EventCategory | "all">("all");
  const [city, setCity] = React.useState<string>("all");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [priceMin, setPriceMin] = React.useState("");
  const [priceMax, setPriceMax] = React.useState("");
  const [sort, setSort] = React.useState<SortValue>("relevant");
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const hasActiveFilters =
    category !== "all" ||
    city !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    priceMin !== "" ||
    priceMax !== "";

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setCity("all");
    setDateFrom("");
    setDateTo("");
    setPriceMin("");
    setPriceMax("");
    setSort("relevant");
  };

  const filteredEvents = React.useMemo(() => {
    let results = [...DEMO_EVENTS];

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.venue.name.toLowerCase().includes(q) ||
          e.venue.city.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category !== "all") {
      results = results.filter((e) => e.category === category);
    }

    if (city !== "all") {
      results = results.filter((e) => e.venue.city === city);
    }

    if (dateFrom) {
      results = results.filter((e) => e.date >= dateFrom);
    }
    if (dateTo) {
      results = results.filter((e) => e.date <= dateTo);
    }

    if (priceMin) {
      results = results.filter((e) => e.basePrice >= Number(priceMin));
    }
    if (priceMax) {
      results = results.filter((e) => e.basePrice <= Number(priceMax));
    }

    switch (sort) {
      case "price-asc":
        results.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-desc":
        results.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "date":
        results.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "popular":
        results.sort((a, b) => b.availableTickets - a.availableTickets);
        break;
      default:
        results.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.date.localeCompare(b.date);
        });
    }

    return results;
  }, [query, category, city, dateFrom, dateTo, priceMin, priceMax, sort]);

  const filterContent = (
    <div className="space-y-5">
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
              category === "all"
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "bg-primary/5 text-foreground/70 hover:bg-primary/10 hover:text-foreground"
            )}
          >
            All
          </button>
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value as EventCategory)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                category === cat.value
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "bg-primary/5 text-foreground/70 hover:bg-primary/10 hover:text-foreground"
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
            City
          </p>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="All cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {INDIAN_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
            Sort by
          </p>
          <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
          Date Range
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            icon={<CalendarDays />}
          />
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            icon={<CalendarDays />}
          />
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted">
          Price Range (₹)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            min={0}
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            min={0}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          leftIcon={<X />}
          className="w-full text-danger hover:bg-danger/5 hover:text-danger"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Discover Events
            </h1>
            <p className="mt-2 text-base text-muted">
              Find tickets to concerts, sports, comedy, and more
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl">
            <Input
              placeholder="Search events, venues, cities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search />}
              className="h-12 rounded-2xl border-2 bg-white text-base shadow-sm focus:shadow-md focus:shadow-primary/10 sm:h-13"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="hidden lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          <aside className="sticky top-24 self-start">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    Filters
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-medium text-danger hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                {filterContent}
              </CardContent>
            </Card>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">
                  {filteredEvents.length}
                </span>{" "}
                event{filteredEvents.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Search />}
                title="No events found"
                description="Try adjusting your filters or search terms"
                action={
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              <span className="font-semibold text-foreground">
                {filteredEvents.length}
              </span>{" "}
              event{filteredEvents.length !== 1 ? "s" : ""} found
            </p>

            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
                <SelectTrigger className="h-9 w-auto min-w-[140px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={hasActiveFilters ? "default" : "secondary"}
                size="sm"
                leftIcon={<SlidersHorizontal />}
                onClick={() => setMobileFiltersOpen(true)}
                className="relative"
              >
                Filters
                {hasActiveFilters && (
                  <span className="absolute -right-1 -top-1 size-2 rounded-full bg-white" />
                )}
              </Button>
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setCategory("all")}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                category === "all"
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "bg-white text-foreground/70 border border-border hover:border-primary/30 hover:text-foreground"
              )}
            >
              All
            </button>
            {EVENT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value as EventCategory)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                  category === cat.value
                    ? "bg-primary text-white shadow-sm shadow-primary/25"
                    : "bg-white text-foreground/70 border border-border hover:border-primary/30 hover:text-foreground"
                )}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Search />}
              title="No events found"
              description="Try adjusting your filters or search terms"
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </div>

      <Modal open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <ModalContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle>Filters</ModalTitle>
          </ModalHeader>
          {filterContent}
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
