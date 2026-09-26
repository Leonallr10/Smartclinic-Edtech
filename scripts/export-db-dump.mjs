/**
 * Exports demo-scoped SmartClinic tables to data/db-dump/*.json
 * Run: npm run db:dump
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'data', 'db-dump');
const DEMO_EMAILS = [
  'admin@smartclinic.com',
  'patient@smartclinic.com',
  'doctor@smartclinic.com',
];

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

fs.mkdirSync(outDir, { recursive: true });

const { rows: users } = await pool.query(
  `SELECT id, name, email, password, role, "isActive", "createdAt"
   FROM "User" WHERE email = ANY($1::text[])`,
  [DEMO_EMAILS],
);
const userIds = users.map((u) => u.id);

const { rows: patients } = await pool.query(
  `SELECT * FROM "Patient" WHERE "userId"::text = ANY($1::text[])`,
  [userIds],
);
const { rows: doctors } = await pool.query(
  `SELECT * FROM "Doctor" WHERE "userId"::text = ANY($1::text[])`,
  [userIds],
);
const patientIds = patients.map((p) => p.id);
const doctorIds = doctors.map((d) => d.id);

let appointments = [];
let symptoms = [];
let records = [];
let prescriptions = [];

if (patientIds.length && doctorIds.length) {
  appointments = (
    await pool.query(
      `SELECT * FROM "Appointment"
       WHERE "patientId"::text = ANY($1::text[]) AND "doctorId"::text = ANY($2::text[])`,
      [patientIds, doctorIds],
    )
  ).rows;
  records = (
    await pool.query(
      `SELECT * FROM "MedicalRecord"
       WHERE "patientId"::text = ANY($1::text[]) AND "doctorId"::text = ANY($2::text[])`,
      [patientIds, doctorIds],
    )
  ).rows;
}

if (patientIds.length) {
  symptoms = (
    await pool.query(`SELECT * FROM "SymptomCheck" WHERE "patientId"::text = ANY($1::text[])`, [
      patientIds,
    ])
  ).rows;
}

const recordIds = records.map((r) => r.id);
if (recordIds.length) {
  prescriptions = (
    await pool.query(`SELECT * FROM "Prescription" WHERE "recordId"::text = ANY($1::text[])`, [
      recordIds,
    ])
  ).rows;
}

const dump = {
  exportedAt: new Date().toISOString(),
  scope: 'demo-accounts-only',
  note: 'Passwords are bcrypt hashes. Prefer npm run db:seed for clean demo accounts.',
  tables: {
    User: users,
    Patient: patients,
    Doctor: doctors,
    Appointment: appointments,
    SymptomCheck: symptoms,
    MedicalRecord: records,
    Prescription: prescriptions,
  },
};

for (const [name, rows] of Object.entries(dump.tables)) {
  fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(rows, null, 2));
  console.log(`✓ ${name}: ${rows.length} rows`);
}

fs.writeFileSync(path.join(outDir, 'smartclinic-demo-dump.json'), JSON.stringify(dump, null, 2));
console.log(`\nWrote ${path.join(outDir, 'smartclinic-demo-dump.json')}`);

await pool.end();
