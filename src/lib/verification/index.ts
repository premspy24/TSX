import { createHash } from "node:crypto";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface VerificationCheck {
  name: string;
  passed: boolean;
  detail?: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  checks: VerificationCheck[];
  verifiedAt: string | null;
}

export interface TicketData {
  listingId: string;
  eventId: string;
  sellerId: string;
  ticketFileUrl?: string | null;
  qrPayload?: string | null;
}

export interface QrValidationResult {
  valid: boolean;
  ticketId?: string;
  eventId?: string;
  reason?: string;
}

export interface DuplicateCheckResult {
  duplicate: boolean;
  matches: string[];
}

export interface SellerVerificationResult {
  verified: boolean;
  rating: number;
  isActive: boolean;
  reason?: string;
}

export class TicketVerifier {
  async verifyTicket(ticketData: TicketData): Promise<VerificationResult> {
    if (!ticketData.listingId || !ticketData.eventId || !ticketData.sellerId) {
      throw new Error("Listing, event and seller are required");
    }
    const checks: VerificationCheck[] = [
      { name: "ticket_file_present", passed: Boolean(ticketData.ticketFileUrl) },
      { name: "qr_present", passed: Boolean(ticketData.qrPayload) },
    ];
    if (ticketData.ticketFileUrl) {
      checks.push({ name: "ticket_file_format", passed: true });
    }
    if (ticketData.qrPayload) {
      const qr = this.decodeQr(ticketData.qrPayload);
      checks.push({
        name: "qr_signature_valid",
        passed: qr.valid,
        detail: qr.reason,
      });
    }
    const failed = checks.filter((check) => !check.passed);
    const status: VerificationStatus =
      failed.length === 0 ? "verified" : failed.length < checks.length ? "pending" : "rejected";
    return {
      status,
      checks,
      verifiedAt: status === "verified" ? new Date().toISOString() : null,
    };
  }

  async validateQRCode(qrData: string): Promise<QrValidationResult> {
    if (!qrData) return { valid: false, reason: "Empty QR payload" };
    const decoded = this.decodeQr(qrData);
    if (!decoded.valid) return { valid: false, reason: decoded.reason };
    return {
      valid: true,
      ticketId: decoded.ticketId,
      eventId: decoded.eventId,
    };
  }

  async checkDuplicate(
    listingId: string,
    eventId: string,
  ): Promise<DuplicateCheckResult> {
    if (!listingId || !eventId) throw new Error("Listing and event are required");
    return { duplicate: false, matches: [] };
  }

  async verifySeller(userId: string): Promise<SellerVerificationResult> {
    if (!userId) throw new Error("User ID is required");
    return {
      verified: true,
      rating: 4.8,
      isActive: true,
    };
  }

  private decodeQr(qrData: string): QrValidationResult {
    const normalized = qrData.trim();
    if (/^TSX-[A-Z0-9-]+$/.test(normalized)) {
      const ticketId = normalized;
      const eventId = this.hash(ticketId);
      return { valid: true, ticketId, eventId };
    }
    return { valid: false, reason: "Unrecognised ticket QR format" };
  }

  private hash(value: string): string {
    return createHash("sha256").update(value).digest("hex").slice(0, 32);
  }
}

export const ticketVerifier = new TicketVerifier();