import { NextResponse } from "next/server";
import { fail, handleError, ok, readJson } from "@/lib/api";
import { DEMO_LISTINGS, DEMO_EVENTS, DEMO_USERS } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const listing = DEMO_LISTINGS.find((l) => l.id === id);
    if (!listing) return fail("Listing not found", 404);
    return ok({ listing });
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
    const listing = DEMO_LISTINGS.find((l) => l.id === id);
    if (!listing) return fail("Listing not found", 404);

    const body = await readJson(request);

    const updatedEvent =
      body.eventId != null
        ? DEMO_EVENTS.find((e) => e.id === String(body.eventId)) ?? listing.event
        : listing.event;

    const updatedSeller =
      body.sellerId != null
        ? DEMO_USERS.find((u) => u.id === String(body.sellerId)) ?? listing.seller
        : listing.seller;

    const updatedListing = {
      ...listing,
      ...(body.eventId != null ? { eventId: String(body.eventId), event: updatedEvent } : {}),
      ...(body.sellerId != null ? { sellerId: String(body.sellerId), seller: updatedSeller } : {}),
      ...(body.ticketType != null ? { ticketType: body.ticketType } : {}),
      ...(body.section != null ? { section: body.section } : {}),
      ...(body.row != null ? { row: body.row } : {}),
      ...(body.seat != null ? { seat: body.seat } : {}),
      ...(body.quantity != null ? { quantity: Number(body.quantity) } : {}),
      ...(body.originalPrice != null ? { originalPrice: Number(body.originalPrice) } : {}),
      ...(body.sellingPrice != null ? { sellingPrice: Number(body.sellingPrice) } : {}),
      ...(body.transferMethod != null ? { transferMethod: body.transferMethod } : {}),
      ...(body.status != null ? { status: body.status } : {}),
      ...(body.description != null ? { description: body.description } : {}),
      ...(body.ticketFile != null ? { ticketFile: body.ticketFile } : {}),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    return ok({ listing: updatedListing });
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
    const listing = DEMO_LISTINGS.find((l) => l.id === id);
    if (!listing) return fail("Listing not found", 404);
    return ok({ deleted: true, id });
  } catch (error) {
    return handleError(error);
  }
}