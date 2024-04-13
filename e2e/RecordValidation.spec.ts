import { test, expect } from '@playwright/test'

test('a pasted minimal, valid, record validates', async ({ page }) => {
  const minimalValidRecord = {
    $schema:
      'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json',
    hierarchy_level: 'dataset',
    metadata: {
      language: 'eng',
      character_set: 'utf8',
      contacts: [
        {
          organisation: {
            name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
            href: 'https://ror.org/01rhff309',
            title: 'ror',
          },
          role: ['pointOfContact'],
        },
      ],
      date_stamp: '2024-04-07',
    },
    identification: {
      title: {
        value: 'x',
      },
      dates: {
        publication: '2024-04-06',
      },
      abstract: 'xx',
      language: 'eng',
      character_set: 'utf8',
      topics: ['society'],
      extents: [
        {
          identifier: 'bounding',
          geographic: {
            bounding_box: {
              west_longitude: -180,
              east_longitude: 180,
              south_latitude: -90,
              north_latitude: -60,
            },
          },
        },
      ],
    },
  }
  const minimalValidRecordString = JSON.stringify(minimalValidRecord, null, 2)

  await page.goto('/')

  // paste the minimal record into the textarea with the id 'validation-input'
  await page.fill('textarea#validation-input', minimalValidRecordString)

  // element with id 'validation-message' says '😀 Record is valid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😀 Record is valid.')
})

test('a pasted minimal, invalid, record does not validate', async ({ page }) => {
  const incompleteRecord = {
    $schema:
      'https://metadata-standards.data.bas.ac.uk/bas-metadata-generator-configuration-schemas/v2/iso-19115-2-v3.json',
    metadata: {
      language: 'eng',
      character_set: 'utf8',
      contacts: [
        {
          organisation: {
            name: 'Mapping and Geographic Information Centre, British Antarctic Survey',
            href: 'https://ror.org/01rhff309',
            title: 'ror',
          },
          role: ['pointOfContact'],
        },
      ],
      date_stamp: '2024-04-07',
    },
  }
  const incompleteRecordString = JSON.stringify(incompleteRecord, null, 2)

  await page.goto('/')

  // paste the incomplete record into the textarea with the id 'validation-input'
  await page.fill('textarea#validation-input', incompleteRecordString)

  // element with id 'validation-message' says '😀 Record is valid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😩 Record is invalid.')

  // element with id 'validation-errors' contains an expected error message
  const expectedText = '"must have required property \'hierarchy_level\'"'
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

test('a minimal record drawn together from filled in sections validates', async ({ page }) => {
  await page.goto('/')

  // set element with id 'title-input' to 'x'
  await page.fill('textarea#title-input', 'x')

  // set element with id 'abstract-input' to 'xx'
  await page.fill('textarea#abstract-input', 'xx')

  // check element with id 'topic-living_and_working_in_antarctica'
  await page.check('input#topic-living_and_working_in_antarctica')

  // click the button with id 'validation-use-current'
  await page.click('button#validation-use-current')

  // element with id 'validation-message' says '😀 Record is valid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😀 Record is valid.')
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

  // element with id 'validation-message' says '😩 Record is invalid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😩 Record is invalid.')
})
