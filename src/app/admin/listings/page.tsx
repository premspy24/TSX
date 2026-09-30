"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  Clock,
  Tag,
  AlertTriangle,
  Ticket,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_LISTINGS } from "@/lib/mock-data";
import { formatCurrency, formatDate, cn } from "@/lib/cn";

const statusBadgeVariant: Record<string, "success" | "warning" | "info" | "danger" | "default"> = {
  active: "success",
  sold: "info",
  expired: "danger",
  draft: "default",
};

const verificationBadgeVariant: Record<string, "success" | "warning" | "danger"> = {
  verified: "success",
  pending: "warning",
  rejected: "danger",
};

export default function AdminListingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const listings = useMemo(() => {
    return DEMO_LISTINGS.filter((l) => {
      const matchesSearch =
        search === "" ||
        l.event.name.toLowerCase().includes(search.toLowerCase()) ||
        l.seller.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || l.event.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [search, statusFilter, categoryFilter]);

  const activeCount = DEMO_LISTINGS.filter((l) => l.status === "active").length;
  const pendingCount = DEMO_LISTINGS.filter((l) => l.verificationStatus === "pending").length;
  const soldCount = DEMO_LISTINGS.filter((l) => l.status === "sold").length;
  const reportedCount = DEMO_LISTINGS.filter((l) => l.verificationStatus === "rejected").length;

  const stats = [
    { label: "Active", value: activeCount, icon: Tag, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Verification", value: pendingCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Sold", value: soldCount, icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Reported", value: reportedCount, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Listing Management</h1>
        <p className="text-sm text-muted">Monitor and manage all ticket listings</p>
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by event or seller..."
            icon={<Search className="size-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="concert">Concert</SelectItem>
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="festival">Festival</SelectItem>
              <SelectItem value="movie">Movie</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="theatre">Theatre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Seller</th>
                  <th className="px-5 py-3 font-medium">Ticket Type</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Verification</th>
                  <th className="px-5 py-3 font-medium">Views</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border/50 last:border-0 hover:bg-foreground/[0.02]">
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground line-clamp-1">{listing.event.name}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={listing.seller.name} size="sm" />
                        <span className="text-foreground">{listing.seller.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" size="sm">{listing.ticketType}</Badge>
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground">{formatCurrency(listing.sellingPrice)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={statusBadgeVariant[listing.status] ?? "default"} size="sm">
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={verificationBadgeVariant[listing.verificationStatus]} size="sm">
                        {listing.verificationStatus}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-muted">{listing.views}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(listing.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-600">
                          <CheckCircle className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
                          <XCircle className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
                          <Ban className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {listings.map((listing) => (
              <Card key={listing.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{listing.event.name}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        <Avatar name={listing.seller.name} size="sm" />
                        {listing.seller.name}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-foreground">{formatCurrency(listing.sellingPrice)}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" size="sm">{listing.ticketType}</Badge>
                    <Badge variant={statusBadgeVariant[listing.status] ?? "default"} size="sm">{listing.status}</Badge>
                    <Badge variant={verificationBadgeVariant[listing.verificationStatus]} size="sm">{listing.verificationStatus}</Badge>
                    <span className="text-xs text-muted">{listing.views} views</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                    <span className="text-xs text-muted">{formatDate(listing.createdAt)}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-600">
                        <CheckCircle className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
                        <XCircle className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
                        <Ban className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
