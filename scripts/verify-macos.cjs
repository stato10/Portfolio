const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const fs = require('node:fs/promises')
const path = require('node:path')
const assert = require('node:assert/strict')

async function main() {
  const output = path.resolve('.impeccable/review')
  await fs.mkdir(output, { recursive: true })
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
  const errors = []
  const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:3000/portfolio/'
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' })
  page.on('pageerror', error => errors.push(error.message))
  async function capture(name) {
    await page.locator('.boot-screen').waitFor({ state: 'detached' })
    await page.locator('.app-loading').waitFor({ state: 'detached' })
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.os-desktop')).opacity === '1' && [...document.querySelectorAll('.app-window')].every(node => getComputedStyle(node).opacity === '1'))
    await page.waitForFunction(() => [...document.images].filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().bottom > 0).every(img => img.complete), undefined, { timeout: 10000 }).catch(() => {})
    await page.evaluate(() => Promise.all([...document.images].filter(img => img.complete).map(img => img.decode().catch(() => {}))))
    await page.screenshot({ path: path.join(output, `${name}.png`), animations: 'disabled' })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name}: viewport overflow`)
  }
  await page.goto(base)
  await page.getByRole('heading', { name: 'Make yourself at home.' }).waitFor()
  await capture('desktop')
  await page.getByRole('button', { name: 'Close Welcome', exact: true }).click()
  await page.getByRole('button', { name: 'Help', exact: true }).click()
  await page.getByRole('heading', { name: 'Make yourself at home.' }).waitFor()
  await page.getByRole('button', { name: 'Explore projects', exact: true }).click()
  await page.getByRole('button', { name: 'Show desktop', exact: true }).click()
  await page.locator('[data-app="projects"]').waitFor({ state: 'detached' })
  await page.getByRole('button', { name: 'Restore Projects', exact: true }).click()
  await page.getByRole('textbox', { name: 'Search Projects', exact: true }).fill('Prisma')
  assert.equal(await page.locator('.portfolio-item').count(), 1)
  await page.getByRole('textbox', { name: 'Search Projects', exact: true }).fill('not-a-project')
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click()
  assert.equal(await page.locator('.portfolio-item').count(), 6)
  for (const route of ['projects', 'ai-lab', 'systems', 'resume', 'about', 'contact', 'terminal', 'projects/solar-intelligence']) {
    await page.goto(base + route)
    await page.locator('.app-window').waitFor()
    await capture(route.replaceAll('/', '-'))
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(base)
  await page.getByRole('heading', { name: 'Avraham’s desktop.' }).waitFor()
  await capture('mobile')
  await page.getByRole('button', { name: 'Explore my work', exact: true }).click()
  await page.getByRole('heading', { name: 'Projects', exact: true }).waitFor()
  await capture('mobile-projects')
  await page.getByRole('button', { name: 'Open FlightAI', exact: true }).click()
  await page.getByRole('heading', { name: 'FlightAI', exact: true }).waitFor()
  await capture('mobile-case')
  assert.deepEqual(errors, [], 'Browser runtime errors')
  console.log('PASS: welcome, restore, search, reset, routes, mobile navigation, project opening, runtime errors and viewport overflow. Screenshots:', output)
  } finally {
    await browser.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
