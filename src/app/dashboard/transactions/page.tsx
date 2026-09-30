"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Download,
  Receipt,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate, cn } from "@/lib/cn";
import { DEMO_TRANSACTIONS } from "@/lib/mock-data";
import type { Transaction } from "@/types";

const STATUS_STYLES: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  completed: { label: "Completed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
};

const TYPE_STYLES: Record<string, { label: string; icon: typeof ArrowDownLeft; color: string }> = {
  purchase: { label: "Purchase", icon: ArrowDownLeft, color: "text-emerald-600 bg-emerald-50" },
  sale: { label: "Sale", icon: ArrowUpRight, color: "text-blue-600 bg-blue-50" },
  payout: { label: "Payout", icon: Wallet, color: "text-violet-600 bg-violet-50" },
  refund: { label: "Refund", icon: CreditCard, color: "text-amber-600 bg-amber-50" },
};

function TransactionRow({ txn, compact }: { txn: Transaction; compact?: boolean }) {
  const type = TYPE_STYLES[txn.type];
  const status = STATUS_STYLES[txn.status];
  const TypeIcon = type?.icon ?? Receipt;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", type?.color ?? "text-slate-600 bg-slate-50")}>
          <TypeIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {txn.type === "purchase" ? "Ticket Purchase" : txn.type === "sale" ? "Ticket Sale" : txn.type === "payout" ? "Seller Payout" : "Refund"}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {formatDate(txn.createdAt)} · {txn.paymentMethod.toUpperCase()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!compact && (
          <span className="hidden sm:block text-xs font-mono text-slate-500">#{txn.id.toUpperCase()}</span>
        )}
        <div className="text-right">
          <p className={cn("text-sm font-semibold", txn.type === "payout" || txn.type === "sale" ? "text-emerald-600" : "text-slate-900")}>
            {txn.type === "payout" || txn.type === "sale" ? "+" : "−"}{formatCurrency(txn.netAmount)}
          </p>
          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const totalSpent = DEMO_TRANSACTIONS.filter((t) => t.type === "purchase").reduce((s, t) => s + t.amount, 0);
  const totalEarned = DEMO_TRANSACTIONS.filter((t) => t.type === "sale" || t.type === "payout").reduce((s, t) => s + t.netAmount, 0);
  const totalFees = DEMO_TRANSACTIONS.reduce((s, t) => s + t.fee, 0);

  const filtered = DEMO_TRANSACTIONS.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (query && !t.id.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">Track all your purchases, sales, and payouts</p>
        </div>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <ArrowDownLeft className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Earned</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalEarned)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Platform Fees Paid</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalFees)}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your transactions in one place</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 pb-0 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search by transaction ID..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Types</option>
                  <option value="purchase">Purchase</option>
                  <option value="sale">Sale</option>
                  <option value="payout">Payout</option>
                  <option value="refund">Refund</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={<Receipt className="h-10 w-10" />}
                title="No transactions found"
                description="Try adjusting your filters or complete a purchase to see transactions here."
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((txn) => (
                <TransactionRow key={txn.id} txn={txn} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}