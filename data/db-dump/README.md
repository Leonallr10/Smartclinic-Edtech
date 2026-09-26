# Database dump

Demo-scoped JSON export of SmartClinic tables for reviewers.

## Contents

| File | Description |
|------|-------------|
| `smartclinic-demo-dump.json` | Full dump (all tables, demo accounts only) |
| `User.json` … `Prescription.json` | Per-table JSON |

**Demo accounts in the dump**

| Role | Email | Password |
|------|--------|----------|
| Admin | `admin@smartclinic.com` | `Admin@123` |
| Patient | `patient@smartclinic.com` | `Patient@123` |
| Doctor | `doctor@smartclinic.com` | `Doctor@123` |

Passwords are stored as bcrypt hashes in `User.json`. Prefer reseeding with `npm run db:seed` if you only need accounts.

## Export (maintainers)

```bash
# Requires DATABASE_URL in .env
npm run db:dump
```

Then re-run the sanitize step used in CI/docs, or keep only `smartclinic-demo-dump.json` if personal data must stay out of git.

## Import into a fresh Postgres database

### Option A — seed only (recommended)

```bash
npx prisma db push
npm run db:seed
```

### Option B — restore JSON rows with Prisma

1. Create an empty database and push the schema:

```bash
npx prisma db push
```

2. Load the demo dump (Node + Prisma). Example:

```bash
npx tsx -e "
import 'dotenv/config';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const dump = JSON.parse(fs.readFileSync('data/db-dump/smartclinic-demo-dump.json','utf8'));
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  for (const u of dump.tables.User) {
    await prisma.user.upsert({ where: { email: u.email }, update: u, create: u });
  }
  for (const p of dump.tables.Patient) {
    await prisma.patient.upsert({ where: { id: p.id }, update: p, create: p });
  }
  for (const d of dump.tables.Doctor) {
    await prisma.doctor.upsert({ where: { id: d.id }, update: d, create: d });
  }
  for (const a of dump.tables.Appointment) {
    await prisma.appointment.upsert({ where: { id: a.id }, update: a, create: a });
  }
  for (const s of dump.tables.SymptomCheck) {
    await prisma.symptomCheck.upsert({ where: { id: s.id }, update: s, create: s });
  }
  for (const r of dump.tables.MedicalRecord) {
    await prisma.medicalRecord.upsert({ where: { id: r.id }, update: r, create: r });
  }
  for (const p of dump.tables.Prescription) {
    await prisma.prescription.upsert({ where: { id: p.id }, update: p, create: p });
  }
  console.log('Import complete');
}
main().finally(() => prisma.\$disconnect().then(() => pool.end()));
"
```

Import order matters because of foreign keys: **User → Patient/Doctor → Appointment / SymptomCheck → MedicalRecord → Prescription**.
