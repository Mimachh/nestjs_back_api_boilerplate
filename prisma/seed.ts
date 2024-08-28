import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.createMany({
    data: [
      { name: 'ADMIN', slug: 'admin' },
      { name: 'USER', slug: 'user' },
      { name: 'SUPERADMIN', slug: 'superadmin' },
      { name: 'VENDOR', slug: 'vendor' },
      { name: 'CUSTOMER', slug: 'customer' },
      { name: 'PRO', slug: 'pro' },
    ],
  });

  console.log('seeding done')
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
