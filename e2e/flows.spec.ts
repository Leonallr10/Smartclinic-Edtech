import { test, expect, type Page } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@smartclinic.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'Admin@123';
const patientEmail = process.env.E2E_PATIENT_EMAIL || 'patient@smartclinic.com';
const patientPassword = process.env.E2E_PATIENT_PASSWORD || 'Patient@123';
const doctorEmail = process.env.E2E_DOCTOR_EMAIL || 'doctor@smartclinic.com';
const doctorPassword = process.env.E2E_DOCTOR_PASSWORD || 'Doctor@123';

async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.getByLabel(/^email$/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
}

test.describe('Role dashboards', () => {
  test('patient can sign in and see dashboard + book CTA', async ({ page }) => {
    await login(page, patientEmail, patientPassword);
    await expect(page).toHaveURL(/\/patient\/dashboard/, { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: /my appointments/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /book new/i })).toBeVisible();
  });

  test('patient can open book appointment modal and load doctors', async ({ page }) => {
    await login(page, patientEmail, patientPassword);
    await expect(page).toHaveURL(/\/patient\/dashboard/, { timeout: 30_000 });
    await page.getByRole('button', { name: /book new/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/select doctor/i)).toBeVisible({ timeout: 15_000 });
  });

  test('patient symptom checker UI is available', async ({ page }) => {
    await login(page, patientEmail, patientPassword);
    await expect(page).toHaveURL(/\/patient\/dashboard/, { timeout: 30_000 });
    const field = page.getByPlaceholder(/persistent headache/i);
    await expect(field).toBeVisible();
    await field.fill('Persistent headache for two days with mild fever and sore throat');
    await expect(page.getByRole('button', { name: /check symptoms/i })).toBeEnabled();
  });

  test('doctor can sign in and reach dashboard', async ({ page }) => {
    await login(page, doctorEmail, doctorPassword);
    await expect(page).toHaveURL(/\/doctor\/dashboard/, { timeout: 30_000 });
    await expect(page.getByText(/doctor|appointment|session|welcome/i).first()).toBeVisible();
  });

  test('admin can open users and doctors management', async ({ page }) => {
    await login(page, adminEmail, adminPassword);
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 30_000 });
    await expect(page.getByText(/total patients/i)).toBeVisible();

    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\/users/);
    await expect(page.getByRole('heading', { name: /user management/i })).toBeVisible({
      timeout: 15_000,
    });

    await page.goto('/admin/doctors');
    await expect(page).toHaveURL(/\/admin\/doctors/);
    await expect(page.getByRole('heading', { name: /doctor verification/i })).toBeVisible({
      timeout: 15_000,
    });
  });
});

test.describe('Forgot password', () => {
  test('generates a reset link for a known account', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await page.getByLabel(/^email$/i).fill(patientEmail);
    await page.getByRole('button', { name: /^send reset link$/i }).click();
    await expect(page.getByText('Check your inbox')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('link', { name: /reset my password/i })).toHaveAttribute(
      'href',
      /\/auth\/reset-password\?token=/,
    );
  });
});

test.describe('Responsive smoke', () => {
  test('landing and login render on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /healthcare/i })).toBeVisible();
    await page.goto('/auth/login');
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });
});
