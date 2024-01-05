import { test, expect } from '@playwright/test';

test('when using a collection resource type, citation section is hidden', async ({ page }) => {
  await page.goto('/');

  // set the radio button with an id #resource-type-collection to selected
  await page.check('#resource-type-collection');

  // a div#services should not be visible
  expect(await page.isVisible('div#citation')).toBe(false);
})

test('when using a product resource type, services section is hidden', async ({ page }) => {
  await page.goto('/');

  // set the radio button with an id #resource-type-product to selected
  await page.check('#resource-type-product');

  // a div#services should not be visible
  expect(await page.isVisible('div#services')).toBe(false);
})

