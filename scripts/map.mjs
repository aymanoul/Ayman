import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN, args:['--no-sandbox','--disable-dev-shm-usage'] })
const p = await b.newPage({ viewport:{width:1100,height:760}, deviceScaleFactor:2 })
await p.goto('http://localhost:4173/#/modul/muhammad/siegel/daniel', { waitUntil:'load' })
await p.waitForTimeout(2000)
await p.evaluate(()=>document.querySelector('.map')?.scrollIntoView({block:'center'}))
await p.waitForTimeout(1200)
await p.screenshot({ path:'/tmp/map.png' })
await b.close(); console.log('ok')
