import { NextResponse } from "next/server";
import { handleError, ok } from "@/lib/api";
import {
  ADMIN_STATS,
  ADMIN_CHARTS_DATA,
  DEMO_EVENTS,
  DEMO_LISTINGS,
  DEMO_ORDERS,
  DEMO_USERS,
} from "@/lib/mock-data";

export async function GET(): Promise<NextResponse> {
  try {
    const stats = {
      ...ADMIN_STATS,
      totalUsers: DEMO_USERS.length,
      totalEvents: DEMO_EVENTS.length,
      totalListings: DEMO_LISTINGS.length,
      totalOrders: DEMO_ORDERS.length,
      activeListings: DEMO_LISTINGS.filter((l) => l.status === "active").length,
      pendingOrders: DEMO_ORDERS.filter((o) =>
        ["pending", "payment_processing"].includes(o.orderStatus),
      ).length,
    };

    return ok({
      stats,
      charts: ADMIN_CHARTS_DATA,
    });
  } catch (error) {
    return handleError(error);
  }
}