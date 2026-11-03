// Planungshilfe: node tools/anchors.mjs <t> anker1 anker2 ...  (Server muss laufen: npm run serve)
import { chromium } from 'playwright';
const [t, ...specs] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('http://localhost:8080/index.html');
await p.waitForFunction(() => window.ready || window.initError);
console.log(JSON.stringify(await p.evaluate(([tt, s]) => window.anchorAt(tt, s), [Number(t), specs])));
await b.close();
