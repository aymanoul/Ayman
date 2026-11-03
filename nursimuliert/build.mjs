// Bundle mit esbuild nach dist/. Story-Datei: node build.mjs [pfad/zur/story.json]
import * as esbuild from 'esbuild';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';

const story = process.argv[2] || process.env.STORY || 'story/shots.json';
JSON.parse(readFileSync(story, 'utf8')); // frueh pruefen: gueltiges JSON?
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
copyFileSync(story, 'dist/story.json');
console.log('dist/ gebaut mit', story);
