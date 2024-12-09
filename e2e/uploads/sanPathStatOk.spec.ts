import { test, expect } from '@playwright/test'

test('SAN path stat works', async ({ page }) => {
  const path = '/data/web/external/legacy.bas.ac.uk/htdocs/personal_details_form_may_2015.pdf'

  await page.goto('/')

  await page.click('text=Add Download')

  await page.click('text=BAS SAN')

  await page.fill('input#download-1-path', path)

  // within an element #download-1 click the button with text 'Set'
  await page.click('#download-1 >> text="Set"')

  // wait for button with id download-1-stat to have text 'OK'
  await page.waitForSelector('button#download-1-stat:has-text("OK")')

  const url = await page.inputValue('input#download-1-url')

  // take screenshot of input#download-1-url
  const browserName = page.context().browser()?.browserType().name()
  await page.screenshot({
    path: `playwright-screenshots/download-with-san-path-checked_${browserName}.png`,
  })

  expect(url).toContain(path)
})
