import { test, expect } from '@playwright/test'

test('can sign in to AGOL', async ({ page, browserName }) => {
  // skip all other browsers as this this is browser agnostic
  if (browserName !== 'chromium') {
    test.skip()
  }

  const agolOrg = 'bas'
  const AGOL_USERNAME = process.env.TEST_AGOL_USERNAME
  const AGOL_PASSWORD = process.env.TEST_AGOL_PASSWORD

  await page.goto('/')

  // click link with id #external-sign-in-agol
  await page.click('#external-sign-in-agol')

  // click element with 'Your ArcGIS organization's URL' text
  await page.click("text=Your ArcGIS organization's URL")
  // set organisation url
  await page.fill('input#orgKey', agolOrg)
  // click button with text 'Continue'
  await page.click('text=Continue')

  // fill field with id '#user_username'
  await page.fill('#user_username', AGOL_USERNAME!)
  // fill field with id '#user_password'
  await page.fill('#user_password', AGOL_PASSWORD!)
  // click button with id '#signIn'
  await page.click('#signIn')

  // expect `external-token-agol pre` to contain username
  const tokenText = await page.textContent('div#external-token-agol pre')
  expect(tokenText).toContain(AGOL_USERNAME)
})
