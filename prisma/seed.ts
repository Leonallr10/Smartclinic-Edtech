/**
 * Seeds demo accounts for local / shared environments.
 * Run: npx tsx prisma/seed.ts
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const DEMOS = [
  {
    email: 'admin@smartclinic.com',
    name: 'Admin',
    role: 'ADMIN' as const,
    password: 'Admin@123',
  },
  {
    email: 'patient@smartclinic.com',
    name: 'Demo Patient',
    role: 'PATIENT' as const,
    password: 'Patient@123',
  },
  {
    email: 'doctor@smartclinic.com',
    name: 'Demo Doctor',
    role: 'DOCTOR' as const,
    password: 'Doctor@123',
  },
];

async function upsertDemo(demo: (typeof DEMOS)[number]) {
  const hashed = await bcrypt.hash(demo.password, 10);
  const user = await prisma.user.upsert({
    where: { email: demo.email },
    update: {
      name: demo.name,
      password: hashed,
      role: demo.role,
      isActive: true,
    },
    create: {
      name: demo.name,
      email: demo.email,
      password: hashed,
      role: demo.role,
      isActive: true,
    },
  });

  if (demo.role === 'PATIENT') {
    await prisma.patient.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        phone: '+1-555-0100',
        bloodGroup: 'O+',
        address: '123 Demo Street',
      },
    });
  }

  if (demo.role === 'DOCTOR') {
    await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {
        specialisation: 'General Medicine',
        licenseNumber: 'DEMO-DOC-001',
        experienceYears: 8,
        bio: 'Demo doctor account for reviewers.',
        isAvailable: true,
        isVerified: true,
      },
      create: {
        userId: user.id,
        specialisation: 'General Medicine',
        licenseNumber: 'DEMO-DOC-001',
        experienceYears: 8,
        bio: 'Demo doctor account for reviewers.',
        isAvailable: true,
        isVerified: true,
      },
    });
  }

  console.log(`✓ ${demo.role}: ${demo.email} / ${demo.password}`);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }
  for (const demo of DEMOS) {
    await upsertDemo(demo);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
