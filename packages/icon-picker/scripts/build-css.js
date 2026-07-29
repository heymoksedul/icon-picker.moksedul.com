const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../dist/index.css');
const tsPath = path.join(__dirname, '../src/styles.ts');

if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');

  // 1. Remove global layer order re-declarations
  css = css.replace(/@layer\s+theme,\s*base,\s*components,\s*utilities;/g, '');
  css = css.replace(/@layer\s+properties;/g, '');

  // 2. Replace global :root, :host and html with .icon-picker-scope
  css = css.replace(/:root,\s*:host/g, '.icon-picker-scope');
  css = css.replace(/html,\s*:host/g, '.icon-picker-scope');

  // 3. Prefix EVERY single rule selector in base, utilities, and components with .icon-picker-scope
  css = css.replace(
    /([^{}]+)\{([^{}]+)\}/g,
    (ruleMatch, selectors, body) => {
      if (
        selectors.includes('@') ||
        selectors.includes('keyframes')
      ) {
        return ruleMatch;
      }
      const scopedSelectors = selectors
        .split(',')
        .map((s) => {
          const trimmed = s.trim();
          if (!trimmed) return trimmed;
          if (trimmed.startsWith('.icon-picker-scope')) return trimmed;
          if (trimmed.startsWith('.dark') || trimmed.includes('.dark')) {
            if (trimmed.includes('.icon-picker-scope')) return trimmed;
            return `.dark .icon-picker-scope ${trimmed.replace('.dark', '').trim()}`;
          }
          return `.icon-picker-scope ${trimmed}`;
        })
        .join(', ');
      return `${scopedSelectors} {${body}}`;
    }
  );

  // 4. Wrap entire package CSS in an isolated cascade layer
  css = `@layer icon-picker-layer {\n${css}\n}`;

  // Update dist/index.css with scoped version
  fs.writeFileSync(cssPath, css, 'utf8');

  const tsContent = `export const cssString = ${JSON.stringify(css)};\n`;
  fs.writeFileSync(tsPath, tsContent);
  console.log('✅ Generated src/styles.ts with .icon-picker-scope & @layer');
} else {
  console.error('❌ dist/index.css not found');
  process.exit(1);
}
