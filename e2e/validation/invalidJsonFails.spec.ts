import { test, expect } from '@playwright/test'

test('invalid JSON does not validate', async ({ page }) => {
  await page.goto('/')

  // paste invalid record into the textarea with the id 'validation-input'
  await page.fill('textarea#validation-input', '//invalid//')

  // element with id 'validation-message' says '😕 Record cannot be understood (invalid format).'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😕 Record cannot be understood (invalid format).')
})
