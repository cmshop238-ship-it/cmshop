/**
 * Storage Service for persistent client state
 * Safe localStorage wrapper with error recovery and fallback
 */

export const STORAGE_KEYS = {
  CART: 'cm_luxury_cart_v1',
  WISHLIST: 'cm_luxury_wishlist_v1',
  ORDERS: 'cm_luxury_orders_v1',
  PRODUCTS_OVERRIDE: 'cm_luxury_products_override_v1',
  COUPONS: 'cm_luxury_coupons_v1',
  AUTH_USER: 'cm_luxury_auth_user_v1',
  SAVED_ADDRESSES: 'cm_luxury_saved_addresses_v1',
  RECENT_SEARCHES: 'cm_luxury_recent_searches_v1',
} as const;

export class StorageService {
  static get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (err) {
      console.warn(`[StorageService] Error reading key: ${key}`, err);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[StorageService] Error writing key: ${key}`, err);
    }
  }

  static remove(key: string): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[StorageService] Error removing key: ${key}`, err);
    }
  }
}
