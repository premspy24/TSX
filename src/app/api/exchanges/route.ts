import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  handleError,
  ok,
  readJson,
  requireFields,
} from "@/lib/api";
import { DEMO_EXCHANGES, DEMO_LISTINGS, DEMO_USERS } from "@/lib/mock-data";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requesterId = searchParams.get("requesterId");
    const status = searchParams.get("status");

    let exchanges = DEMO_EXCHANGES;

    if (requesterId) {
      exchanges = exchanges.filter((e) => e.requesterId === requesterId);
    }
    if (status) {
      exchanges = exchanges.filter((e) => e.status === status);
    }

    return ok({ exchanges, total: exchanges.length });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, ["requesterId", "requesterListingId", "targetListingId"]);

    const requesterListing = DEMO_LISTINGS.find(
      (l) => l.id === String(body.requesterListingId),
    );
    if (!requesterListing) throw new ApiError("Requester listing not found", 404);

    const targetListing = DEMO_LISTINGS.find(
      (l) => l.id === String(body.targetListingId),
    );
    if (!targetListing) throw new ApiError("Target listing not found", 404);

    const requester =
      DEMO_USERS.find((u) => u.id === String(body.requesterId)) ?? DEMO_USERS[0];

    if (requesterListing.sellerId === targetListing.sellerId) {
      throw new ApiError("Cannot exchange with your own listing", 422);
    }

    const exchange = {
      id: `ex${Date.now()}`,
      requesterId: requester.id,
      requester,
      requesterListingId: requesterListing.id,
      requesterListing,
      targetListingId: targetListing.id,
      targetListing,
      message: body.message ? String(body.message) : null,
      status: "pending" as const,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    return ok({ exchange }, 201);
  } catch (error) {
    return handleError(error);
  }
}