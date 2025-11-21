import fetch from "node-fetch";

const API = process.env.MPANEL_API_BASE || "http://localhost:3000";
const TOKEN = process.env.MPANEL_API_TOKEN || "";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
});

export async function ensureUserByEmail(email, customerName = null) {
  const lookup = await fetch(`${API}/api/users/by-email?email=${encodeURIComponent(email)}`, {
    headers: authHeaders(),
  });

  if (lookup.ok) {
    const data = await lookup.json();
    if (data?.id) return data;
  }

  // Parse name if provided
  let firstName = null;
  let lastName = null;
  if (customerName) {
    const nameParts = customerName.trim().split(' ');
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(' ') || null;
  }

  // Create user via auth/register endpoint which handles password generation
  const create = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ 
      email, 
      firstName,
      lastName,
      sendWelcomeEmail: true 
    }),
  });

  if (!create.ok) throw new Error(`mPanel user create failed: ${create.status}`);
  const result = await create.json();
  return result.user;
}

export async function provisionHosting({ email, customerName, sku, term, stripeSubscriptionId, stripeCustomerId }) {
  const user = await ensureUserByEmail(email, customerName);
  const res = await fetch(`${API}/api/subscriptions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      userId: user.id,
      productSku: sku,
      term,
      external: {
        stripeSubscriptionId,
        stripeCustomerId,
      },
    }),
  });

  if (!res.ok) throw new Error(`mPanel provision failed: ${res.status}`);
  return res.json();
}

export async function provisionSimpleItem({ email, customerName, sku, quantity = 1, stripeInvoiceId }) {
  const user = await ensureUserByEmail(email, customerName);
  const res = await fetch(`${API}/api/orders`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      userId: user.id,
      items: [{ sku, quantity }],
      external: { stripeInvoiceId },
    }),
  });

  if (!res.ok) throw new Error(`mPanel simple item failed: ${res.status}`);
  return res.json();
}
