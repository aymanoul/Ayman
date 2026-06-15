import { chromium } from 'playwright'
const b = await chromium.launch({ executablePath: process.env.CHROME_BIN, args:['--no-sandbox','--disable-dev-shm-usage'] })
const p = await b.newPage({ viewport:{width:1180,height:920}, deviceScaleFactor:2 })
await p.goto('http://localhost:4173/#/modul/muhammad/siegel/daniel', { waitUntil:'load' })
await p.waitForTimeout(2200)
await p.evaluate(()=>document.querySelector('.statue')?.scrollIntoView({block:'center'}))
await p.waitForTimeout(700)
// outline hotspots to verify alignment
await p.addStyleTag({ content: '.statue__hot{background:rgba(201,162,39,.18)!important;box-shadow:inset 0 0 0 2px rgba(180,60,40,.85)!important}' })
await p.waitForTimeout(300)
await p.screenshot({ path:'/tmp/st-hotspots.png' })
// remove outlines
await p.addStyleTag({ content: '.statue__hot{background:transparent!important;box-shadow:none!important}' })
// click play (stone -> mountain)
await p.click('.statue__play'); await p.waitForTimeout(1300)
await p.screenshot({ path:'/tmp/st-berg.png' })
await b.close(); console.log('ok')
