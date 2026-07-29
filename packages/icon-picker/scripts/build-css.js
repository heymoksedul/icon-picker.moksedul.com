const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const cssPath = path.join(__dirname, '../dist/index.css');
const tsPath = path.join(__dirname, '../src/styles.ts');

if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');

  // 1. Remove global layer order re-declarations
  css = css.replace(/@layer\s+theme,\s*base,\s*components,\s*utilities;/g, '');
  css = css.replace(/@layer\s+properties;/g, '');

  // 2. Parse CSS using PostCSS AST
  const root = postcss.parse(css);

  root.walkRules((rule) => {
    // Skip rules inside @keyframes
    if (rule.parent && rule.parent.type === 'atrule' && rule.parent.name === 'keyframes') {
      return;
    }
    rule.selectors = rule.selectors.map((s) => {
      const trimmed = s.trim();
      if (!trimmed) return trimmed;
      if (trimmed === ':root' || trimmed === ':host' || trimmed === 'html') {
        return '.icon-picker-scope';
      }
      if (trimmed.startsWith('.icon-picker-scope')) return trimmed;
      if (trimmed.startsWith('.dark')) {
        return `.dark .icon-picker-scope ${trimmed.replace(/^\.dark\s*/, '')}`;
      }
      return `.icon-picker-scope ${trimmed}`;
    });
  });

  let outputCss = root.toString();

  // 3. Wrap entire package CSS in an isolated cascade layer
  outputCss = `@layer icon-picker-layer {\n${outputCss}\n}`;

  fs.writeFileSync(cssPath, outputCss, 'utf8');

  const tsContent = `export const cssString = ${JSON.stringify(outputCss)};\n`;
  fs.writeFileSync(tsPath, tsContent);
  console.log('✅ Safely generated src/styles.ts with PostCSS AST scoping & @layer');
} else {
  console.error('❌ dist/index.css not found');
  process.exit(1);
}
