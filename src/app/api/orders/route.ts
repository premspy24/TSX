import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  handleError,
  isOneOf,
  ok,
  readJson,
  requireFields,
} from "@/lib/api";
import { env } from "@/lib/env";
import { DEMO_LISTINGS, DEMO_ORDERS, DEMO_USERS } from "@/lib/mock-data";
import { razorpayProvider } from "@/lib/payments";

const PAYMENT_METHODS = ["upi", "card", "netbanking", "wallet"] as const;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    let orders = DEMO_ORDERS;

    if (userId) {
      orders = orders.filter(
        (o) => o.buyerId === userId || o.sellerId === userId,
      );
    }
    if (role === "buyer" && userId) {
      orders = orders.filter((o) => o.buyerId === userId);
    }
    if (role === "seller" && userId) {
      orders = orders.filter((o) => o.sellerId === userId);
    }
    if (status) {
      orders = orders.filter((o) => o.orderStatus === status);
    }

    return ok({ orders, total: orders.length });
  } catch (error) {
    return handleError(error);
  }
}

function calculatePlatformFee(total: number): number {
  return Math.round(total * (env.PLATFORM_FEE_PERCENT / 100));
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, [
      "listingId",
      "buyerId",
      "quantity",
      "paymentMethod",
    ]);

    const paymentMethod = String(body.paymentMethod);
    if (!isOneOf(paymentMethod, PAYMENT_METHODS)) {
      throw new ApiError(
        `paymentMethod must be one of: ${PAYMENT_METHODS.join(", ")}`,
        422,
      );
    }

    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError("quantity must be a positive integer", 422);
    }

    const listing = DEMO_LISTINGS.find((l) => l.id === String(body.listingId));
    if (!listing) throw new ApiError("Listing not found", 404);
    if (listing.status !== "active") {
      throw new ApiError("Listing is not available", 410);
    }
    if (quantity > listing.quantity) {
      throw new ApiError("Requested quantity exceeds available quantity", 422);
    }

    const buyerId = String(body.buyerId);
    const sellerId = body.sellerId ? String(body.sellerId) : listing.sellerId;
    const buyer = DEMO_USERS.find((u) => u.id === buyerId) ?? DEMO_USERS[0];
    const seller = DEMO_USERS.find((u) => u.id === sellerId) ?? DEMO_USERS[1];

    const totalPrice = listing.sellingPrice * quantity;
    const platformFee = calculatePlatformFee(totalPrice);
    const sellerPayout = totalPrice - platformFee;

    const paymentResult = await razorpayProvider.createPayment({
      amount: totalPrice,
      method: paymentMethod as "upi",
      metadata: { listingId: listing.id, buyerId, sellerId },
    });

    const order = {
      id: `o${Date.now()}`,
      listingId: listing.id,
      listing,
      buyerId: buyer.id,
      buyer,
      sellerId: seller.id,
      seller,
      quantity,
      totalPrice,
      platformFee,
      sellerPayout,
      paymentMethod,
      paymentStatus: "processing" as const,
      orderStatus: "payment_processing" as const,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      transactionId: paymentResult.transactionId,
      transferCode: null,
    };

    return ok({ order, payment: paymentResult }, 201);
  } catch (error) {
    return handleError(error);
  }
}