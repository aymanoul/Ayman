import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:4173/'
const out = process.argv[3] || 'shot.png'
const w = parseInt(process.argv[4] || '1440', 10)
const h = parseInt(process.argv[5] || '900', 10)
const full = process.argv[6] === 'full'

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || undefined,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})
const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'load' })
await page.waitForTimeout(3200) // let webfonts + the load sequence settle
await page.screenshot({ path: out, fullPage: full })
await browser.close()
console.log('shot →', out)
