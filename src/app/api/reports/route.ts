import { NextRequest, NextResponse } from "next/server";
import {
  ApiError,
  handleError,
  isOneOf,
  ok,
  readJson,
  requireFields,
} from "@/lib/api";
import { DEMO_LISTINGS, DEMO_USERS } from "@/lib/mock-data";

const REPORT_REASONS = [
  "fraud",
  "duplicate_ticket",
  "fake_listing",
  "wrong_description",
  "scam",
  "other",
] as const;

const REPORT_STATUSES = ["pending", "investigating", "resolved", "dismissed"] as const;

const DEMO_REPORTS = [
  {
    id: "rp1",
    reporterId: "u3",
    listingId: "l8",
    reason: "fake_listing",
    description: "This listing looks suspicious. The price is too good to be true for a premiere ticket.",
    status: "pending",
    adminNotes: null,
    resolvedAt: null,
    createdAt: "2026-09-13",
  },
  {
    id: "rp2",
    reporterId: "u2",
    listingId: "l4",
    reason: "wrong_description",
    description: "The ticket type was listed as general but the original ticket was actually premium.",
    status: "investigating",
    adminNotes: "Reviewing original ticket proof.",
    resolvedAt: null,
    createdAt: "2026-09-11",
  },
] as const;

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reporterId = searchParams.get("reporterId");
    const status = searchParams.get("status");

    let reports = [...DEMO_REPORTS];

    if (reporterId) {
      reports = reports.filter((r) => r.reporterId === reporterId);
    }
    if (status) {
      if (!isOneOf(status, REPORT_STATUSES)) {
        throw new ApiError(
          `status must be one of: ${REPORT_STATUSES.join(", ")}`,
          422,
        );
      }
      reports = reports.filter((r) => r.status === status);
    }

    return ok({ reports, total: reports.length });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await readJson(request);
    requireFields(body, ["reporterId", "listingId", "reason", "description"]);

    const reason = String(body.reason);
    if (!isOneOf(reason, REPORT_REASONS)) {
      throw new ApiError(
        `reason must be one of: ${REPORT_REASONS.join(", ")}`,
        422,
      );
    }

    const description = String(body.description).trim();
    if (description.length < 10) {
      throw new ApiError("Description must be at least 10 characters", 422);
    }

    const reporterId = String(body.reporterId);
    const listingId = String(body.listingId);

    const reporter = DEMO_USERS.find((u) => u.id === reporterId) ?? DEMO_USERS[0];
    const listing = DEMO_LISTINGS.find((l) => l.id === listingId);
    if (!listing) throw new ApiError("Listing not found", 404);

    if (reporter.id === listing.sellerId) {
      throw new ApiError("You cannot report your own listing", 422);
    }

    const report = {
      id: `rp${Date.now()}`,
      reporterId: reporter.id,
      listingId: listing.id,
      reason,
      description,
      status: "pending" as const,
      adminNotes: null,
      resolvedAt: null,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    return ok({ report }, 201);
  } catch (error) {
    return handleError(error);
  }
}