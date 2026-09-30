"use client";

import { useState } from "react";
import { Save, CreditCard, Bell, Percent, DollarSign, Hash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState("10");
  const [minPrice, setMinPrice] = useState("100");
  const [maxPrice, setMaxPrice] = useState("500000");
  const [autoVerifyThreshold, setAutoVerifyThreshold] = useState("5000");
  const [paymentGateway, setPaymentGateway] = useState("razorpay");
  const [payoutSchedule, setPayoutSchedule] = useState("instant");
  const [emailPurchase, setEmailPurchase] = useState("true");
  const [emailSale, setEmailSale] = useState("true");
  const [emailExchange, setEmailExchange] = useState("true");
  const [pushEnabled, setPushEnabled] = useState("true");

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted">Configure platform settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="size-5 text-primary" />
            Platform Settings
          </CardTitle>
          <CardDescription>Configure marketplace fees and listing constraints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Platform Fee (%)"
              type="number"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
              icon={<Percent className="size-4" />}
            />
            <Input
              label="Auto-Verify Threshold (₹)"
              type="number"
              value={autoVerifyThreshold}
              onChange={(e) => setAutoVerifyThreshold(e.target.value)}
              icon={<Hash className="size-4" />}
              helperText="Listings below this amount are auto-verified"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Minimum Ticket Price (₹)"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              icon={<DollarSign className="size-4" />}
            />
            <Input
              label="Maximum Ticket Price (₹)"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              icon={<DollarSign className="size-4" />}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button leftIcon={<Save className="size-4" />}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" />
            Payment Settings
          </CardTitle>
          <CardDescription>Configure payment gateway and payout options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Payment Gateway</label>
              <Select value={paymentGateway} onValueChange={setPaymentGateway}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="payu">PayU</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Payout Schedule</label>
              <Select value={payoutSchedule} onValueChange={setPayoutSchedule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button leftIcon={<Save className="size-4" />}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription>Manage email templates and push notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Purchase Confirmation Email</label>
              <Select value={emailPurchase} onValueChange={setEmailPurchase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted">Send email when a purchase is completed</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Sale Notification Email</label>
              <Select value={emailSale} onValueChange={setEmailSale}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted">Notify sellers when their listing is sold</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Exchange Request Email</label>
              <Select value={emailExchange} onValueChange={setEmailExchange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted">Notify when a new exchange request is received</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Push Notifications</label>
              <Select value={pushEnabled} onValueChange={setPushEnabled}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted">Enable browser push notifications</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button leftIcon={<Save className="size-4" />}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
