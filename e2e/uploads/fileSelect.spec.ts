import { test, expect } from '@playwright/test'

test('can select file, and output is rendered correctly', async ({ page }) => {
  await page.goto('/')

  await page.click('text=Add Download')

  await page.click('text=Local File')

  await page.setInputFiles('input#download-1-file', './sample-data/png/sample.png')

  const browserName = page.context().browser()?.browserType().name()
  await page.screenshot({
    path: `playwright-screenshots/download-with-file-selected_${browserName}.png`,
  })

  // assert details about file are in rendered distribution option
  const downloadOutput = await page.textContent('#download-1-output pre')
  expect(downloadOutput).toContain(`"href": ""`)
  expect(downloadOutput).toContain(
    '"href": "https://www.iana.org/assignments/media-types/image/png"'
  )
  expect(downloadOutput).toContain('"magnitude": 3843')
})
