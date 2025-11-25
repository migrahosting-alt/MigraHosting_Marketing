import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { PLAN_NAMES, TERM_LABELS, type PlanKey, type TermKey } from "../lib/catalog";

type HostingItem = { id: string; type: "hosting"; plan: PlanKey; term: TermKey; quantity: number; trial?: boolean };
type DomainItem = { id: string; type: "domain"; domain: string; quantity: number };
type EmailItem = { id: string; type: "email"; quantity: number };
type SimpleItem = { id: string; type: "simple"; priceId: string; quantity: number };
type CartItem = HostingItem | DomainItem | EmailItem | SimpleItem;
type CartState = { items: CartItem[] };
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { index: number } }
  | { type: "UPDATE_QUANTITY"; payload: { index: number; quantity: number } }
  | { type: "CLEAR" }
  | { type: "SET_ITEMS"; payload: CartItem[] };

type AddResult = "added" | "duplicate" | "replaced";

const CartContext = createContext<{
  items: CartItem[];
  totalQuantity: number;
  addItem: (item: CartItem) => AddResult;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clear: () => void;
} | null>(null);

const sameKey = (a: CartItem, b: CartItem) => {
  if (a.type !== b.type || a.id !== b.id) return false;
  
  if (a.type === "hosting" && b.type === "hosting") {
    return a.plan === b.plan && a.term === b.term;
  }
  
  if (a.type === "domain" && b.type === "domain") {
    return a.domain === b.domain;
  }
  
  // For email and simple items, just match by id
  return true;
};

const sanitizeItems = (items: CartItem[]): CartItem[] => {
  const seen = new Map<string, CartItem>();
  items.forEach((item) => {
    const key = item.id;
    if (!seen.has(key)) {
      const normalizedQuantity =
        item.type === "domain" || item.type === "email" || item.type === "hosting"
          ? 1
          : Math.max(1, item.quantity);
      seen.set(key, { ...item, quantity: normalizedQuantity });
    }
  });
  return Array.from(seen.values());
};

const CART_VERSION = "v3"; // Increment to force cart reset
const initialState: CartState = { items: [] };

const loadInitialState = (): CartState => {
  if (typeof window === "undefined") return initialState;
  try {
    // Check cart version
    const version = localStorage.getItem("mh_cart_version");
    if (version !== CART_VERSION) {
      // Clear old cart and set new version
      localStorage.removeItem("mh_cart");
      localStorage.setItem("mh_cart_version", CART_VERSION);
      return initialState;
    }
    
    const raw = localStorage.getItem("mh_cart");
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) return initialState;
    
    // Enforce single hosting plan rule during load
    const hostingItems = parsed.items.filter(item => item.type === "hosting");
    if (hostingItems.length > 1) {
      // Keep only the last hosting plan
      const lastHosting = hostingItems[hostingItems.length - 1];
      const cleanedItems = parsed.items.filter(item => 
        item.type !== "hosting" || sameKey(item, lastHosting)
      );
      return { items: sanitizeItems(cleanedItems) };
    }
    
    return { items: sanitizeItems(parsed.items) };
  } catch {
    return initialState;
  }
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const index = state.items.findIndex((item) => sameKey(item, action.payload));
      if (index >= 0) {
        // Don't increment quantity for domains, emails, or hosting - just return existing state
        if (action.payload.type === "domain" || action.payload.type === "email" || action.payload.type === "hosting") {
          return state;
        }
        const next = [...state.items];
        next[index] = { ...next[index], quantity: next[index].quantity + action.payload.quantity } as CartItem;
        return { items: next };
      }
      // Force quantity to 1 for domains, emails, and hosting
      if (action.payload.type === "domain" || action.payload.type === "email" || action.payload.type === "hosting") {
        return { items: [...state.items, { ...action.payload, quantity: 1 }] };
      }
      return { items: [...state.items, action.payload] };
    }
    case "SET_ITEMS":
      return { items: action.payload };
    case "REMOVE_ITEM": {
      const next = [...state.items];
      next.splice(action.payload.index, 1);
      return { items: next };
    }
    case "UPDATE_QUANTITY": {
      const next = [...state.items];
      if (next[action.payload.index]) {
        const item = next[action.payload.index];
        // Force quantity to 1 for domains, emails, and hosting
        if (item.type === "domain" || item.type === "email" || item.type === "hosting") {
          next[action.payload.index] = {
            ...item,
            quantity: 1
          } as CartItem;
        } else {
          next[action.payload.index] = {
            ...item,
            quantity: Math.max(1, action.payload.quantity)
          } as CartItem;
        }
      }
      return { items: next };
    }
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  // IMMEDIATE CLEANUP: Remove duplicate hosting plans on mount
  useEffect(() => {
    const hostingItems = state.items.filter(item => item.type === "hosting");
    if (hostingItems.length > 1) {
      // Keep only the first hosting plan, remove all others
      const firstHosting = hostingItems[0];
      const cleanedItems = state.items.filter(item => 
        item.type !== "hosting" || sameKey(item, firstHosting)
      );
      dispatch({ type: "SET_ITEMS", payload: cleanedItems });
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mh_cart", JSON.stringify(state));
    }
  }, [state]);

  const totalQuantity = useMemo(() => state.items.reduce((sum, item) => sum + item.quantity, 0), [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      totalQuantity,
      addItem: (item: CartItem): AddResult => {
        // ENFORCE: Only ONE hosting plan allowed in cart at a time
        if (item.type === "hosting") {
          const existingHostingIndex = state.items.findIndex((cartItem) => cartItem.type === "hosting");
          
          if (existingHostingIndex >= 0) {
            const existing = state.items[existingHostingIndex];
            if (existing.type === "hosting" && existing.plan === item.plan && existing.term === item.term) {
              return "duplicate";
            }
            // REPLACE the existing hosting plan with the new one
            const nonHostingItems = state.items.filter((cartItem) => cartItem.type !== "hosting");
            const next = [...nonHostingItems, { ...item, quantity: 1 }];
            dispatch({ type: "SET_ITEMS", payload: next });
            return "replaced";
          }
        }
        
        // Check for existing item
        const existingIndex = state.items.findIndex((cartItem) => sameKey(cartItem, item));
        
        if (existingIndex >= 0) {
          // For domains and emails, don't allow duplicates or quantity increments
          if (item.type === "domain" || item.type === "email") {
            return "duplicate";
          }
        }
        
        dispatch({ type: "ADD_ITEM", payload: item });
        return "added";
      },
      removeItem: (index: number) => dispatch({ type: "REMOVE_ITEM", payload: { index } }),
      updateQuantity: (index: number, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { index, quantity } }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state.items, totalQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
