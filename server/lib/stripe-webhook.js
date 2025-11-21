import Stripe from "stripe";
import { PRICE_MAP, TERM, parseLineItems } from "../../packages/billing/src/index.js";
import { provisionHosting, provisionSimpleItem } from "./provision.js";

// Lazily initialize Stripe AFTER env is loaded in server/index.js (ESM import order)
let _stripe;
function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment");
    }
    _stripe = new Stripe(key, { apiVersion: "2024-06-20" });
  }
  return _stripe;
}

export async function handleStripeEvent(event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_details?.email || session.customer_email;
      if (!email) return;

      // Get customer name from session
      const customerName = session.customer_details?.name || null;

      const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, { limit: 100 });
      const mapped = parseLineItems(lineItems);
      const subId = session.subscription || null;

      for (const item of mapped) {
        if (item.type === "recurring") {
          await provisionHosting({
            email,
            customerName,
            sku: item.sku,
            term: item.term ?? TERM.MONTH,
            stripeSubscriptionId: subId,
            stripeCustomerId: session.customer,
          });
        } else if (item.type === "setup") {
          await provisionSimpleItem({
            email,
            customerName,
            sku: `${item.sku}-setup`,
            quantity: 1,
            stripeInvoiceId: null,
          });
        }
      }
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      const email = invoice.customer_email || invoice.customer_details?.email;
      if (!email) return;

      const lines = invoice.lines || { data: [] };
  const mapped = parseLineItems(lines);
      for (const item of mapped) {
        if (item.type === "recurring") {
          await provisionSimpleItem({
            email,
            sku: `${item.sku}-renewal`,
            quantity: 1,
            stripeInvoiceId: invoice.id,
          });
        }
      }
      break;
    }
    default:
      break;
  }
}
