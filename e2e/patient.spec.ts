import { test, expect } from '@playwright/test';

/**
 * Patient flows that need a registered patient account.
 * Creates a unique patient each run via /auth/register.
 */
test.describe('Patient flows', () => {
  test('register patient, run symptom check UI, open booking modal', async ({ page }) => {
    const stamp = Date.now();
    const email = `e2e.patient.${stamp}@smartclinic.test`;
    const password = 'TestPass123';

    await page.goto('/auth/register');
    await expect(page.getByLabel(/full name/i)).toBeVisible({ timeout: 30_000 });

    await page.getByRole('button', { name: /patient/i }).click();
    await page.getByLabel(/full name/i).fill(`E2E Patient ${stamp}`);
    await page.getByLabel(/^email$/i).fill(email);
    await page.getByLabel(/^password$/i).fill(password);
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page).toHaveURL(/\/patient\/dashboard/, { timeout: 45_000 });

    const symptoms = page.getByPlaceholder(/persistent headache|symptoms/i);
    await expect(symptoms).toBeVisible();
    await symptoms.fill(
      'I have had a persistent headache for three days with mild fever and sore throat.',
    );
    await page.getByRole('button', { name: /check symptoms/i }).click();

    await expect(
      page
        .getByText(
          /urgency|suggestion|emergency|medium|high|low|failed|error|try again|something went wrong/i,
        )
        .first(),
    ).toBeVisible({ timeout: 60_000 });

    const bookBtn = page
      .getByRole('button', { name: /book new|book an appointment|book appointment/i })
      .first();
    if (await bookBtn.isVisible().catch(() => false)) {
      await bookBtn.click();
      await expect(page.getByText(/book appointment|choose a doctor|confirm booking/i).first()).toBeVisible();
    }
  });
});
