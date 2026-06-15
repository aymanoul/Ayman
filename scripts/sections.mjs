import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const p = await b.newPage({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:4173/#/modul/muhammad/siegel/daniel', { waitUntil: 'load' })
await p.waitForTimeout(2200)
async function shot(sel, path) {
  await p.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel)
  await p.waitForTimeout(900)
  await p.screenshot({ path })
}
await shot('.belege-grid', '/tmp/d-belege.png')
await shot('.timeline', '/tmp/d-timeline.png')
await shot('.konter-list', '/tmp/d-konter.png')
await b.close()
console.log('ok')
