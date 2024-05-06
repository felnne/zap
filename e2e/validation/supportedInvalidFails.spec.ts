import { test, expect } from '@playwright/test'

test('an incomplete record drawn together from filled in sections does not validate', async ({
  page,
}) => {
  await page.goto('/')

  // set element with id 'title-input' to 'x'
  await page.fill('textarea#title-input', 'x')

  // set element with id 'abstract-input' to 'xx'
  await page.fill('textarea#abstract-input', 'xx')

  // DON'T CHECK element with id 'topic-living_and_working_in_antarctica'

  // Additional properties aren't set as it's not needed to test validation failure

  // click the button with id 'validation-use-current'
  await page.click('button#validation-use-current')

  // element with id 'validation-message' says '😩 Record is invalid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😩 Record is invalid.')
})
