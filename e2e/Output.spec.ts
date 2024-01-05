import { test, expect } from '@playwright/test';

test('output value and clipboard contents match', async ({ page, browserName }) => {
  // skip firefox because it doesn't support clipboard-read permission
  if (browserName === 'firefox') {
    test.skip();
  }

  await page.goto('/');

  // click a button named 'Copy' within a `div#file-identifier-output` element
  await page.click('div#file-identifier-output >> text=Copy');

  const outputText = await page.textContent('#file-identifier-output >> pre');
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(outputText).toBe(clipboardText);
})
