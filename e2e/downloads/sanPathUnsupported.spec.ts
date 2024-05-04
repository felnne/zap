import { test, expect } from '@playwright/test'

test('unsupported file types are rejected correctly', async ({ page }) => {
  await page.goto('/')

  await page.click('text=Add Download')

  await page.click('text=BAS SAN')

  await page.fill('input#download-1-path', '/data/somewhere/sample.x')

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toEqual("File format for 'sample.x' is not supported, rejecting.")
    await dialog.accept()
  })

  expect(await page.inputValue('input#download-1-path')).toEqual('')

  const element = await page.$('#download-1-output pre')
  expect(element).toBeNull()
})
