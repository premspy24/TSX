"use client";

import { useState } from "react";
import {
  Flag,
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/cn";
import type { Report, ReportReason } from "@/types";
import { DEMO_USERS, DEMO_LISTINGS } from "@/lib/mock-data";

const MOCK_REPORTS: Report[] = [
  {
    id: "rp1",
    reporterId: "u2",
    listingId: "l8",
    reason: "fake_listing",
    description: "This listing claims to have premiere red carpet access which seems suspicious. The price is also unusually high for a standard ticket.",
    status: "pending",
    createdAt: "2026-09-13",
  },
  {
    id: "rp2",
    reporterId: "u3",
    listingId: "l4",
    reason: "wrong_description",
    description: "The ticket section and row details don't match what was advertised. Seller may have listed incorrect information.",
    status: "investigating",
    createdAt: "2026-09-12",
  },
  {
    id: "rp3",
    reporterId: "u4",
    listingId: "l1",
    reason: "duplicate_ticket",
    description: "I believe this seller has listed the same ticket twice under different listings.",
    status: "resolved",
    createdAt: "2026-09-10",
    resolvedAt: "2026-09-11",
  },
];

const reasonLabels: Record<ReportReason, string> = {
  fraud: "Fraud",
  duplicate_ticket: "Duplicate Ticket",
  fake_listing: "Fake Listing",
  wrong_description: "Wrong Description",
  scam: "Scam",
  other: "Other",
};

const statusVariant: Record<string, "warning" | "info" | "success" | "default"> = {
  pending: "warning",
  investigating: "info",
  resolved: "success",
  dismissed: "default",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState(MOCK_REPORTS);

  const openCount = reports.filter((r) => r.status === "pending").length;
  const investigatingCount = reports.filter((r) => r.status === "investigating").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const dismissedCount = reports.filter((r) => r.status === "dismissed").length;

  const stats = [
    { label: "Open Reports", value: openCount, icon: Flag, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Investigating", value: investigatingCount, icon: Search, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Dismissed", value: dismissedCount, icon: XCircle, color: "text-gray-500", bg: "bg-gray-500/10" },
  ];

  const handleStatusChange = (reportId: string, newStatus: Report["status"]) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: newStatus, resolvedAt: newStatus === "resolved" ? new Date().toISOString() : r.resolvedAt }
          : r
      )
    );
  };

  const getUserName = (userId: string) => {
    return DEMO_USERS.find((u) => u.id === userId)?.name ?? "Unknown User";
  };

  const getListingInfo = (listingId: string) => {
    const listing = DEMO_LISTINGS.find((l) => l.id === listingId);
    return listing ? listing.event.name : "Unknown Listing";
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted">Review and manage user reports</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 sm:p-5">
                <div className={cn("flex size-10 items-center justify-center rounded-xl", stat.bg)}>
                  <Icon className={cn("size-5", stat.color)} />
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<Shield className="size-7" />}
          title="No Reports"
          description="There are no reports to review at this time."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusVariant[report.status]} size="sm">
                        {report.status}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        <AlertTriangle className="size-3" />
                        {reasonLabels[report.reason]}
                      </Badge>
                      <span className="text-xs text-muted">
                        <Clock className="mr-1 inline size-3" />
                        {formatDate(report.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Reporter: </span>
                        <span className="text-muted">{getUserName(report.reporterId)}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Listing: </span>
                        <span className="text-muted">{getListingInfo(report.listingId)}</span>
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-foreground/80">{report.description}</p>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    {report.status === "pending" && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusChange(report.id, "investigating")}
                        >
                          <Eye className="size-3.5" />
                          Investigate
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStatusChange(report.id, "resolved")}
                        >
                          <CheckCircle className="size-3.5" />
                          Resolve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(report.id, "dismissed")}
                        >
                          <XCircle className="size-3.5" />
                          Dismiss
                        </Button>
                      </>
                    )}
                    {report.status === "investigating" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStatusChange(report.id, "resolved")}
                        >
                          <CheckCircle className="size-3.5" />
                          Resolve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(report.id, "dismissed")}
                        >
                          <XCircle className="size-3.5" />
                          Dismiss
                        </Button>
                      </>
                    )}
                    {(report.status === "resolved" || report.status === "dismissed") && (
                      <span className="text-xs text-muted">
                        {report.status === "resolved" ? "Resolved" : "Dismissed"} on{" "}
                        {report.resolvedAt ? formatDate(report.resolvedAt) : "N/A"}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
