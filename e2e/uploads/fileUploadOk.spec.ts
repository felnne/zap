import { test, expect } from '@playwright/test'

test('file upload works', async ({ page }) => {
  const fileName = 'sample.png'

  await page.goto('/')

  await page.click('text=Add Download')

  await page.click('text=Local File')

  await page.setInputFiles('input#download-1-file', `./sample-data/png/${fileName}`)

  await page.click('text=Upload')

  // wait for 3 seconds - workaround for not having an event or state to check that the file has been uploaded
  await page.waitForTimeout(3000)

  const url = await page.inputValue('input#download-1-url')

  // take screenshot of input#download-1-url
  const browserName = page.context().browser()?.browserType().name()
  await page.screenshot({
    path: `playwright-screenshots/download-with-file-uploaded_${browserName}.png`,
  })

  expect(url).toContain(fileName)
})
