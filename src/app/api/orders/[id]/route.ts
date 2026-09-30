import { NextResponse } from "next/server";
import {
  ApiError,
  fail,
  handleError,
  isOneOf,
  ok,
  readJson,
} from "@/lib/api";
import { DEMO_ORDERS } from "@/lib/mock-data";

const ORDER_STATUSES = [
  "pending",
  "payment_processing",
  "payment_complete",
  "transferring",
  "transferred",
  "completed",
  "cancelled",
  "refunded",
  "disputed",
] as const;

const VALID_TRANSITIONS: Record<string, readonly string[]> = {
  pending: ["payment_processing", "cancelled"],
  payment_processing: ["payment_complete", "failed", "cancelled"],
  payment_complete: ["transferring", "cancelled"],
  transferring: ["transferred"],
  transferred: ["completed"],
  completed: [],
  cancelled: [],
  refunded: [],
  disputed: [],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const order = DEMO_ORDERS.find((o) => o.id === id);
    if (!order) return fail("Order not found", 404);
    return ok({ order });
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
    const order = DEMO_ORDERS.find((o) => o.id === id);
    if (!order) return fail("Order not found", 404);

    const body = await readJson(request);

    if (body.orderStatus != null) {
      const newStatus = String(body.orderStatus);
      if (!isOneOf(newStatus, ORDER_STATUSES)) {
        throw new ApiError(
          `orderStatus must be one of: ${ORDER_STATUSES.join(", ")}`,
          422,
        );
      }
      const allowed = VALID_TRANSITIONS[order.orderStatus];
      if (!allowed.includes(newStatus)) {
        throw new ApiError(
          `Cannot transition from "${order.orderStatus}" to "${newStatus}"`,
          422,
        );
      }
    }

    const updatedOrder = {
      ...order,
      ...(body.orderStatus != null ? { orderStatus: body.orderStatus } : {}),
      ...(body.paymentStatus != null ? { paymentStatus: body.paymentStatus } : {}),
      ...(body.transferCode != null ? { transferCode: String(body.transferCode) } : {}),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    return ok({ order: updatedOrder });
  } catch (error) {
    return handleError(error);
  }
}