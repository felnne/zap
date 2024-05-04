import { test, expect } from '@playwright/test'

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

  await page.click('text=Add Download')
  await page.click('text=Local File')
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
