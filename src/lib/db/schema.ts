/**
 * TicketSwapX PostgreSQL schema.
 *
 * Identifiers use snake_case to mirror the SQL DDL. Monetary columns are
 * DECIMAL(10,2) in PostgreSQL and are serialised as `number` at the TypeScript
 * boundary. Timestamps are stored as TIMESTAMPTZ and serialised as ISO-8601
 * strings.
 */

export const TABLES = {
  users: "users",
  events: "events",
  venues: "venues",
  ticket_listings: "ticket_listings",
  orders: "orders",
  payments: "payments",
  transfers: "transfers",
  exchange_requests: "exchange_requests",
  notifications: "notifications",
  reviews: "reviews",
  reports: "reports",
  disputes: "disputes",
} as const;

export type TableName = (typeof TABLES)[keyof typeof TABLES];

/** DB timestamp serialised as an ISO-8601 string. */
export type Timestamp = string;

/** Arbitrary JSON payload stored in a JSONB column. */
export type Json = Record<string, unknown>;

type NullableKeys<T extends object> = {
  [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

/** Insert entities: id, timestamps and nullable columns are optional. */
export type Insert<T extends object> = Omit<T, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
} & { [K in NullableKeys<T>]?: T[K] };

/** Partial updates: every field is optional. */
export type Update<T extends object> = Partial<Insert<T>>;

export const UserRole = { USER: "user", ADMIN: "admin" } as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const EventCategory = {
  CONCERT: "concert",
  CRICKET: "cricket",
  FOOTBALL: "football",
  COMEDY: "comedy",
  FESTIVAL: "festival",
  MOVIE: "movie",
  CONFERENCE: "conference",
  THEATRE: "theatre",
  OTHER: "other",
} as const;
export type EventCategory = (typeof EventCategory)[keyof typeof EventCategory];

export const TicketType = {
  STANDARD: "standard",
  VIP: "vip",
  PREMIUM: "premium",
  GENERAL: "general",
  STANDING: "standing",
  BOX: "box",
} as const;
export type TicketType = (typeof TicketType)[keyof typeof TicketType];

export const TransferMethod = {
  INSTANT_TRANSFER: "instant_transfer",
  MANUAL_TRANSFER: "manual_transfer",
  MEET_AT_VENUE: "meet_at_venue",
} as const;
export type TransferMethod = (typeof TransferMethod)[keyof typeof TransferMethod];

export const ListingStatus = {
  ACTIVE: "active",
  SOLD: "sold",
  EXPIRED: "expired",
  DRAFT: "draft",
} as const;
export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];

export const VerificationStatus = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;
export type VerificationStatus =
  (typeof VerificationStatus)[keyof typeof VerificationStatus];

export const PaymentMethod = {
  UPI: "upi",
  CARD: "card",
  NETBANKING: "netbanking",
  WALLET: "wallet",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const OrderStatus = {
  PENDING: "pending",
  PAYMENT_PROCESSING: "payment_processing",
  PAYMENT_COMPLETE: "payment_complete",
  TRANSFERRING: "transferring",
  TRANSFERRED: "transferred",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  DISPUTED: "disputed",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const TransferStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;
export type TransferStatus = (typeof TransferStatus)[keyof typeof TransferStatus];

export const ExchangeStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  COUNTERED: "countered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type ExchangeStatus = (typeof ExchangeStatus)[keyof typeof ExchangeStatus];

export const NotificationType = {
  PURCHASE: "purchase",
  SALE: "sale",
  EXCHANGE_REQUEST: "exchange_request",
  EXCHANGE_ACCEPTED: "exchange_accepted",
  EXCHANGE_REJECTED: "exchange_rejected",
  TRANSFER: "transfer",
  PAYMENT: "payment",
  LISTING_EXPIRATION: "listing_expiration",
  PRICE_CHANGE: "price_change",
  EVENT_REMINDER: "event_reminder",
  VERIFICATION: "verification",
  SYSTEM: "system",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const ReportReason = {
  FRAUD: "fraud",
  DUPLICATE_TICKET: "duplicate_ticket",
  FAKE_LISTING: "fake_listing",
  WRONG_DESCRIPTION: "wrong_description",
  SCAM: "scam",
  OTHER: "other",
} as const;
export type ReportReason = (typeof ReportReason)[keyof typeof ReportReason];

export const ReportStatus = {
  PENDING: "pending",
  INVESTIGATING: "investigating",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
} as const;
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const DisputeStatus = {
  OPEN: "open",
  INVESTIGATING: "investigating",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const;
export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus];

/**
 * users — registered platform users (buyers, sellers and admins).
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - UNIQUE (email)
 * - UNIQUE (phone) WHERE phone IS NOT NULL
 * - idx_users_city (city)
 * - idx_users_role_active (role) WHERE is_active = true
 */
export interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  avatar_url: string | null;
  verified: boolean;
  rating: number;
  total_sales: number;
  total_purchases: number;
  role: UserRole;
  city: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  last_login: Timestamp | null;
  is_active: boolean;
}

export type InsertUser = Insert<UserRow>;
export type UpdateUser = Update<UserRow>;

/**
 * venues — physical locations where events are hosted.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_venues_city (city)
 */
export interface VenueRow {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
  created_at: Timestamp;
}

export type InsertVenue = Insert<VenueRow>;
export type UpdateVenue = Update<VenueRow>;

/**
 * events — published events that tickets are listed against.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_events_date (date)
 * - idx_events_category (category, date)
 * - idx_events_venue (venue_id, date)
 * - idx_events_featured (featured) WHERE available_tickets > 0
 * - idx_events_tags GIN (tags)
 */
export interface EventRow {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venue_id: string;
  image_url: string | null;
  organizer: string;
  base_price: number;
  total_tickets: number;
  available_tickets: number;
  featured: boolean;
  tags: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type InsertEvent = Insert<EventRow>;
export type UpdateEvent = Update<EventRow>;

/**
 * ticket_listings — seller-created resale listings for a specific event.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_listings_event_status (event_id, status)
 * - idx_listings_seller (seller_id, status)
 * - idx_listings_type (event_id, ticket_type, status)
 * - idx_listings_search GIN (to_tsvector on description)
 * - idx_listings_created (created_at DESC)
 */
export interface TicketListingRow {
  id: string;
  event_id: string;
  seller_id: string;
  ticket_type: TicketType;
  section: string | null;
  row_name: string | null;
  seat: string | null;
  quantity: number;
  original_price: number;
  selling_price: number;
  description: string | null;
  ticket_file_url: string | null;
  transfer_method: TransferMethod;
  status: ListingStatus;
  verification_status: VerificationStatus;
  views: number;
  watchers: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type InsertTicketListing = Insert<TicketListingRow>;
export type UpdateTicketListing = Update<TicketListingRow>;

/**
 * orders — purchase orders linking a buyer, seller and listing.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_orders_buyer (buyer_id, created_at DESC)
 * - idx_orders_seller (seller_id, created_at DESC)
 * - idx_orders_listing (listing_id)
 * - idx_orders_status (order_status)
 * - UNIQUE (transaction_id)
 */
export interface OrderRow {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  quantity: number;
  total_price: number;
  platform_fee: number;
  seller_payout: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  transaction_id: string;
  transfer_code: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type InsertOrder = Insert<OrderRow>;
export type UpdateOrder = Update<OrderRow>;

/**
 * payments — payment gateway records per order.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_payments_order (order_id)
 * - UNIQUE (gateway_transaction_id) WHERE gateway_transaction_id IS NOT NULL
 * - idx_payments_status (status)
 */
export interface PaymentRow {
  id: string;
  order_id: string;
  amount: number;
  fee: number;
  net_amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  gateway_transaction_id: string | null;
  gateway_response: Json | null;
  created_at: Timestamp;
}

export type InsertPayment = Insert<PaymentRow>;
export type UpdatePayment = Update<PaymentRow>;

/**
 * transfers — ticket hand-off records between seller and buyer.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_transfers_order (order_id)
 * - idx_transfers_to_user (to_user_id, status)
 * - UNIQUE (transfer_code)
 */
export interface TransferRow {
  id: string;
  order_id: string;
  from_user_id: string;
  to_user_id: string;
  ticket_data: Json;
  transfer_code: string;
  status: TransferStatus;
  completed_at: Timestamp | null;
  created_at: Timestamp;
}

export type InsertTransfer = Insert<TransferRow>;
export type UpdateTransfer = Update<TransferRow>;

/**
 * exchange_requests — peer-to-peer ticket exchange proposals.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_exchanges_requester (requester_id, status)
 * - idx_exchanges_target (target_listing_id, status)
 */
export interface ExchangeRequestRow {
  id: string;
  requester_id: string;
  requester_listing_id: string;
  target_listing_id: string;
  message: string | null;
  status: ExchangeStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type InsertExchangeRequest = Insert<ExchangeRequestRow>;
export type UpdateExchangeRequest = Update<ExchangeRequestRow>;

/**
 * notifications — in-app notifications delivered to users.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_notifications_user (user_id, read, created_at DESC)
 */
export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url: string | null;
  created_at: Timestamp;
}

export type InsertNotification = Insert<NotificationRow>;
export type UpdateNotification = Update<NotificationRow>;

/**
 * reviews — buyer/seller ratings after a completed order.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - UNIQUE (order_id, reviewer_id)
 * - idx_reviews_reviewee (reviewee_id, created_at DESC)
 */
export interface ReviewRow {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  order_id: string;
  rating: number;
  comment: string;
  created_at: Timestamp;
}

export type InsertReview = Insert<ReviewRow>;
export type UpdateReview = Update<ReviewRow>;

/**
 * reports — user reports against suspicious listings.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_reports_listing (listing_id)
 * - idx_reports_status (status, created_at DESC)
 */
export interface ReportRow {
  id: string;
  reporter_id: string;
  listing_id: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  admin_notes: string | null;
  resolved_at: Timestamp | null;
  created_at: Timestamp;
}

export type InsertReport = Insert<ReportRow>;
export type UpdateReport = Update<ReportRow>;

/**
 * disputes — buyer/seller disputes raised against an order.
 *
 * Indexes:
 * - PRIMARY KEY (id)
 * - idx_disputes_order (order_id)
 * - idx_disputes_status (status, created_at DESC)
 */
export interface DisputeRow {
  id: string;
  order_id: string;
  filed_by: string;
  reason: string;
  description: string;
  status: DisputeStatus;
  resolution: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type InsertDispute = Insert<DisputeRow>;
export type UpdateDispute = Update<DisputeRow>;