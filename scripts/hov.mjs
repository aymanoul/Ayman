import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN, args:['--no-sandbox','--disable-dev-shm-usage'] })
const p = await b.newPage({ viewport:{width:1180,height:900}, deviceScaleFactor:2 })
await p.goto('http://localhost:4173/#/modul/muhammad/siegel/daniel', { waitUntil:'load' })
await p.waitForTimeout(2200)
await p.evaluate(()=>document.querySelector('.statue')?.scrollIntoView({block:'center'}))
await p.waitForTimeout(600)
// hover the gold (head) hotspot
const hot = await p.$$('.statue__hot')
if (hot[0]) { const box = await hot[0].boundingBox(); await p.mouse.move(box.x+box.width/2, box.y+box.height/2); }
await p.waitForTimeout(500)
await p.screenshot({ path:'/tmp/st-hover.png' })
await b.close(); console.log('ok')
