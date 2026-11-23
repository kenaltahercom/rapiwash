const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const iconsDir = path.join(root, 'assets', 'icons');
const outFile = path.join(root, 'css', 'icons.css');

const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg')).sort();
const lines = ['/* Dibuat otomatis oleh tools/build-icons.js dari assets/icons/*.svg. Jangan diedit manual. */\n'];

for (const file of files) {
  const name = path.basename(file, '.svg');
  let svg = fs.readFileSync(path.join(iconsDir, file), 'utf8').trim();
  svg = svg.replace(/\s+/g, ' ').replace(/"/g, "'");
  const encoded = encodeURIComponent(svg)
    .replace(/%20/g, ' ')
    .replace(/%2F/g, '/')
    .replace(/%3A/g, ':')
    .replace(/%3D/g, '=')
    .replace(/%27/g, "'")
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2C/g, ',')
    .replace(/%2D/g, '-')
    .replace(/%2E/g, '.');
  lines.push(`.i-${name}{--i:url("data:image/svg+xml,${encoded}")}\n`);
}

fs.writeFileSync(outFile, lines.join(''), 'utf8');
console.log(`${files.length} ikon -> css/icons.css`);
