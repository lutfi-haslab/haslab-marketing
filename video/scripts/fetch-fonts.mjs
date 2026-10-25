// Downloads latin woff2 subsets of Plus Jakarta Sans + JetBrains Mono into public/fonts.
// Usage: node scripts/fetch-fonts.mjs
import {writeFileSync, existsSync} from 'node:fs';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const OUT = new URL('../public/fonts/', import.meta.url).pathname;

const WANT = [
  {family: 'Plus Jakarta Sans', weights: [400, 500, 700, 800], file: 'PJS'},
  {family: 'JetBrains Mono', weights: [400, 700], file: 'JBM'},
];

async function grab(family, weights, prefix) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@${weights.join(';')}&display=block`;
  const css = await (await fetch(cssUrl, {headers: {'User-Agent': UA}})).text();
  // Blocks look like: /* latin */ @font-face { ... font-weight: 400; ... src: url(...woff2) ... }
  const blocks = css.split('@font-face').slice(1);
  let count = 0;
  for (const w of weights) {
    // find the latin block for this weight
    const candidates = blocks.filter((b) => b.includes(`font-weight: ${w}`));
    const latin = candidates.find((b) => b.includes('U+0000-00FF')) || candidates[candidates.length - 1];
    if (!latin) throw new Error(`no face for ${family} ${w}`);
    const url = latin.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
    if (!url) throw new Error(`no url for ${family} ${w}`);
    const buf = Buffer.from(await (await fetch(url, {headers: {'User-Agent': UA}})).arrayBuffer());
    const file = `${OUT}${prefix}-${w}.woff2`;
    writeFileSync(file, buf);
    console.log('saved', file, buf.length, 'bytes');
    count++;
  }
  return count;
}

let total = 0;
for (const f of WANT) total += await grab(f.family, f.weights, f.file);
console.log('DONE', total, 'font files');
