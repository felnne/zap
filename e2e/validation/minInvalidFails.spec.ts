import { test, expect } from '@playwright/test'

// @ts-expect-error can't be bothered to fix type error
import { minimalRecordAsText } from '../../src/lib/__tests__/_validation_data'

test('a pasted minimal, invalid, record does not validate', async ({ page }) => {
  const invalidRecordString = minimalRecordAsText.replace('dataset', 'invalid')

  await page.goto('/')

  // paste the incomplete record into the textarea with the id 'validation-input'
  await page.fill('textarea#validation-input', invalidRecordString)

  // element with id 'validation-message' says '😀 Record is valid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😩 Record is invalid.')

  // element with id 'validation-errors' contains an expected error message
  const expectedText = 'must be equal to one of the allowed values'
  const validationErrorsText = await page.textContent('#validation-errors')
  expect(validationErrorsText).toContain(expectedText)
})
