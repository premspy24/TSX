import { NextResponse } from "next/server";
import {
  ApiError,
  fail,
  handleError,
  isOneOf,
  ok,
  readJson,
} from "@/lib/api";
import { DEMO_EXCHANGES } from "@/lib/mock-data";

const EXCHANGE_STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "countered",
  "completed",
  "cancelled",
] as const;

const VALID_ACTIONS: Record<string, readonly string[]> = {
  pending: ["accepted", "rejected", "cancelled", "countered"],
  countered: ["accepted", "rejected", "cancelled"],
  accepted: ["completed", "cancelled"],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const exchange = DEMO_EXCHANGES.find((e) => e.id === id);
    if (!exchange) return fail("Exchange request not found", 404);
    return ok({ exchange });
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
    const exchange = DEMO_EXCHANGES.find((e) => e.id === id);
    if (!exchange) return fail("Exchange request not found", 404);

    const body = await readJson(request);

    if (body.action != null) {
      const action = String(body.action);
      if (!isOneOf(action, EXCHANGE_STATUSES)) {
        throw new ApiError(
          `action must be one of: ${EXCHANGE_STATUSES.join(", ")}`,
          422,
        );
      }

      if (exchange.status === "completed" || exchange.status === "cancelled" || exchange.status === "rejected") {
        throw new ApiError(`Exchange is already in "${exchange.status}" state`, 409);
      }

      const allowed = VALID_ACTIONS[exchange.status];
      if (allowed && !allowed.includes(action)) {
        throw new ApiError(
          `Cannot perform "${action}" on exchange in "${exchange.status}" state`,
          422,
        );
      }
    }

    const updatedExchange = {
      ...exchange,
      ...(body.action != null ? { status: body.action } : {}),
      ...(body.message != null ? { message: String(body.message) } : {}),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    return ok({ exchange: updatedExchange });
  } catch (error) {
    return handleError(error);
  }
}