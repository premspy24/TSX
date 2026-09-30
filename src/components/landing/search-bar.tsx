"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import { EVENT_CATEGORIES, INDIAN_CITIES } from "@/lib/mock-data";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [city, setCity] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (city && city !== "all") params.set("city", city);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    router.push(`/discover?${params.toString()}`);
  }

  return (
    <div className="relative z-10 -mt-12 px-4 sm:-mt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="glass rounded-3xl border-white/40 p-4 shadow-2xl shadow-indigo-950/15 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto] lg:items-center">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              icon={<Search className="size-5" aria-hidden="true" />}
              placeholder="Search events, artists, venues..."
              className="h-12 text-base lg:min-w-[300px]"
              aria-label="Search events"
            />

            <Select value={city} onValueChange={(value) => setCity(value)}>
              <SelectTrigger className="h-12 w-full lg:w-44" aria-label="City">
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

            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              icon={<CalendarDays className="size-4" aria-hidden="true" />}
              className="h-12 w-full lg:w-40"
              aria-label="Date from"
            />

            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              icon={<CalendarDays className="size-4" aria-hidden="true" />}
              className="h-12 w-full lg:w-40"
              aria-label="Date to"
            />

            <Button
              size="lg"
              onClick={handleSearch}
              className="h-12 w-full lg:w-auto"
            >
              <Search className="size-4" aria-hidden="true" />
              Search Tickets
            </Button>
          </div>

          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="mr-1 hidden shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted sm:flex">
              <MapPin className="size-3.5" aria-hidden="true" />
              Browse
            </span>
            <button
              onClick={() => setSelectedCategory("")}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm",
                selectedCategory === ""
                  ? "border-primary bg-primary text-white shadow-sm shadow-primary/25"
                  : "border-border bg-white text-foreground/70 hover:border-primary/40 hover:text-foreground"
              )}
            >
              All Categories
            </button>
            {EVENT_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.value ? "" : category.value
                  )
                }
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm",
                  selectedCategory === category.value
                    ? "border-primary bg-primary text-white shadow-sm shadow-primary/25"
                    : "border-border bg-white text-foreground/70 hover:border-primary/40 hover:text-foreground"
                )}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}