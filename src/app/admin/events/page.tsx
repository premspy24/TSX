"use client";

import { useState } from "react";
import {
  Calendar,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate, cn } from "@/lib/cn";
import { DEMO_EVENTS, EVENT_CATEGORIES } from "@/lib/mock-data";
import type { Event } from "@/types";

const CATEGORY_GRADIENTS: Record<string, string> = {
  concert: "from-indigo-500 to-purple-600",
  cricket: "from-amber-500 to-orange-600",
  football: "from-emerald-500 to-teal-600",
  comedy: "from-rose-500 to-pink-600",
  festival: "from-violet-500 to-fuchsia-600",
  movie: "from-slate-500 to-gray-600",
  conference: "from-blue-500 to-cyan-600",
  theatre: "from-orange-500 to-red-600",
  other: "from-teal-500 to-cyan-600",
};

function EventRow({ event, onDelete }: { event: Event; onDelete: (id: string) => void }) {
  const category = EVENT_CATEGORIES.find((c) => c.value === event.category);
  const sold = event.totalTickets - event.availableTickets;
  const sellPercent = Math.round((sold / event.totalTickets) * 100);

  return (
    <div className="flex flex-col sm:flex-row gap-4 px-4 py-4 hover:bg-slate-50 transition-colors">
      <div className={cn("h-16 w-full sm:w-24 rounded-xl bg-gradient-to-br shrink-0 flex items-center justify-center", CATEGORY_GRADIENTS[event.category])}>
        <span className="text-2xl">{category?.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{event.name}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {event.venue.name}, {event.venue.city}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(event.date)} · {event.time}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="info" size="sm">
              {category?.label}
            </Badge>
            {event.featured && (
              <Badge variant="warning" size="sm">
                <Star className="h-3 w-3 mr-1" /> Featured
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {sellPercent}% sold
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" /> {sold}/{event.totalTickets}
          </span>
          <span className="font-medium text-slate-700">From {formatCurrency(event.basePrice)}</span>
        </div>
        <div className="mt-2 h-1.5 w-full sm:w-48 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", sellPercent >= 80 ? "bg-red-500" : sellPercent >= 50 ? "bg-amber-500" : "bg-emerald-500")}
            style={{ width: `${sellPercent}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
          <span className="hidden sm:inline">View</span>
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<Pencil className="h-4 w-4" />}>
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={() => onDelete(event.id)}
        >
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </div>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(DEMO_EVENTS);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = events.filter((e) => {
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.venue.city.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all events on the platform</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Event</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card hover>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Total Events</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{events.length}</p>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Featured Events</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{events.filter((e) => e.featured).length}</p>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Categories</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{new Set(events.map((e) => e.category)).size}</p>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500">Avg Ticket Price</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {formatCurrency(Math.round(events.reduce((s, e) => s + e.basePrice, 0) / events.length))}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Filter and manage your event catalog</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 pb-0 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search events, cities, tags..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                    categoryFilter === "all"
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  All
                </button>
                {EVENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                      categoryFilter === cat.value
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<Calendar className="h-10 w-10" />}
                title="No events found"
                description="Try adjusting your search or filters."
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((event) => (
                <EventRow key={event.id} event={event} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}