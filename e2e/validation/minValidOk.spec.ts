import { test, expect } from '@playwright/test'

// @ts-ignore
import { minimalRecordAsText } from '../../src/lib/__tests__/_validation_data'

test('a pasted minimal, valid, record validates', async ({ page }) => {
  await page.goto('/')

  // paste the minimal record into the textarea with the id 'validation-input'
  await page.fill('textarea#validation-input', minimalRecordAsText)

  // element with id 'validation-message' says '😀 Record is valid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😀 Record is valid.')
})
