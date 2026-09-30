import { NextRequest, NextResponse } from "next/server";
import { handleError, ok, readJson, requireFields } from "@/lib/api";
import { DEMO_NOTIFICATIONS } from "@/lib/mock-data";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly");

    let notifications = DEMO_NOTIFICATIONS;

    if (userId) {
      notifications = notifications.filter((n) => n.userId === userId);
    }
    if (unreadOnly === "true") {
      notifications = notifications.filter((n) => !n.read);
    }

    const total = notifications.length;
    const unreadCount = DEMO_NOTIFICATIONS.filter(
      (n) => (userId ? n.userId === userId : true) && !n.read,
    ).length;

    return ok({ notifications, total, unreadCount });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, ["userId"]);

    const userId = String(body.userId);
    const markAll = body.markAll === true;
    const notificationIds = Array.isArray(body.notificationIds)
      ? (body.notificationIds as string[])
      : [];

    const updated = DEMO_NOTIFICATIONS.map((n) => {
      if (n.userId !== userId) return n;
      if (markAll || notificationIds.includes(n.id)) {
        return { ...n, read: true };
      }
      return n;
    }).filter((n) => n.userId === userId);

    return ok({
      notifications: updated,
      updatedCount: updated.filter((n) => n.read).length,
    });
  } catch (error) {
    return handleError(error);
  }
}