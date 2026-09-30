import { NextResponse } from "next/server";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { DEMO_EVENTS } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const event = DEMO_EVENTS.find((e) => e.id === id);
    if (!event) return fail("Event not found", 404);
    return ok({ event });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const eventIndex = DEMO_EVENTS.findIndex((e) => e.id === id);
    if (eventIndex === -1) return fail("Event not found", 404);

    const body = await readJson(request);
    const existing = DEMO_EVENTS[eventIndex];
    const updatedEvent = {
      ...existing,
      ...(body.name != null ? { name: String(body.name) } : {}),
      ...(body.description != null ? { description: String(body.description) } : {}),
      ...(body.category != null ? { category: body.category } : {}),
      ...(body.date != null ? { date: String(body.date) } : {}),
      ...(body.time != null ? { time: String(body.time) } : {}),
      ...(body.venue != null ? { venue: body.venue } : {}),
      ...(body.image != null ? { image: String(body.image) } : {}),
      ...(body.organizer != null ? { organizer: String(body.organizer) } : {}),
      ...(body.basePrice != null ? { basePrice: Number(body.basePrice) } : {}),
      ...(body.totalTickets != null ? { totalTickets: Number(body.totalTickets) } : {}),
      ...(body.featured != null ? { featured: Boolean(body.featured) } : {}),
      ...(Array.isArray(body.tags) ? { tags: body.tags as string[] } : {}),
    };

    return ok({ event: updatedEvent });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const event = DEMO_EVENTS.find((e) => e.id === id);
    if (!event) return fail("Event not found", 404);
    return ok({ deleted: true, id });
  } catch (error) {
    return handleError(error);
  }
}