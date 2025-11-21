import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { PLAN_NAMES, TERM_LABELS, type PlanKey, type TermKey } from "../lib/catalog";

type HostingItem = { id: string; type: "hosting"; plan: PlanKey; term: TermKey; quantity: number };
type SimpleItem = { id: string; type: "simple"; priceId: string; quantity: number };
type CartItem = HostingItem | SimpleItem;
type CartState = { items: CartItem[] };
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { index: number } }
  | { type: "CLEAR" }
  | { type: "SET_ITEMS"; payload: CartItem[] };

type AddResult = "added" | "duplicate" | "replaced";

const CartContext = createContext<{
  items: CartItem[];
  totalQuantity: number;
  addItem: (item: CartItem) => AddResult;
  removeItem: (index: number) => void;
  clear: () => void;
} | null>(null);

const sameKey = (a: CartItem, b: CartItem) =>
  a.type === b.type && a.id === b.id && (a.type !== "hosting" || (a.plan === (b as CartItem & { plan: PlanKey }).plan && a.term === (b as CartItem & { term: TermKey }).term));

const initialState: CartState = { items: [] };

const loadInitialState = (): CartState => {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem("mh_cart");
    return raw ? (JSON.parse(raw) as CartState) : initialState;
  } catch {
    return initialState;
  }
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const index = state.items.findIndex((item) => sameKey(item, action.payload));
      if (index >= 0) {
        const next = [...state.items];
        next[index] = { ...next[index], quantity: next[index].quantity + action.payload.quantity };
        return { items: next };
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
        if (item.type === "hosting") {
          const existingIndex = state.items.findIndex((cartItem) => cartItem.type === "hosting");
          if (existingIndex >= 0) {
            const existing = state.items[existingIndex] as HostingItem;
            if (existing.plan === item.plan && existing.term === item.term) {
              return "duplicate";
            }
            const next = [...state.items];
            next[existingIndex] = item;
            dispatch({ type: "SET_ITEMS", payload: next });
            return "replaced";
          }
        }
        dispatch({ type: "ADD_ITEM", payload: item });
        return "added";
      },
      removeItem: (index: number) => dispatch({ type: "REMOVE_ITEM", payload: { index } }),
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
