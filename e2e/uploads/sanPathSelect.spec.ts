import { test, expect } from '@playwright/test'

test('can enter a SAN path and output is rendered correctly', async ({ page }) => {
  await page.goto('/')

  await page.click('text=Add Download')

  await page.click('text=BAS SAN')

  await page.fill('input#download-1-path', '/data/somewhere/image.png')

  const browserName = page.context().browser()?.browserType().name()
  await page.screenshot({
    path: `playwright-screenshots/download-with-san-path-set_${browserName}.png`,
  })

  // assert details about path are in rendered distribution option
  const downloadOutput = await page.textContent('#download-1-output pre')
  expect(downloadOutput).toContain(`"href": ""`)
  expect(downloadOutput).toContain(
    '"href": "https://www.iana.org/assignments/media-types/image/png"'
  )
})
