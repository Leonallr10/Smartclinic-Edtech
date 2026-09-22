import { test, expect } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@smartclinic.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'Admin@123';

test.describe('SmartClinic smoke & auth', () => {
  test('landing page loads with brand and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /healthcare/i })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /create an account|create your free account/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/Leonal Robin D/i).first()).toBeVisible();
  });

  test('login page shows auth form and forgot password', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
  });

  test('admin can sign in and reach admin dashboard', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel(/^email$/i).fill(adminEmail);
    await page.getByLabel(/^password$/i).fill(adminPassword);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 30_000 });
    await expect(page.getByText(/admin/i).first()).toBeVisible();
  });

  test('invalid credentials show an error', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel(/^email$/i).fill('nobody@example.com');
    await page.getByLabel(/^password$/i).fill('wrong-password');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid credentials|login failed|deactivated/i)).toBeVisible();
  });
});
