"use client";

import { useState, useMemo } from "react";
import { Search, Shield, ShieldCheck, BadgeCheck, Star, Eye, Pencil, Ban } from "lucide-react";
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
import { DEMO_USERS } from "@/lib/mock-data";
import { formatDate, cn } from "@/lib/cn";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const users = useMemo(() => {
    return DEMO_USERS.filter((u) => {
      const matchesSearch =
        search === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && u.verified) ||
        (statusFilter === "unverified" && !u.verified);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const totalUsers = DEMO_USERS.length;
  const verifiedUsers = DEMO_USERS.filter((u) => u.verified).length;
  const activeSellers = DEMO_USERS.filter((u) => u.totalSales > 0).length;
  const adminCount = DEMO_USERS.filter((u) => u.role === "admin").length;

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Verified Users", value: verifiedUsers, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Sellers", value: activeSellers, icon: BadgeCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Admins", value: adminCount, icon: Shield, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted">Manage platform users and permissions</p>
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
            placeholder="Search users by name or email..."
            icon={<Search className="size-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
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
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Verified</th>
                  <th className="px-5 py-3 font-medium">Rating</th>
                  <th className="px-5 py-3 font-medium">Sales</th>
                  <th className="px-5 py-3 font-medium">Purchases</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-foreground/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} src={user.avatar || undefined} size="sm" />
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={user.role === "admin" ? "warning" : "default"} size="sm">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      {user.verified ? (
                        <Badge variant="success" size="sm">
                          <BadgeCheck className="size-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">
                          Unverified
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-foreground">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        {user.rating > 0 ? user.rating.toFixed(1) : "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-foreground">{user.totalSales}</td>
                    <td className="px-5 py-3 text-foreground">{user.totalPurchases}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(user.joinDate)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Pencil className="size-3.5" />
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
            {users.map((user) => (
              <Card key={user.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} src={user.avatar || undefined} size="sm" />
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant={user.role === "admin" ? "warning" : "default"} size="sm">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-muted">Rating</p>
                      <p className="flex items-center justify-center gap-1 text-sm font-medium text-foreground">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        {user.rating > 0 ? user.rating.toFixed(1) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Sales</p>
                      <p className="text-sm font-medium text-foreground">{user.totalSales}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Purchases</p>
                      <p className="text-sm font-medium text-foreground">{user.totalPurchases}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                    <div className="flex items-center gap-1">
                      {user.verified ? (
                        <Badge variant="success" size="sm">
                          <BadgeCheck className="size-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">Unverified</Badge>
                      )}
                      <span className="text-xs text-muted">· {formatDate(user.joinDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Pencil className="size-3.5" />
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
