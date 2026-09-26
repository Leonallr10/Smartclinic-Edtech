import { test, expect } from '@playwright/test';

const patientEmail = process.env.E2E_PATIENT_EMAIL || 'patient@smartclinic.com';
const patientPassword = process.env.E2E_PATIENT_PASSWORD || 'Patient@123';
const doctorEmail = process.env.E2E_DOCTOR_EMAIL || 'doctor@smartclinic.com';
const doctorPassword = process.env.E2E_DOCTOR_PASSWORD || 'Doctor@123';
const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@smartclinic.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'Admin@123';

async function signOut(page: import('@playwright/test').Page) {
  // Mobile/collapsed sidebar: open it first if the account control is hidden
  const account = page.getByRole('button').filter({ hasText: /patient|doctor|admin/i }).last();
  if (!(await account.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /toggle sidebar/i }).first().click();
  }
  await account.click();
  await page.getByRole('menuitem', { name: /sign out/i }).click();
}

test.describe('Live walkthrough', () => {
  test('patient → doctor → admin + forgot password + console clean', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err.message));

    const runAi = testInfo.project.name === 'chromium';

    // Patient
    await page.goto('/auth/login');
    await page.getByLabel(/^email$/i).fill(patientEmail);
    await page.getByLabel(/^password$/i).fill(patientPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/patient\/dashboard/, { timeout: 30_000 });
    await expect(page.getByText(/ai symptom checker/i)).toBeVisible();

    const symptoms = page.getByPlaceholder(/persistent headache/i);
    await expect(symptoms).toBeVisible();
    if (runAi) {
      await symptoms.fill('Persistent headache for two days with mild fever and sore throat');
      await page.getByRole('button', { name: /check symptoms/i }).click();
      await expect(page.getByText(/urgency:/i)).toBeVisible({ timeout: 90_000 });
    }

    await page.getByRole('button', { name: /book new/i }).click();
    await expect(page.getByRole('heading', { name: /book appointment/i })).toBeVisible();
    await expect(page.getByText(/select doctor/i)).toBeVisible();
    await page.keyboard.press('Escape');

    await signOut(page);

    // Doctor
    await page.goto('/auth/login');
    await page.getByLabel(/^email$/i).fill(doctorEmail);
    await page.getByLabel(/^password$/i).fill(doctorPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/doctor\/dashboard/, { timeout: 30_000 });
    await expect(page.getByText(/doctor|appointment|welcome/i).first()).toBeVisible();
    await signOut(page);

    // Admin
    await page.goto('/auth/login');
    await page.getByLabel(/^email$/i).fill(adminEmail);
    await page.getByLabel(/^password$/i).fill(adminPassword);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 30_000 });
    await expect(page.getByText(/total patients/i)).toBeVisible();
    await page.goto('/admin/users');
    await expect(
      page.getByText(/admin@smartclinic.com|patient@smartclinic.com/i).first(),
    ).toBeVisible({ timeout: 15_000 });
    await page.goto('/admin/doctors');
    await expect(page.getByRole('heading', { name: /doctor verification/i })).toBeVisible({
      timeout: 15_000,
    });
    await signOut(page);

    // Forgot password
    await page.goto('/auth/forgot-password');
    await page.getByLabel(/^email$/i).fill(patientEmail);
    await page.getByRole('button', { name: /^send reset link$/i }).click();
    await expect(page.getByText('Check your inbox')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('link', { name: /reset my password/i })).toHaveAttribute(
      'href',
      /\/auth\/reset-password\?token=/,
    );

    // Mobile layout
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /healthcare/i })).toBeVisible();
    await page.goto('/auth/login');
    await expect(page.getByLabel(/^email$/i)).toBeVisible();

    const ignored = [
      /favicon/i,
      /Download the React DevTools/i,
      /hydration/i,
      /Failed to load resource/i,
      /NetworkError when attempting to fetch resource/i,
      /TypeError: Load failed/i,
      /access control checks/i,
      /_rsc=/i,
    ];
    const realErrors = consoleErrors.filter((e) => !ignored.some((re) => re.test(e)));
    expect(realErrors, `Console errors:\n${realErrors.join('\n')}`).toEqual([]);
  });
});
