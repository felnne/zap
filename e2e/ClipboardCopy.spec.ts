import { test, expect } from '@playwright/test'

test('can copy value to clipboard', async ({ page, browserName }) => {
  // skip firefox because it doesn't support clipboard-read permission
  if (browserName === 'firefox') {
    test.skip()
  }

  await page.goto('/')

  // click a button named 'Copy' within a `div#file-identifier-output` element
  await page.click('div#file-identifier-output >> text=Copy')

  // assert the clipboard isn't empty
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
  expect(clipboardText).not.toBe('')
})
