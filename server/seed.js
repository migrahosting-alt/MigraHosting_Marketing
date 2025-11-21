import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATALOG = [
  { id: "student", name: "Student Plan", amount: 0, priceId: null },
  { id: "starter", name: "Starter", amount: 149, priceId: "price_xxx_starter" },
  { id: "premium", name: "Premium", amount: 249, priceId: "price_xxx_premium" },
  { id: "business", name: "Business", amount: 399, priceId: "price_xxx_business" },
];

async function main() {
  for (const plan of CATALOG) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      create: plan,
      update: {
        name: plan.name,
        amount: plan.amount,
        priceId: plan.priceId,
      },
    });
  }

  console.log("Seeded plans:", CATALOG.map((plan) => plan.id).join(", "));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
