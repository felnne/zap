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

  // set element with id 'title' to 'x'
  await page.fill('textarea#title', 'x')

  // set element with id 'abstract' to 'xx'
  await page.fill('textarea#abstract', 'xx')

  // check element with id 'topic-living_and_working_in_antarctica'
  await page.check('input#topic-living_and_working_in_antarctica')

  // click the button with id 'validation-use-current'
  await page.click('button#validation-use-current')

  // element with id 'validation-message' says '😀 Record is valid.'
  const validationStatusText = await page.textContent('#validation-message')
  expect(validationStatusText).toBe('😀 Record is valid.')
})
