import { PrismaClient } from '../../../generated/prisma'
import mockProducts from '../../../mockProducts'

const prisma = new PrismaClient()

async function main() {
  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      { id: 1, name: 'Automotive' },
      { id: 2, name: 'Baby' },
      { id: 3, name: 'Beauty' },
      { id: 4, name: 'Books' },
      { id: 5, name: 'Clothing' },
      { id: 6, name: 'Computers' },
      { id: 7, name: 'Electronics' },
      { id: 8, name: 'Games' },
      { id: 9, name: 'Garden' },
      { id: 10, name: 'Grocery' },
      { id: 11, name: 'Health' },
      { id: 12, name: 'Home' },
      { id: 13, name: 'Industrial' },
      { id: 14, name: 'Jewelry' },
      { id: 15, name: 'Kids' },
      { id: 16, name: 'Movies' },
      { id: 17, name: 'Music' },
      { id: 18, name: 'Outdoors' },
      { id: 19, name: 'Shoes' },
      { id: 20, name: 'Sports' },
      { id: 21, name: 'Tools' },
      { id: 22, name: 'Toys' },
    ],
  })

  // Upserting mock data
  for (let product of mockProducts) {
    await prisma.product.upsert({
      where: { id: product[0] as string },
      update: {},
      create: {
        id: product[0] as string,
        name: product[1] as string,
        description: product[2] as string,
        price: product[3],
        image_url: product[4] as string,
        category_id: product[5] as number,
        stock_quantity: product[6] as number,
      },
    })
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
