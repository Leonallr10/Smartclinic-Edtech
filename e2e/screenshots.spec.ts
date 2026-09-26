/**
 * Captures README screenshots from the live deploy.
 * Run: $env:CAPTURE_SCREENSHOTS=1; npx playwright test e2e/screenshots.spec.ts --project=chromium
 */
import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const outDir = path.join(process.cwd(), 'docs', 'screenshots');
const patientEmail = process.env.E2E_PATIENT_EMAIL || 'patient@smartclinic.com';
const patientPassword = process.env.E2E_PATIENT_PASSWORD || 'Patient@123';
const doctorEmail = process.env.E2E_DOCTOR_EMAIL || 'doctor@smartclinic.com';
const doctorPassword = process.env.E2E_DOCTOR_PASSWORD || 'Doctor@123';
const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@smartclinic.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'Admin@123';

async function signOut(page: import('@playwright/test').Page) {
  await page
    .getByRole('button')
    .filter({ hasText: /patient|doctor|admin/i })
    .last()
    .click();
  await page.getByRole('menuitem', { name: /sign out/i }).click();
}

test.describe.configure({ mode: 'serial' });

test.skip(!process.env.CAPTURE_SCREENSHOTS, 'Set CAPTURE_SCREENSHOTS=1 to refresh README images');

test('capture product screenshots', async ({ page }) => {
  test.setTimeout(180_000);
  fs.mkdirSync(outDir, { recursive: true });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(outDir, '01-landing.png'), fullPage: false });

  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(outDir, '02-login.png'), fullPage: false });

  await page.getByLabel(/^email$/i).fill(patientEmail);
  await page.getByLabel(/^password$/i).fill(patientPassword);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/patient\/dashboard/, { timeout: 30_000 });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(outDir, '03-patient-dashboard.png'), fullPage: false });
  await signOut(page, /demo patient/i);

  await page.goto('/auth/login');
  await page.getByLabel(/^email$/i).fill(doctorEmail);
  await page.getByLabel(/^password$/i).fill(doctorPassword);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/doctor\/dashboard/, { timeout: 30_000 });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(outDir, '04-doctor-dashboard.png'), fullPage: false });
  await signOut(page, /demo doctor/i);

  await page.goto('/auth/login');
  await page.getByLabel(/^email$/i).fill(adminEmail);
  await page.getByLabel(/^password$/i).fill(adminPassword);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/admin\/dashboard/, { timeout: 30_000 });
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(outDir, '05-admin-dashboard.png'), fullPage: false });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: path.join(outDir, '06-landing-mobile.png'), fullPage: false });
});
