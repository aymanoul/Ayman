// Bundle mit esbuild nach dist/. Story: node build.mjs [pfad/zur/story.json]
// Die Zeiten kommen aus der Stimme (audio/transkript.json), sonst aus einem
// geschaetzten ENTWURF (nur fuer Vorschauen, im Bild markiert).
import * as esbuild from 'esbuild';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { loadTranscript, resolveStory } from './tools/zeitplan.mjs';

const storyFile = process.argv.slice(2).find((a) => !a.startsWith('--')) || process.env.STORY || 'story/shots.json';
const story = JSON.parse(readFileSync(storyFile, 'utf8'));
const transcript = loadTranscript(story);
const resolved = resolveStory(story, transcript);
mkdirSync('dist', { recursive: true });
await esbuild.build({
  entryPoints: { main: 'src/main.js' }, bundle: true, outdir: 'dist', format: 'iife', target: 'chrome120',
  minify: false, sourcemap: false, logLevel: 'warning',
});
await esbuild.build({
  entryPoints: { main: 'src/style.css' }, bundle: true, outdir: 'dist',
  loader: { '.woff2': 'file', '.woff': 'file' }, assetNames: 'fonts/[name]', logLevel: 'warning',
});
copyFileSync('src/index.html', 'dist/index.html');
writeFileSync('dist/story.json', JSON.stringify(resolved));
const T = resolved.timing;
console.log(`dist/ gebaut mit ${storyFile} | Zeiten: ${T.draft ? 'ENTWURF (geschaetzt, keine Stimme)' : 'audio/transkript.json'} | Dauer ${T.duration.toFixed(2)} s`);
if (process.argv.includes('--zeiten')) {
  for (const s of resolved.shots) console.log(`  Einstellung ${String(s.id).padStart(2)}  ${s.start.toFixed(2).padStart(6)} - ${s.end.toFixed(2).padStart(6)}  (${s.dur.toFixed(2)} s)  Satz ${s.sentence ?? '-'}`);
  for (const c of resolved.counters) console.log(`  Zaehler ${c.line4}: sichtbar ab ${c.visibleFrom.toFixed(2)}, zaehlt ${c.countStart.toFixed(2)} -> 0:00 bei ${c.countEnd.toFixed(2)}`);
}
