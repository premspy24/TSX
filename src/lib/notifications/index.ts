import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";

export type NotificationType =
  | "purchase"
  | "sale"
  | "exchange_request"
  | "exchange_accepted"
  | "exchange_rejected"
  | "transfer"
  | "payment"
  | "listing_expiration"
  | "price_change"
  | "event_reminder"
  | "verification"
  | "system";

export interface InAppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}

export type EmailTemplate =
  | "welcome"
  | "purchase_confirmation"
  | "sale_confirmation"
  | "ticket_transferred"
  | "exchange_request"
  | "payment_received"
  | "listing_verified"
  | "listing_rejected"
  | "password_reset"
  | "otp";

export interface EmailPayload {
  to: string;
  from: string;
  template: EmailTemplate;
  subject: string;
  context: Record<string, unknown>;
}

export type PushChannel = "fcm" | "apns";

export interface PushPayload {
  userId: string;
  title: string;
  body: string;
  data: Record<string, string>;
  channel: PushChannel;
}

export type EmailResult = EmailPayload & { queued: boolean; provider: "sendgrid" };

export type NotificationResult = {
  inApp: InAppNotification | null;
  email: EmailResult | null;
  push: PushPayload | null;
};

export class NotificationService {
  async sendInApp(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    actionUrl?: string,
  ): Promise<InAppNotification> {
    if (!userId) throw new Error("User ID is required");
    if (!title || !message) throw new Error("Title and message are required");
    return {
      id: randomUUID(),
      userId,
      type,
      title,
      message,
      read: false,
      actionUrl: actionUrl ?? null,
      createdAt: new Date().toISOString(),
    };
  }

  async sendEmail(
    userId: string,
    template: EmailTemplate,
    data: Record<string, unknown>,
  ): Promise<EmailResult> {
    if (!userId) throw new Error("User ID is required");
    const from = env.EMAIL_FROM;
    const subject = this.subjectFor(template, data);
    const payload: EmailPayload = {
      to: String(data.email ?? "user@example.com"),
      from,
      template,
      subject,
      context: data,
    };
    return { ...payload, queued: true, provider: "sendgrid" };
  }

  async sendPush(
    userId: string,
    title: string,
    body: string,
    data: Record<string, string> = {},
  ): Promise<PushPayload> {
    if (!userId) throw new Error("User ID is required");
    if (!title || !body) throw new Error("Title and body are required");
    return {
      userId,
      title,
      body,
      data,
      channel: "fcm",
    };
  }

  async send(
    userId: string,
    type: NotificationType,
    input: {
      title: string;
      message: string;
      actionUrl?: string;
      email?: { template: EmailTemplate; subject?: string };
      push?: { title: string; body: string; data?: Record<string, string> };
    },
  ): Promise<NotificationResult> {
    const inApp = await this.sendInApp(userId, type, input.title, input.message, input.actionUrl);
    let email: EmailResult | null = null;
    let push: PushPayload | null = null;
    if (input.email) {
      email = await this.sendEmail(userId, input.email.template, {
        title: input.title,
        ...input.email,
      });
    }
    if (input.push) {
      push = await this.sendPush(userId, input.push.title, input.push.body, input.push.data);
    }
    return { inApp, email, push };
  }

  private subjectFor(template: EmailTemplate, data: Record<string, unknown>): string {
    const subjects: Record<EmailTemplate, string> = {
      welcome: "Welcome to TicketSwapX!",
      purchase_confirmation: "Your ticket purchase is confirmed",
      sale_confirmation: "Your ticket has been sold",
      ticket_transferred: "Your tickets have been transferred",
      exchange_request: "You have a new exchange request",
      payment_received: "Payment received",
      listing_verified: "Your listing is verified",
      listing_rejected: "Your listing was rejected",
      password_reset: "Reset your password",
      otp: "Your verification code",
    };
    return subjects[template] ?? `TicketSwapX: ${String(data.title ?? template)}`;
  }
}

export const notifications = new NotificationService();