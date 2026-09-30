import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  handleError,
  ok,
  readJson,
  requireFields,
} from "@/lib/api";
import { DEMO_ORDERS, DEMO_REVIEWS, DEMO_USERS } from "@/lib/mock-data";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reviewerId = searchParams.get("reviewerId");
    const revieweeId = searchParams.get("revieweeId");
    const orderId = searchParams.get("orderId");

    let reviews = DEMO_REVIEWS;

    if (reviewerId) {
      reviews = reviews.filter((r) => r.reviewerId === reviewerId);
    }
    if (revieweeId) {
      reviews = reviews.filter((r) => r.revieweeId === revieweeId);
    }
    if (orderId) {
      reviews = reviews.filter((r) => r.orderId === orderId);
    }

    return ok({ reviews, total: reviews.length });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, ["reviewerId", "revieweeId", "orderId", "rating", "comment"]);

    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new ApiError("rating must be an integer between 1 and 5", 422);
    }

    const reviewerId = String(body.reviewerId);
    const revieweeId = String(body.revieweeId);
    const orderId = String(body.orderId);
    const comment = String(body.comment).trim();

    if (reviewerId === revieweeId) {
      throw new ApiError("Cannot review yourself", 422);
    }

    const reviewer = DEMO_USERS.find((u) => u.id === reviewerId) ?? DEMO_USERS[0];
    const reviewee = DEMO_USERS.find((u) => u.id === revieweeId) ?? DEMO_USERS[1];
    const order = DEMO_ORDERS.find((o) => o.id === orderId);
    if (!order) throw new ApiError("Order not found", 404);

    const duplicate = DEMO_REVIEWS.find(
      (r) => r.orderId === orderId && r.reviewerId === reviewerId,
    );
    if (duplicate) {
      throw new ApiError("You have already reviewed this order", 409);
    }

    const review = {
      id: `r${Date.now()}`,
      reviewerId: reviewer.id,
      revieweeId: reviewee.id,
      orderId: order.id,
      rating,
      comment,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    return ok({ review }, 201);
  } catch (error) {
    return handleError(error);
  }
}