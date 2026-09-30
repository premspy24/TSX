import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  handleError,
  isOneOf,
  ok,
  readJson,
  requireFields,
} from "@/lib/api";
import { DEMO_EVENTS, DEMO_LISTINGS, DEMO_USERS } from "@/lib/mock-data";

const TICKET_TYPES = ["standard", "vip", "premium", "general", "standing", "box"] as const;
const TRANSFER_METHODS = [
  "instant_transfer",
  "manual_transfer",
  "meet_at_venue",
] as const;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get("eventId");
    const sellerId = searchParams.get("sellerId");
    const ticketType = searchParams.get("ticketType");
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    let listings = DEMO_LISTINGS;

    if (eventId) {
      listings = listings.filter((l) => l.eventId === eventId);
    }
    if (sellerId) {
      listings = listings.filter((l) => l.sellerId === sellerId);
    }
    if (ticketType) {
      listings = listings.filter((l) => l.ticketType === ticketType);
    }
    if (status) {
      listings = listings.filter((l) => l.status === status);
    }
    if (query) {
      const needle = query.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.event.name.toLowerCase().includes(needle) ||
          (l.description?.toLowerCase().includes(needle) ?? false),
      );
    }

    return ok({ listings, total: listings.length });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, [
      "eventId",
      "sellerId",
      "ticketType",
      "quantity",
      "sellingPrice",
    ]);

    const ticketType = String(body.ticketType);
    if (!isOneOf(ticketType, TICKET_TYPES)) {
      throw new ApiError(
        `ticketType must be one of: ${TICKET_TYPES.join(", ")}`,
        422,
      );
    }

    const transferMethod = body.transferMethod ? String(body.transferMethod) : "instant_transfer";
    if (!isOneOf(transferMethod, TRANSFER_METHODS)) {
      throw new ApiError(
        `transferMethod must be one of: ${TRANSFER_METHODS.join(", ")}`,
        422,
      );
    }

    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError("quantity must be a positive integer", 422);
    }

    const sellingPrice = Number(body.sellingPrice);
    if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
      throw new ApiError("sellingPrice must be a positive number", 422);
    }

    const event = DEMO_EVENTS.find((e) => e.id === String(body.eventId));
    if (!event) throw new ApiError("Event not found", 404);

    const seller =
      DEMO_USERS.find((u) => u.id === String(body.sellerId)) ?? DEMO_USERS[0];

    const listing = {
      id: `l${Date.now()}`,
      eventId: event.id,
      event,
      sellerId: seller.id,
      seller,
      ticketType,
      section: body.section ? String(body.section) : undefined,
      row: body.row ? String(body.row) : undefined,
      seat: body.seat ? String(body.seat) : undefined,
      quantity,
      originalPrice: Number(body.originalPrice ?? sellingPrice),
      sellingPrice,
      verified: false,
      verificationStatus: "pending" as const,
      transferMethod,
      status: "active" as const,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      description: body.description ? String(body.description) : undefined,
      ticketFile: body.ticketFile ? String(body.ticketFile) : undefined,
      views: 0,
      watchers: 0,
    };

    return ok({ listing }, 201);
  } catch (error) {
    return handleError(error);
  }
}