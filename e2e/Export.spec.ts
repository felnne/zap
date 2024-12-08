import { test, expect } from '@playwright/test'

test('can copy value to clipboard', async ({ page, browserName }) => {
  await page.goto('/')

  // // click the button with id 'export-use-current'
  // await page.click('#export-use-current')

  // expect file to be downloaded with a filename starting with 'zap-record'
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('#export-use-current'),
  ])
  expect(download.suggestedFilename()).toContain('zap-record')
})
