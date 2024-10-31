import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.afterEach(async ({ page }) => {
  const items = await page.locator('li').all();
  for (const item of items) {
    await item.click();
  }
});

test('Todo: create', async ({ page }) => {
  await expect(page.getByText('🥳 App successfully hosted. Try creating a new todo.')).toBeVisible();
  const todo = `e2e-test-${Date.now()}`;
  await page.fill('input[name="content"]', todo);
  await page.getByRole('button', { name: '+ new' }).click();
  await expect(page.getByText(todo)).toBeVisible();
});

test('Todo: delete', async ({ page }) => {
  await expect(page.getByText('🥳 App successfully hosted. Try creating a new todo.')).toBeVisible();
  const todo = `e2e-test-${Date.now()}`;
  await page.fill('input[name="content"]', todo);
  await page.getByRole('button', { name: '+ new' }).click();
  await expect(page.getByText(todo)).toBeVisible();
  await page.locator('li').filter({ hasText: todo }).click();
  await expect(page.getByText(todo)).not.toBeVisible();
});
