import { PrismaClient } from "../../../generated/prisma";
import mockProducts from '../../../mockProducts'

const prisma = new PrismaClient();

async function main() {
    // Upserting mock data
    for (let product of mockProducts) {
        await prisma.products.upsert({
          where: { id: product[0] as string },
          update: {},
          create: {
            id: product[0] as string,
            name: product[1] as string,
            description:
              product[2] as string,
            price: product[3],
            image_url:
              product[4] as string,
            category: product[5] as string,
            stock_quantity: product[6] as number,
          },
        });
    }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
