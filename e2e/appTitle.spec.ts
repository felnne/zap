import { test, expect } from '@playwright/test';

test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  const h1Text = await page.locator('header#app-title > h1').textContent();
  expect(h1Text).toContain('Zap ⚡️');
})
