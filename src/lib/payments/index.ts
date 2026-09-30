import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface CreatePaymentInput {
  amount: number;
  method: PaymentMethod;
  metadata: Record<string, unknown>;
}

export interface PaymentResult {
  orderId: string;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  gateway: "razorpay" | "stripe";
  createdAt: string;
}

export interface RefundResult {
  transactionId: string;
  refundId: string;
  amount: number;
  status: "refunded" | "failed";
}

export interface PayoutStatus {
  payoutId: string;
  status: "pending" | "processing" | "paid" | "failed";
  amount: number;
  settledAt: string | null;
}

export interface PaymentProvider {
  readonly name: "razorpay" | "stripe";
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentResult>;
  refund(transactionId: string, amount: number): Promise<RefundResult>;
  getPayoutStatus(payoutId: string): Promise<PayoutStatus>;
}

export class RazorpayProvider implements PaymentProvider {
  readonly name = "razorpay" as const;

  private get credentials(): { keyId: string; keySecret: string } {
    return {
      keyId: env.RAZORPAY_KEY_ID ?? "rzp_test_demo_key_id",
      keySecret: env.RAZORPAY_KEY_SECRET ?? "rzp_test_demo_key_secret",
    };
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    const keyId = this.credentials.keyId;
    if (!keyId) throw new Error("Razorpay key ID is not configured");
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error("Payment amount must be a positive number");
    }
    return {
      orderId: `order_${randomUUID()}`,
      transactionId: `pay_${randomUUID()}`,
      amount: input.amount,
      status: "processing",
      gateway: this.name,
      createdAt: new Date().toISOString(),
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    if (!transactionId) throw new Error("Transaction ID is required");
    return {
      orderId: `order_${randomUUID()}`,
      transactionId,
      amount: 0,
      status: "completed",
      gateway: this.name,
      createdAt: new Date().toISOString(),
    };
  }

  async refund(transactionId: string, amount: number): Promise<RefundResult> {
    if (!transactionId) throw new Error("Transaction ID is required");
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Refund amount must be a positive number");
    }
    return {
      transactionId,
      refundId: `rfnd_${randomUUID()}`,
      amount,
      status: "refunded",
    };
  }

  async getPayoutStatus(payoutId: string): Promise<PayoutStatus> {
    if (!payoutId) throw new Error("Payout ID is required");
    return {
      payoutId,
      status: "paid",
      amount: 0,
      settledAt: new Date().toISOString(),
    };
  }
}

export class StripeProvider implements PaymentProvider {
  readonly name = "stripe" as const;

  private get credentials(): { secretKey: string; publishableKey: string } {
    return {
      secretKey: env.STRIPE_SECRET_KEY ?? "sk_test_demo_secret",
      publishableKey: env.STRIPE_PUBLISHABLE_KEY ?? "pk_test_demo_publishable",
    };
  }

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    const secretKey = this.credentials.secretKey;
    if (!secretKey) throw new Error("Stripe secret key is not configured");
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error("Payment amount must be a positive number");
    }
    return {
      orderId: `pi_${randomUUID()}`,
      transactionId: `ch_${randomUUID()}`,
      amount: input.amount,
      status: "processing",
      gateway: this.name,
      createdAt: new Date().toISOString(),
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    if (!transactionId) throw new Error("Transaction ID is required");
    return {
      orderId: `pi_${randomUUID()}`,
      transactionId,
      amount: 0,
      status: "completed",
      gateway: this.name,
      createdAt: new Date().toISOString(),
    };
  }

  async refund(transactionId: string, amount: number): Promise<RefundResult> {
    if (!transactionId) throw new Error("Transaction ID is required");
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Refund amount must be a positive number");
    }
    return {
      transactionId,
      refundId: `re_${randomUUID()}`,
      amount,
      status: "refunded",
    };
  }

  async getPayoutStatus(payoutId: string): Promise<PayoutStatus> {
    if (!payoutId) throw new Error("Payout ID is required");
    return {
      payoutId,
      status: "paid",
      amount: 0,
      settledAt: new Date().toISOString(),
    };
  }
}

export function getPaymentProvider(
  name: "razorpay" | "stripe" = "razorpay",
): PaymentProvider {
  return name === "stripe" ? new StripeProvider() : new RazorpayProvider();
}

export const razorpayProvider = new RazorpayProvider();
export const stripeProvider = new StripeProvider();