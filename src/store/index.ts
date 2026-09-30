import { create } from "zustand";
import type { User, Notification, TicketListing } from "@/types";
import { DEMO_USERS, DEMO_NOTIFICATIONS } from "@/lib/mock-data";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: () => void;
  loginWithOTP: (phone: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email: string, _password: string) => {
    const user = DEMO_USERS.find((u) => u.email === email);
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    const demoUser = DEMO_USERS[0];
    set({ user: demoUser, isAuthenticated: true });
    return true;
  },
  loginWithGoogle: () => {
    set({ user: DEMO_USERS[0], isAuthenticated: true });
  },
  loginWithOTP: (_phone: string) => {
    set({ user: DEMO_USERS[0], isAuthenticated: true });
    return true;
  },
  register: (name: string, email: string, _password: string) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      verified: false,
      rating: 0,
      totalSales: 0,
      totalPurchases: 0,
      joinDate: new Date().toISOString(),
      role: "user",
    };
    set({ user: newUser, isAuthenticated: true });
    return true;
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  updateProfile: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: DEMO_NOTIFICATIONS,
  unreadCount: DEMO_NOTIFICATIONS.filter((n) => !n.read).length,
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        ...notification,
        id: `n${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
}));

type WishlistState = {
  wishlistIds: string[];
  toggleWishlist: (listingId: string) => void;
  isWishlisted: (listingId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: [],
  toggleWishlist: (listingId) =>
    set((state) => ({
      wishlistIds: state.wishlistIds.includes(listingId)
        ? state.wishlistIds.filter((id) => id !== listingId)
        : [...state.wishlistIds, listingId],
    })),
  isWishlisted: (listingId) => get().wishlistIds.includes(listingId),
}));

type SearchState = {
  query: string;
  recentSearches: string[];
  setQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  recentSearches: ["Coldplay Mumbai", "IPL tickets", "Comedy shows Delhi"],
  setQuery: (query) => set({ query }),
  addRecentSearch: (query) =>
    set((state) => ({
      recentSearches: [query, ...state.recentSearches.filter((s) => s !== query)].slice(0, 5),
    })),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));

type CartState = {
  selectedListing: TicketListing | null;
  quantity: number;
  selectListing: (listing: TicketListing) => void;
  setQuantity: (quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  selectedListing: null,
  quantity: 1,
  selectListing: (listing) => set({ selectedListing: listing, quantity: 1 }),
  setQuantity: (quantity) => set({ quantity }),
  clearCart: () => set({ selectedListing: null, quantity: 1 }),
}));
