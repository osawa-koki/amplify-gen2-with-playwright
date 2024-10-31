import { test, expect } from '@playwright/test';

test.use({ storageState: './storageState.empty.json' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Sign in: success', async ({ page }) => {
  await page.fill('input[type="email"]', process.env.USERNAME!);
  await page.fill('input[type="password"]', process.env.PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('🥳 App successfully hosted. Try creating a new todo.')).toBeVisible();
  await expect(page.getByText(`${process.env.USERNAME!}'s todos`)).toBeVisible();
});

test('Sign in: failure', async ({ page }) => {
  await page.fill('input[type="email"]', process.env.USERNAME!);
  await page.fill('input[type="password"]', `${process.env.PASSWORD!}-invalid`);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Incorrect username or password.')).toBeVisible();
});
