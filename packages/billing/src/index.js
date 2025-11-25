export const TERM = {
  MONTH: "month",
  YEAR: "year",
  TWO_YEARS: "2years",
  THREE_YEARS: "3years",
};

export const PRICE_MAP = {
  "price_1SQcISPwKgOrBJUApZmVknSP": { sku: "starter", term: TERM.MONTH, unitAmount: 7.99, type: "recurring" },
  "price_1SQcrFPwKgOrBJUAFmFXOG5T": { sku: "starter", term: TERM.YEAR, unitAmount: 29.88, type: "recurring" },
  "price_1SQcrXPwKgOrBJUAcMfAAcZ0": { sku: "starter", term: TERM.TWO_YEARS, unitAmount: 47.76, type: "recurring" },
  "price_1SQcsZPwKgOrBJUAIqGL80n9": { sku: "starter", term: TERM.THREE_YEARS, unitAmount: 53.64, type: "recurring" },
  "price_1SQcuGPwKgOrBJUABijIlFwC": { sku: "starter", type: "setup", unitAmount: 2.85 },

  "price_1SQcJ2PwKgOrBJUA99qX0j3W": { sku: "premium", term: TERM.MONTH, unitAmount: 8.99, type: "recurring" },
  "price_1SQcpUPwKgOrBJUAjtRWxkre": { sku: "premium", term: TERM.YEAR, unitAmount: 41.88, type: "recurring" },
  "price_1SQcpmPwKgOrBJUATMrytn3f": { sku: "premium", term: TERM.TWO_YEARS, unitAmount: 71.76, type: "recurring" },
  "price_1SQcqHPwKgOrBJUANuwraEKI": { sku: "premium", term: TERM.THREE_YEARS, unitAmount: 89.64, type: "recurring" },

  "price_1SQcJZPwKgOrBJUAzxYp5rBg": { sku: "business", term: TERM.MONTH, unitAmount: 9.99, type: "recurring" },
  "price_1SQcmWPwKgOrBJUAHef1Erzv": { sku: "business", term: TERM.YEAR, unitAmount: 59.88, type: "recurring" },
  "price_1SQcnPPwKgOrBJUAxakV0pNZ": { sku: "business", term: TERM.TWO_YEARS, unitAmount: 107.76, type: "recurring" },
  "price_1SQcnzPwKgOrBJUA0Rh8M5Yh": { sku: "business", term: TERM.THREE_YEARS, unitAmount: 143.64, type: "recurring" },
};

export function parseLineItems(lines) {
  const items = [];
  for (const ln of lines.data || []) {
    const priceId = ln.price?.id ?? ln.price ?? ln.plan?.id;
    if (!priceId) continue;
    const map = PRICE_MAP[priceId];
    if (map) items.push({ priceId, ...map });
  }
  return items;
}
