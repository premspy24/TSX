"use client";

import { useState, useMemo } from "react";
import {
  Search,
  DollarSign,
  TrendingUp,
  CreditCard,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_TRANSACTIONS } from "@/lib/mock-data";
import { formatCurrency, formatDate, cn } from "@/lib/cn";

const typeBadgeVariant: Record<string, "success" | "warning" | "info" | "danger" | "default"> = {
  purchase: "info",
  sale: "success",
  payout: "warning",
  refund: "danger",
};

const statusBadgeVariant: Record<string, "success" | "warning" | "danger"> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
};

const typeIcon: Record<string, typeof DollarSign> = {
  purchase: ArrowUpRight,
  sale: ArrowDownRight,
  payout: CreditCard,
  refund: RotateCcw,
};

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const transactions = useMemo(() => {
    return DEMO_TRANSACTIONS.filter((t) => {
      const matchesSearch =
        search === "" ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.orderId.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const totalGMV = DEMO_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = DEMO_TRANSACTIONS.reduce((sum, t) => sum + t.fee, 0);
  const avgTransaction = DEMO_TRANSACTIONS.length > 0 ? totalGMV / DEMO_TRANSACTIONS.length : 0;
  const refunds = DEMO_TRANSACTIONS.filter((t) => t.type === "refund").reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { label: "Total GMV", value: formatCurrency(totalGMV), icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Platform Revenue", value: formatCurrency(totalFees), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg Transaction", value: formatCurrency(avgTransaction), icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Refunds", value: formatCurrency(refunds), icon: RotateCcw, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-sm text-muted">Monitor all financial transactions on the platform</p>
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
                  <p className="text-xl font-bold text-foreground sm:text-2xl">{stat.value}</p>
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
            placeholder="Search by transaction or order ID..."
            icon={<Search className="size-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="payout">Payout</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
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
                  <th className="px-5 py-3 font-medium">Transaction ID</th>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Fee</th>
                  <th className="px-5 py-3 font-medium">Net Amount</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => {
                  const TypeIcon = typeIcon[txn.type] ?? DollarSign;
                  return (
                    <tr key={txn.id} className="border-b border-border/50 last:border-0 hover:bg-foreground/[0.02]">
                      <td className="px-5 py-3 font-mono text-xs text-foreground/70">{txn.id.toUpperCase()}</td>
                      <td className="px-5 py-3 font-mono text-xs text-foreground/70">{txn.orderId.toUpperCase()}</td>
                      <td className="px-5 py-3 font-medium text-foreground">{formatCurrency(txn.amount)}</td>
                      <td className="px-5 py-3 text-muted">{formatCurrency(txn.fee)}</td>
                      <td className="px-5 py-3 font-medium text-foreground">{formatCurrency(txn.netAmount)}</td>
                      <td className="px-5 py-3">
                        <Badge variant={typeBadgeVariant[txn.type] ?? "default"} size="sm">
                          <TypeIcon className="size-3" />
                          {txn.type}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={statusBadgeVariant[txn.status]} size="sm">
                          {txn.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 uppercase text-foreground">{txn.paymentMethod}</td>
                      <td className="px-5 py-3 text-muted">{formatDate(txn.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {transactions.map((txn) => {
              const TypeIcon = typeIcon[txn.type] ?? DollarSign;
              return (
                <Card key={txn.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-xs text-foreground/70">{txn.id.toUpperCase()}</p>
                        <p className="mt-0.5 text-xs text-muted">Order: {txn.orderId.toUpperCase()}</p>
                      </div>
                      <p className="text-lg font-bold text-foreground">{formatCurrency(txn.amount)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant={typeBadgeVariant[txn.type] ?? "default"} size="sm">
                        <TypeIcon className="size-3" />
                        {txn.type}
                      </Badge>
                      <Badge variant={statusBadgeVariant[txn.status]} size="sm">{txn.status}</Badge>
                      <Badge variant="outline" size="sm">{txn.paymentMethod}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted">
                      <span>Fee: {formatCurrency(txn.fee)} · Net: {formatCurrency(txn.netAmount)}</span>
                      <span>{formatDate(txn.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
