import { test, expect } from '@playwright/test'

test('can select file, and output is rendered correctly', async ({ page }) => {
  await page.goto('/')

  await page.click('text=Add Download')

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

test('supported file types are handled correctly', async ({ page }) => {
  await page.goto('/')

  // GoePackages
  //

  await page.click('text=Add Download')
  await page.setInputFiles('input#download-1-file', './sample-data/gpkg/sample.gpkg')
  const download1 = await page.textContent('#download-1-output pre')
  expect(download1).toContain(
    '"href": "https://www.iana.org/assignments/media-types/application/geopackage+sqlite3"'
  )

  // JPEGs
  //

  await page.click('text=Add Download')
  await page.setInputFiles('input#download-2-file', './sample-data/jpeg/sample.jpg')
  const download2 = await page.textContent('#download-2-output pre')
  expect(download2).toContain('"href": "https://jpeg.org/jpeg/"')

  await page.click('text=Add Download')
  await page.setInputFiles('input#download-3-file', './sample-data/jpeg/sample.jpeg')
  const download3 = await page.textContent('#download-3-output pre')
  expect(download3).toContain('"href": "https://jpeg.org/jpeg/"')

  // PNGs
  //

  await page.click('text=Add Download')
  await page.setInputFiles('input#download-4-file', './sample-data/png/sample.png')
  const download4 = await page.textContent('#download-4-output pre')
  expect(download4).toContain('"href": "https://www.iana.org/assignments/media-types/image/png"')

  // PDFs
  //

  await page.click('text=Add Download')
  await page.setInputFiles('input#download-5-file', './sample-data/pdf/sample.pdf')
  const download5 = await page.textContent('#download-5-output pre')
  expect(download5).toContain(
    '"href": "https://www.iana.org/assignments/media-types/application/pdf"'
  )

  // Shapefiles (Zipped)
  //

  await page.click('text=Add Download')
  await page.setInputFiles('input#download-6-file', './sample-data/shp_zip/sample.shp.zip')
  const download6 = await page.textContent('#download-6-output pre')
  expect(download6).toContain(
    '"href": "https://metadata-standards.data.bas.ac.uk/media-types/application/shapefile+zip"'
  )

  // GeoPackages (Zipped)
  //

  await page.click('text=Add Download')
  await page.setInputFiles('input#download-7-file', './sample-data/gpkg_zip/sample.gpkg.zip')
  const download7 = await page.textContent('#download-7-output pre')
  expect(download7).toContain(
    '"href": "https://metadata-standards.data.bas.ac.uk/media-types/application/geopackage+sqlite3+zip"'
  )
})

test('unsupported file types are rejected correctly', async ({ page }) => {
  await page.goto('/')

  await page.click('text=Add Download')

  await page.setInputFiles('input#download-1-file', './sample-data/invalid/sample.x')

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toEqual("File format for 'sample.x' is not supported, rejecting.")
    await dialog.accept()
  })

  const element = await page.$('#download-1-output pre')
  expect(element).toBeNull()
})

test('file upload works', async ({ page }) => {
  const fileName = 'sample.png'

  await page.goto('/')

  await page.click('text=Add Download')

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

test('file upload fails if already uploaded', async ({ page }) => {
  // hardcoded waits to give time for files to upload

  const fileName = 'sample.png'

  await page.goto('/')

  // upload file normally
  await page.click('text=Add Download')
  await page.setInputFiles('input#download-1-file', `./sample-data/png/${fileName}`)
  await page.click('button#download-1-upload')
  await page.waitForTimeout(3000)

  // upload again and expect error
  await page.click('text=Add Download')
  await page.setInputFiles('input#download-2-file', `./sample-data/png/${fileName}`)
  await page.click('button#download-2-upload')
  await page.waitForTimeout(3000)

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toEqual('File already exists. Rename and add again.')
    await dialog.accept()
  })
})
