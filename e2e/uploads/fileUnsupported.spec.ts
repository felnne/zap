import { test, expect } from '@playwright/test'

test('unsupported file types are rejected correctly', async ({ page }) => {
  await page.goto('/')

  await page.click('text=Add Download')

  await page.click('text=Local File')

  await page.setInputFiles('input#download-1-file', './sample-data/invalid/sample.x')

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toEqual("File format for 'sample.x' is not supported, rejecting.")
    await dialog.accept()
  })

  const element = await page.$('#downloads-output pre')
  expect(element).toBeNull()
})
