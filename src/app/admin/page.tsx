"use client";

import {
  Users,
  Tag,
  Ticket,
  DollarSign,
  TrendingUp,
  ArrowLeftRight,
  XCircle,
  Flag,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ADMIN_STATS, ADMIN_CHARTS_DATA, DEMO_ORDERS } from "@/lib/mock-data";
import { formatCurrency, formatDate, cn } from "@/lib/cn";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const metricCards = [
  {
    label: "Total Users",
    value: ADMIN_STATS.totalUsers.toLocaleString("en-IN"),
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    change: "+12.5%",
    up: true,
  },
  {
    label: "Active Listings",
    value: ADMIN_STATS.activeListings.toLocaleString("en-IN"),
    icon: Tag,
    color: "text-green-500",
    bg: "bg-green-500/10",
    change: "+8.2%",
    up: true,
  },
  {
    label: "Tickets Sold",
    value: ADMIN_STATS.ticketsSold.toLocaleString("en-IN"),
    icon: Ticket,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    change: "+23.1%",
    up: true,
  },
  {
    label: "GMV",
    value: formatCurrency(ADMIN_STATS.gmv),
    icon: DollarSign,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    change: "+18.7%",
    up: true,
  },
  {
    label: "Platform Revenue",
    value: formatCurrency(ADMIN_STATS.platformRevenue),
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    change: "+18.7%",
    up: true,
  },
  {
    label: "Successful Exchanges",
    value: ADMIN_STATS.successfulExchanges.toLocaleString("en-IN"),
    icon: ArrowLeftRight,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    change: "+15.3%",
    up: true,
  },
  {
    label: "Failed Transactions",
    value: ADMIN_STATS.failedTransactions.toLocaleString("en-IN"),
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    change: "-4.2%",
    up: false,
  },
  {
    label: "Reported Listings",
    value: ADMIN_STATS.reportedListings.toLocaleString("en-IN"),
    icon: Flag,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    change: "-2.1%",
    up: false,
  },
];

const statusColors: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  completed: "success",
  transferred: "success",
  pending: "warning",
  payment_processing: "warning",
  cancelled: "danger",
  refunded: "danger",
  disputed: "danger",
};

export default function AdminDashboardPage() {
  const recentOrders = DEMO_ORDERS.slice(0, 5);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted">Platform overview and key metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="relative overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div className={cn("flex size-10 items-center justify-center rounded-xl", card.bg)}>
                    <Icon className={cn("size-5", card.color)} />
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-semibold",
                      card.up ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {card.up ? (
                      <ArrowUpRight className="size-3.5" />
                    ) : (
                      <ArrowDownRight className="size-3.5" />
                    )}
                    {card.change}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">{card.value}</p>
                  <p className="mt-0.5 text-xs text-muted">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales &amp; Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ADMIN_CHARTS_DATA.dailySales}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="sales" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="revenue" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value, name) => [name === "revenue" ? formatCurrency(Number(value)) : value, name === "sales" ? "Tickets Sold" : "Revenue"]}
                  />
                  <Legend />
                  <Area yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGrad)" strokeWidth={2} name="Revenue" />
                  <Area yAxisId="sales" type="monotone" dataKey="sales" stroke="#6366f1" fill="url(#salesGrad)" strokeWidth={2} name="Sales" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ADMIN_CHARTS_DATA.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ADMIN_CHARTS_DATA.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [`${value}%`, "Share"]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>City Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ADMIN_CHARTS_DATA.cityDistribution} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={80} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [Number(value).toLocaleString("en-IN"), "Listings"]}
                  />
                  <Bar dataKey="listings" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ADMIN_CHARTS_DATA.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [Number(value).toLocaleString("en-IN"), "Users"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-3 pr-4 font-medium">Order ID</th>
                  <th className="pb-3 pr-4 font-medium">Buyer</th>
                  <th className="pb-3 pr-4 font-medium">Seller</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 font-mono text-xs text-foreground/70">{order.id.toUpperCase()}</td>
                    <td className="py-3 pr-4 text-foreground">{order.buyer.name}</td>
                    <td className="py-3 pr-4 text-foreground">{order.seller.name}</td>
                    <td className="py-3 pr-4 font-medium text-foreground">{formatCurrency(order.totalPrice)}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusColors[order.orderStatus] ?? "default"} size="sm">
                        {order.orderStatus.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
