import { NextRequest, NextResponse } from "next/server";
import { ApiError, handleError, isOneOf, ok, readJson, requireFields } from "@/lib/api";
import { DEMO_EVENTS, EVENT_CATEGORIES } from "@/lib/mock-data";

const CATEGORIES = EVENT_CATEGORIES.map((category) => category.value);

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const featured = searchParams.get("featured");
    const query = searchParams.get("q");

    let events = DEMO_EVENTS;
    if (category) {
      events = events.filter((event) => event.category === category);
    }
    if (city) {
      events = events.filter(
        (event) => event.venue.city.toLowerCase() === city.toLowerCase(),
      );
    }
    if (featured === "true") {
      events = events.filter((event) => event.featured);
    }
    if (query) {
      const needle = query.toLowerCase();
      events = events.filter(
        (event) =>
          event.name.toLowerCase().includes(needle) ||
          event.tags.some((tag) => tag.toLowerCase().includes(needle)),
      );
    }

    return ok({ events, total: events.length });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, ["name", "category", "date", "time", "venue", "totalTickets"]);

    const name = String(body.name).trim();
    const category = String(body.category);
    const date = String(body.date);
    const time = String(body.time);

    if (name.length < 3) throw new ApiError("Event name must be at least 3 characters", 422);
    if (!isOneOf(category, CATEGORIES as string[])) {
      throw new ApiError(`Category must be one of: ${CATEGORIES.join(", ")}`, 422);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new ApiError("Date must be in YYYY-MM-DD format", 422);
    }
    if (!/^\d{2}:\d{2}/.test(time)) {
      throw new ApiError("Time must be in HH:mm format", 422);
    }

    const totalTickets = Number(body.totalTickets);
    if (!Number.isInteger(totalTickets) || totalTickets <= 0) {
      throw new ApiError("totalTickets must be a positive integer", 422);
    }

    const event = {
      id: `e${Date.now()}`,
      name,
      description: String(body.description ?? ""),
      category,
      date,
      time,
      venue: body.venue as { id: string; name: string; city: string; address: string; capacity: number },
      image: String(body.image ?? ""),
      organizer: String(body.organizer ?? ""),
      basePrice: Number(body.basePrice ?? 0),
      totalTickets,
      availableTickets: totalTickets,
      featured: body.featured === true,
      tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
    };

    return ok({ event }, 201);
  } catch (error) {
    return handleError(error);
  }
}