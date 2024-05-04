import { test, expect } from '@playwright/test'

test('file upload fails if already uploaded', async ({ page }) => {
  // hardcoded waits to give time for files to upload

  const fileName = 'sample.png'

  await page.goto('/')

  // upload file normally
  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-1-file', `./sample-data/png/${fileName}`)
  await page.click('button#download-1-upload')
  await page.waitForTimeout(3000)

  // upload again and expect error
  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-2-file', `./sample-data/png/${fileName}`)
  await page.click('button#download-2-upload')
  await page.waitForTimeout(3000)

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toEqual('File already exists. Rename and add again.')
    await dialog.accept()
  })
})
