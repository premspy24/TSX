export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  verified: boolean;
  rating: number;
  totalSales: number;
  totalPurchases: number;
  joinDate: string;
  role: "user" | "admin";
  city?: string;
};

export type EventCategory =
  | "concert"
  | "cricket"
  | "football"
  | "comedy"
  | "festival"
  | "movie"
  | "conference"
  | "theatre"
  | "other";

export type Venue = {
  id: string;
  name: string;
  city: string;
  address: string;
  capacity: number;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: Venue;
  image: string;
  organizer: string;
  basePrice: number;
  totalTickets: number;
  availableTickets: number;
  featured: boolean;
  tags: string[];
};

export type TicketType = "standard" | "vip" | "premium" | "general" | "standing" | "box";

export type TicketListing = {
  id: string;
  eventId: string;
  event: Event;
  sellerId: string;
  seller: User;
  ticketType: TicketType;
  section?: string;
  row?: string;
  seat?: string;
  quantity: number;
  originalPrice: number;
  sellingPrice: number;
  verified: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  transferMethod: "instant_transfer" | "manual_transfer" | "meet_at_venue";
  status: "active" | "sold" | "expired" | "draft";
  createdAt: string;
  updatedAt: string;
  description?: string;
  ticketFile?: string;
  views: number;
  watchers: number;
};

export type OrderStatus =
  | "pending"
  | "payment_processing"
  | "payment_complete"
  | "transferring"
  | "transferred"
  | "completed"
  | "cancelled"
  | "refunded"
  | "disputed";

export type Order = {
  id: string;
  listingId: string;
  listing: TicketListing;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  quantity: number;
  totalPrice: number;
  platformFee: number;
  sellerPayout: number;
  paymentMethod: string;
  paymentStatus: "pending" | "processing" | "completed" | "failed" | "refunded";
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  transactionId: string;
  transferCode?: string;
};

export type ExchangeStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "countered"
  | "completed"
  | "cancelled";

export type ExchangeRequest = {
  id: string;
  requesterId: string;
  requester: User;
  requesterListingId: string;
  requesterListing: TicketListing;
  targetListingId: string;
  targetListing: TicketListing;
  message?: string;
  status: ExchangeStatus;
  createdAt: string;
  updatedAt: string;
};

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

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
};

export type Review = {
  id: string;
  reviewerId: string;
  revieweeId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ReportReason =
  | "fraud"
  | "duplicate_ticket"
  | "fake_listing"
  | "wrong_description"
  | "scam"
  | "other";

export type Report = {
  id: string;
  reporterId: string;
  listingId: string;
  reason: ReportReason;
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed";
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
};

export type Dispute = {
  id: string;
  orderId: string;
  filedBy: string;
  reason: string;
  description: string;
  status: "open" | "investigating" | "resolved" | "closed";
  resolution?: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export type Transaction = {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  fee: number;
  netAmount: number;
  type: "purchase" | "sale" | "payout" | "refund";
  status: "pending" | "completed" | "failed";
  paymentMethod: PaymentMethod;
  createdAt: string;
};

export type AdminStats = {
  totalUsers: number;
  activeListings: number;
  ticketsSold: number;
  gmv: number;
  platformRevenue: number;
  successfulExchanges: number;
  failedTransactions: number;
  reportedListings: number;
};

export type SearchFilters = {
  query: string;
  category?: EventCategory;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  ticketType?: TicketType;
  availability?: boolean;
};

export type SellStep = "event" | "details" | "verification" | "preview" | "publish";
