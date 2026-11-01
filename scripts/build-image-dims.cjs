// Rebuilds lib/image-dims.ts from the actual files on disk (single source of truth).
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  const files = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (/\.(webp|png|jpg|jpeg|gif)$/i.test(f)) files.push(p);
    }
  })('public/images');

  const entries = [];
  for (const p of files) {
    try {
      const m = await sharp(p).metadata();
      const site = '/' + p.split(path.sep).join('/').replace(/^public\//, '');
      entries.push(`  "${site}": [${m.width}, ${m.height}],`);
    } catch { }
  }
  const out = `// Generated — natural pixel dimensions for every asset in public/images.
// Used to size <img> tags (width/height attrs prevent CLS). Regenerate by scanning public/images.
export const IMAGE_DIMS: Record<string, readonly [number, number]> = {
${entries.join('\n')}
};
`;
  fs.writeFileSync('lib/image-dims.ts', out);
  console.log('image-dims rebuilt:', entries.length, 'entries');
})();
