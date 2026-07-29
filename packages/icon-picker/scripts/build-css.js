const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../dist/index.css');
const tsPath = path.join(__dirname, '../src/styles.ts');

if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  const tsContent = `export const cssString = ${JSON.stringify(css)};\n`;
  fs.writeFileSync(tsPath, tsContent);
  console.log('✅ Generated src/styles.ts from dist/index.css');
} else {
  console.error('❌ dist/index.css not found');
  process.exit(1);
}
