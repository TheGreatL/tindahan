import 'dotenv/config';
import {Pool} from 'pg';
import bcrypt from 'bcrypt';
import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient, RoleType, Permission} from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({connectionString});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});

async function main() {
  console.log('🌱 Starting seeding...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Default Roles
  console.log('📦 Creating default roles...');
  
  const adminRole = await prisma.role.upsert({
    where: {name: 'Admin'},
    update: {},
    create: {
      name: 'Admin',
      description: 'System Administrator with full access',
      type: RoleType.ADMIN,
      permissions: Object.values(Permission), // All permissions
    },
  });

  const cashierRole = await prisma.role.upsert({
    where: {name: 'Cashier'},
    update: {},
    create: {
      name: 'Cashier',
      description: 'Standard cashier for POS operations',
      type: RoleType.EMPLOYEE,
      permissions: [
        Permission.POS_ACCESS,
        Permission.POS_REPRINT_RECEIPT,
        Permission.INVENTORY_VIEW,
        Permission.CUSTOMER_VIEW,
      ],
    },
  });

  // 2. Create Users
  console.log('👥 Creating users...');

  const admin = await prisma.user.upsert({
    where: {email: 'admin@example.com'},
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      roleId: adminRole.id,
    },
  });
  console.log('✅ Admin created:', admin.email);

  const cashier = await prisma.user.upsert({
    where: {email: 'cashier@example.com'},
    update: {},
    create: {
      email: 'cashier@example.com',
      password: hashedPassword,
      firstName: 'Juana',
      lastName: 'Cashier',
      roleId: cashierRole.id,
    },
  });
  console.log('✅ Cashier created:', cashier.email);

  console.log('✨ Seeding finished successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

