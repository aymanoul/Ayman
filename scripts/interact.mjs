import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const p = await b.newPage({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:4173/', { waitUntil: 'load' })
await p.waitForTimeout(2800)
// hover the first (open) module plate to capture ignite + lift
await p.hover('.plate--open')
await p.waitForTimeout(900)
await p.screenshot({ path: '/tmp/v2-hover.png' })
await b.close()
console.log('ok')
