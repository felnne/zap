import { test, expect } from '@playwright/test'

test('SAN path stat fails with unknown file', async ({ page }) => {
  const path = '/data/unknown.txt'

  await page.goto('/')

  await page.click('text=Add Download')

  await page.click('text=BAS SAN')

  await page.fill('input#download-1-path', path)

  // within an element #download-1 click the button with text 'Set'
  await page.click('#download-1 >> text="Set"')

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toEqual(
      'SAN file could not be accessed. Check path and/or permissions.'
    )
    await dialog.accept()
  })

  expect(await page.inputValue('input#download-1-path')).toEqual('')
})
