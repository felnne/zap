import { test, expect } from '@playwright/test'

test('supported file types are handled correctly', async ({ page }) => {
  await page.goto('/')

  // GoePackages
  //

  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-1-file', './sample-data/gpkg/sample.gpkg')
  const download1 = await page.textContent('#downloads-output pre')
  expect(download1).toContain(
    '"href": "https://www.iana.org/assignments/media-types/application/geopackage+sqlite3"'
  )

  // GeoPackages (Zipped)
  //

  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-2-file', './sample-data/gpkg_zip/sample.gpkg.zip')
  const download2 = await page.textContent('#downloads-output pre')
  expect(download2).toContain(
    '"href": "https://metadata-resources.data.bas.ac.uk/media-types/application/geopackage+sqlite3+zip"'
  )

  // JPEGs
  //

  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-3-file', './sample-data/jpeg/sample.jpg')
  const download3 = await page.textContent('#downloads-output pre')
  expect(download3).toContain('"href": "https://jpeg.org/jpeg/"')

  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-4-file', './sample-data/jpeg/sample.jpeg')
  const download4 = await page.textContent('#downloads-output pre')
  expect(download4).toContain('"href": "https://jpeg.org/jpeg/"')

  // PNGs
  //

  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-5-file', './sample-data/png/sample.png')
  const download5 = await page.textContent('#downloads-output pre')
  expect(download5).toContain('"href": "https://www.iana.org/assignments/media-types/image/png"')

  // PDFs
  // disabled as remote lookup is too unreliable for testing
  //
  // await page.click('text=Add Download')
  // await page.click('text=Local File')
  // await page.setInputFiles('input#download-6-file', './sample-data/pdf/sample.pdf')
  // await page.waitForLoadState('networkidle') // wait for any pending network requests to complete
  // const download6 = await page.textContent('#downloads-output pre')
  // expect(download6).toContain(
  //   '"href": "https://www.iana.org/assignments/media-types/application/pdf"'
  // )

  // PDFs (geo-referenced)
  // disabled as remote lookup is too unreliable for testing
  //
  // await page.click('text=Add Download')
  // await page.click('text=Local File')
  // await page.setInputFiles('input#download-7-file', './sample-data/pdf_geo/sample.pdf')
  // await page.waitForLoadState('networkidle') // wait for any pending network requests to complete
  // const download7 = await page.textContent('#downloads-output pre')
  // expect(download7).toContain(
  //   '"href": "https://metadata-resources.data.bas.ac.uk/media-types/application/pdf+geo"'
  // )

  // Shapefiles (Zipped)
  //

  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-6-file', './sample-data/shp_zip/sample.shp.zip')
  const download6 = await page.textContent('#downloads-output pre')
  expect(download6).toContain(
    '"href": "https://metadata-resources.data.bas.ac.uk/media-types/application/shapefile+zip"'
  )

  // GeoJSON (.geojson)
  //

  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-6-file', './sample-data/geojson/sample.geojson')
  const download7 = await page.textContent('#downloads-output pre')
  expect(download7).toContain(
    '"href": "https://www.iana.org/assignments/media-types/application/geo+json"'
  )

  // GeoJSON (.json)
  //

  await page.click('text=Add Download')
  await page.click('text=Local File')
  await page.setInputFiles('input#download-6-file', './sample-data/geojson/sample.json')
  const download8 = await page.textContent('#downloads-output pre')
  expect(download8).toContain(
    '"href": "https://www.iana.org/assignments/media-types/application/geo+json"'
  )
})
