import { test, expect } from '@playwright/test'

import { minimalRecordAsText } from '../src/lib/__tests__/_validation_data'

test('a pasted minimal, valid, record validates', async ({ page }) => {
  await page.goto('/')

  // paste the minimal record into the textarea with the id 'validation-input'
  await page.fill('textarea#validation-input', minimalRecordAsText)

  // element with id 'validation-message' says '😀 Record is valid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😀 Record is valid.')
})

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

test('invalid JSON does not validate', async ({ page }) => {
  await page.goto('/')

  // paste invalid record into the textarea with the id 'validation-input'
  await page.fill('textarea#validation-input', '//invalid//')

  // element with id 'validation-message' says '😕 Record cannot be understood (invalid format).'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😕 Record cannot be understood (invalid format).')
})

test('a record drawn together from filled in sections validates', async ({ page }) => {
  await page.goto('/')

  // file identifier has a default/auto-generated value

  // resource type has a default/auto-generated value

  // identifiers has a default/auto-generated value

  // edition has a default/auto-generated value

  // set element with id 'title-input' to 'x'
  await page.fill('textarea#title-input', 'x')

  // set element with id 'abstract-input' to 'xx'
  await page.fill('textarea#abstract-input', 'xx')

  // dates has a default/auto-generated value

  // spatial extent has a default/auto-generated value

  // check element with id 'individual-https_orcid_org_0000_0003_1410_9122'
  await page.check('input#individual-https_orcid_org_0000_0003_1410_9122')

  // access restrictions has a default/auto-generated value

  // licence has a default/auto-generated value

  // check element with id 'topic-living_and_working_in_antarctica'
  await page.check('input#topic-living_and_working_in_antarctica')

  // set element with id 'citation-input' to 'xxx'
  await page.fill('textarea#citation-input', 'xxx')

  // click the button with text 'Add Download'
  await page.click('text=Add Download')
  await page.setInputFiles('input#download-1-file', './sample-data/gpkg/sample.gpkg')
  await page.click('text=Upload')

  // check element with id 'service-wms-selection'
  await page.check('input#service-wms-selection')
  // set element with id 'service-wms-endpoint' to 'https://example.com'
  await page.fill('input#service-wms-endpoint', 'https://example.com')

  // set element with id 'lineage-input' to 'xxxx'
  await page.fill('textarea#lineage-input', 'xxxx')

  // click the button with text 'Validate Current Record'
  await page.click('text=Validate Current Record')

  let validationStatusText
  try {
    validationStatusText = await page.textContent('#validation-message')
    expect(validationStatusText).toBe('😀 Record is valid.')
  } catch (error) {
    const validationErrorsText = await page.textContent('#validation-errors')
    console.log(validationErrorsText)
    // Re-throw the error to ensure the test fails
    throw error
  }
})

test('an incomplete record drawn together from filled in sections does not validate', async ({
  page,
}) => {
  await page.goto('/')

  // set element with id 'title-input' to 'x'
  await page.fill('textarea#title-input', 'x')

  // set element with id 'abstract-input' to 'xx'
  await page.fill('textarea#abstract-input', 'xx')

  // DON'T CHECK element with id 'topic-living_and_working_in_antarctica'

  // click the button with id 'validation-use-current'
  await page.click('button#validation-use-current')

  // element with id 'validation-message' says '😩 Record is invalid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😩 Record is invalid.')
})
