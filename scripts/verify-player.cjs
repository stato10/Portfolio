const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const assert = require('node:assert/strict')

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      await page.goto(`${process.env.PORTFOLIO_URL || 'http://127.0.0.1:3000/portfolio/'}welcome`)
      await page.getByRole('button', { name: /Watch the cinematic reel/ }).click()
      const video = page.locator('.cinematic-stage video')
      await page.waitForFunction(() => {
        const film = document.querySelector('.cinematic-stage video')
        return film && !film.paused && film.currentTime > 0.1
      })
      await page.getByRole('button', { name: 'Pause film', exact: true }).click()
      assert.equal(await video.evaluate(film => film.paused), true)
      await page.getByRole('button', { name: 'Mute film sound', exact: true }).click()
      assert.equal(await video.evaluate(film => film.muted), true)
      await page.getByRole('button', { name: 'Turn film sound on', exact: true }).click()
      assert.equal(await video.evaluate(film => film.muted), false)
      const seek = page.getByRole('slider', { name: 'Seek film' })
      await seek.click({ position: { x: 5, y: 7 } })
      await seek.press('Home')
      await seek.press('ArrowRight')
      assert.ok(await video.evaluate(film => film.currentTime < 1))
      await page.getByRole('button', { name: 'Play film', exact: true }).click()
      await page.getByRole('button', { name: 'Replay film', exact: true }).waitFor()
      await page.getByRole('button', { name: 'Replay film', exact: true }).click()
      await page.getByRole('button', { name: 'Pause film', exact: true }).waitFor()
      await page.getByRole('button', { name: 'Close cinematic player', exact: true }).click()
      assert.equal(await video.evaluate(film => film.paused), true)
      await page.getByRole('button', { name: /Watch the cinematic reel/ }).click()
      await page.getByRole('dialog', { name: 'STATO cinematic motion study' }).waitFor()
      await page.keyboard.press('Escape')
      await page.getByRole('dialog', { name: 'STATO cinematic motion study' }).waitFor({ state: 'detached' })
      assert.equal(await video.evaluate(film => film.paused), true)
      assert.deepEqual(errors, [])
      console.log(`PASS ${viewport.width}x${viewport.height}: playback, pause, sound, seek, replay, close and Escape`)
      await page.close()
    }
  } finally {
    await browser.close()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
