import { test, expect } from '@playwright/test';

test('can select file and output is rendered correctly', async ({ page }) => {
  await page.goto('/');

  await page.click('text=Add Download');

  await page.setInputFiles('input#download-1-input', './sample-data/png/sample.png');

  await page.screenshot({ path: 'playwright-screenshots/download-with-file-selected.png' });

  // assert details about file are in rendered distribution option
  const downloadOutput = await page.textContent('#download-1-output pre');
  expect(downloadOutput).toContain('"href": "https://www.iana.org/assignments/media-types/image/png"');
  expect(downloadOutput).toContain('"magnitude": 3843');
})

test('supported file types are handled correctly', async ({ page }) => {
  await page.goto('/');

  // GoePackages
  //

  await page.click('text=Add Download');
  await page.setInputFiles('input#download-1-input', './sample-data/gpkg/sample.gpkg');
  const download1 = await page.textContent('#download-1-output pre');
  expect(download1).toContain('"href": "https://www.iana.org/assignments/media-types/application/geopackage+sqlite3"');

  // JPEGs
  //

  await page.click('text=Add Download');
  await page.setInputFiles('input#download-2-input', './sample-data/jpeg/sample.jpg');
  const download2 = await page.textContent('#download-2-output pre');
  expect(download2).toContain('"href": "https://jpeg.org/jpeg/"');

  await page.click('text=Add Download');
  await page.setInputFiles('input#download-3-input', './sample-data/jpeg/sample.jpeg');
  const download3 = await page.textContent('#download-3-output pre');
  expect(download3).toContain('"href": "https://jpeg.org/jpeg/"');

  // PNGs
  //

  await page.click('text=Add Download');
  await page.setInputFiles('input#download-4-input', './sample-data/png/sample.png');
  const download4 = await page.textContent('#download-4-output pre');
  expect(download4).toContain('"href": "https://www.iana.org/assignments/media-types/image/png"');

  // PDFs
  //

  await page.click('text=Add Download');
  await page.setInputFiles('input#download-5-input', './sample-data/pdf/sample.pdf');
  const download5 = await page.textContent('#download-5-output pre');
  expect(download5).toContain('"href": "https://www.iana.org/assignments/media-types/application/pdf"');
})
