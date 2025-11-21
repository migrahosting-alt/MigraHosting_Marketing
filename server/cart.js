import { v4 as uuid } from "uuid";
import db from "./db.js";
import { getOrCreateGuestSession } from "./auth.js";

function ensureCartForRequest(req, res) {
  const now = new Date().toISOString();

  if (req.user?.id) {
    const existing = db.prepare("SELECT * FROM carts WHERE user_id = ?").get(req.user.id);
    if (existing) return existing;
    const id = uuid();
    db.prepare("INSERT INTO carts (id, user_id, created_at) VALUES (?, ?, ?)").run(id, req.user.id, now);
    return { id, user_id: req.user.id, created_at: now };
  }

  const guestId = getOrCreateGuestSession(req, res);
  const existing = db.prepare("SELECT * FROM carts WHERE guest_id = ?").get(guestId);
  if (existing) return existing;
  const id = uuid();
  db.prepare("INSERT INTO carts (id, guest_id, created_at) VALUES (?, ?, ?)").run(id, guestId, now);
  return { id, guest_id: guestId, created_at: now };
}

function mergeGuestCartToUser(userId, guestId) {
  const guestCart = db.prepare("SELECT * FROM carts WHERE guest_id = ?").get(guestId);
  if (!guestCart) return;

  let userCart = db.prepare("SELECT * FROM carts WHERE user_id = ?").get(userId);
  const now = new Date().toISOString();

  if (!userCart) {
    const newId = uuid();
    db.prepare("INSERT INTO carts (id, user_id, created_at) VALUES (?, ?, ?)").run(newId, userId, now);
    userCart = { id: newId };
  }

  const items = db.prepare("SELECT * FROM cart_items WHERE cart_id = ?").all(guestCart.id);
  const insert = db.prepare(`
    INSERT INTO cart_items (id, cart_id, kind, name, plan, term, price_id, qty, meta_json, created_at)
    VALUES (@id, @cart_id, @kind, @name, @plan, @term, @price_id, @qty, @meta_json, @created_at)
  `);

  const tx = db.transaction(() => {
    for (const it of items) {
      insert.run({
        id: uuid(),
        cart_id: userCart.id,
        kind: it.kind,
        name: it.name,
        plan: it.plan,
        term: it.term,
        price_id: it.price_id,
        qty: it.qty,
        meta_json: it.meta_json,
        created_at: now,
      });
    }
    db.prepare("DELETE FROM cart_items WHERE cart_id = ?").run(guestCart.id);
    db.prepare("DELETE FROM carts WHERE id = ?").run(guestCart.id);
  });

  tx();
}

export { ensureCartForRequest, mergeGuestCartToUser };
