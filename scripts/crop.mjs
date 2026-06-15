import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const p = await b.newPage({ viewport: { width: 900, height: 600 }, deviceScaleFactor: 3 })
await p.goto('http://localhost:4173/', { waitUntil: 'load' })
await p.waitForTimeout(3500)
await p.screenshot({ path: '/tmp/emblem.png', clip: { x: 358, y: 4, width: 184, height: 150 } })
await b.close()
console.log('ok')
