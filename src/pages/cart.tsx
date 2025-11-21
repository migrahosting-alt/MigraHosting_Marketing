import React from "react";
import { PLAN_NAMES, TERM_LABELS } from "../lib/catalog";
import { useCart } from "../context/CartContext";

const formatTitle = (item) => {
  if (item.type === "hosting" && item.plan) {
    return `${PLAN_NAMES[item.plan] ?? item.plan} hosting`;
  }
  return item.id;
};

export default function CartPage() {
  const { items, removeItem, clear } = useCart();

  return (
    <main className="min-h-screen bg-[#050816] text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-3xl font-bold text-white">Your cart</h1>
        {items.length === 0 ? (
          <p className="mt-6 text-slate-300">Your cart is empty.</p>
        ) : (
          <>
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-slate-800 px-4 py-3 last:border-b-0">
                  <div>
                    <p className="text-lg font-semibold text-white">{formatTitle(item)}</p>
                    {item.type === "hosting" && item.term && (
                      <p className="text-xs text-slate-400">Billing term: {TERM_LABELS[item.term] ?? item.term}</p>
                    )}
                    <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-red-400 hover:text-red-200"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={clear}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                Clear cart
              </button>
              <a
                href="/checkout"
                className="rounded-full bg-gradient-to-r from-[#6A5CFF] via-[#8A4DFF] to-[#FF6584] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30"
              >
                Go to checkout
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
