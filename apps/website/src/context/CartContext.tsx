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

const initialState: CartState = { items: [] };

const loadInitialState = (): CartState => {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem("mh_cart");
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) return initialState;
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
        // Check for existing item
        const existingIndex = state.items.findIndex((cartItem) => sameKey(cartItem, item));
        
        if (existingIndex >= 0) {
          const existing = state.items[existingIndex];
          
          // For hosting items, replace if different plan/term
          if (item.type === "hosting") {
            if (existing.type === "hosting" && existing.plan === item.plan && existing.term === item.term) {
              return "duplicate";
            }
            const next = [...state.items];
            next[existingIndex] = item;
            dispatch({ type: "SET_ITEMS", payload: next });
            return "replaced";
          }
          
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
