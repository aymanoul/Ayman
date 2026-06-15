import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:4173/#/modul/muhammad/siegel/daniel', { waitUntil: 'load' })
await p.waitForTimeout(2500)

await p.screenshot({ path: '/tmp/d-top.png' })

await p.evaluate(() => document.querySelector('.statue')?.scrollIntoView({ block: 'center' }))
await p.waitForTimeout(800)
await p.screenshot({ path: '/tmp/d-statue.png' })

// Quran modal
await p.evaluate(() => document.querySelector('.beleg-card--quran')?.scrollIntoView({ block: 'center' }))
await p.waitForTimeout(500)
await p.click('.beleg-card--quran')
await p.waitForTimeout(1000)
await p.screenshot({ path: '/tmp/d-quran.png' })
await p.keyboard.press('Escape')
await p.waitForTimeout(450)

// Bible modal
const bibel = await p.$$('.beleg-card--bibel')
if (bibel[0]) {
  await bibel[0].scrollIntoViewIfNeeded()
  await bibel[0].click()
  await p.waitForTimeout(900)
  await p.screenshot({ path: '/tmp/d-bibel.png' })
  await p.keyboard.press('Escape')
  await p.waitForTimeout(450)
}

// Source modal
const quelle = await p.$('.beleg-card--quelle')
if (quelle) {
  await quelle.scrollIntoViewIfNeeded()
  await quelle.click()
  await p.waitForTimeout(800)
  await p.screenshot({ path: '/tmp/d-quelle.png' })
  await p.keyboard.press('Escape')
  await p.waitForTimeout(450)
}

// Stone strike
await p.evaluate(() => document.querySelector('.statue')?.scrollIntoView({ block: 'center' }))
await p.waitForTimeout(500)
await p.click('.statue__play')
await p.waitForTimeout(2300)
await p.screenshot({ path: '/tmp/d-struck.png' })

await b.close()
console.log('ok')
