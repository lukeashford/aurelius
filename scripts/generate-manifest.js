const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const THEME_CSS = path.join(ROOT, 'src/styles/theme.css');
const OUT = path.join(ROOT, 'llms.md');

/**
 * Parse theme.css to extract design tokens
 * Single source of truth — no hardcoded values
 */
function parseThemeCSS() {
  const css = fs.readFileSync(THEME_CSS, 'utf8');

  // Extract all CSS custom properties from @theme block
  const themeMatch = css.match(/@theme\s*{([^}]+(?:{[^}]*}[^}]*)*)}/s);
  if (!themeMatch) {
    throw new Error('Could not find @theme block in theme.css');
  }
  const themeBlock = themeMatch[1];

  // Parse custom properties
  const props = {};
  const propRegex = /--([\w-]+):\s*([^;]+);/g;
  let match;
  while ((match = propRegex.exec(themeBlock)) !== null) {
    props[match[1]] = match[2].trim();
  }

  // Group colors
  const colors = {};
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('color-')) {
      const name = key.replace('color-', '');
      colors[name] = value;
    }
  });

  // Extract font families
  const fonts = {
    heading: props['font-heading'],
    body: props['font-body'],
    mono: props['font-mono'],
  };

  // Extract @utility class names
  const utilities = [];
  const utilityRegex = /@utility\s+([\w-]+)/g;
  while ((match = utilityRegex.exec(css)) !== null) {
    utilities.push(match[1]);
  }

  return {colors, fonts, utilities};
}

/**
 * Convert camelCase or kebab-case to Tailwind class format
 */
function toTailwindClass(prefix, name) {
  // gold-light -> gold-light, goldLight -> gold-light
  const kebab = name.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `${prefix}-${kebab}`;
}

function generateManifest() {
  const tokens = parseThemeCSS();

  let output = `# Aurelius Design System — AI Manifest

## Setup (Tailwind v4)

### 1. Install

\`\`\`bash
npm install @lukeashford/aurelius
npm install -D eslint eslint-plugin-tailwindcss
\`\`\`

### 2. Import the design system

Create or update your \`index.css\`:

\`\`\`css
/* Import the complete Aurelius design system (includes Tailwind v4, fonts, and theme) */
@import '@lukeashford/aurelius/styles/base.css';

/* Tell Tailwind to scan the Aurelius package for utility classes */
@source "../node_modules/@lukeashford/aurelius/dist";
\`\`\`

Then import it in your entry file:

\`\`\`typescript
// main.tsx or index.tsx
import './index.css'
\`\`\`

### 3. Configure ESLint (enforces design system)

\`\`\`javascript
// eslint.config.js
import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  {
    plugins: { tailwindcss },
    rules: {
      'tailwindcss/no-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': 'error',
    },
  },
];
\`\`\`

---

## Rules (MUST follow)

1. **Dark mode only.** Use \`bg-obsidian\`, \`bg-charcoal\`, \`bg-void\`. Never white backgrounds.
2. **Text colors.** Use \`text-white\` for headings and primary content. Use \`text-silver\` for secondary text, descriptions, and metadata.
3. **Gold is for primary actions only.** Don't overuse \`text-gold\` or \`bg-gold\`.
4. **Use components first.** Check the Components table below before building custom elements.
5. **Use Tailwind classes from this manifest.** Never hardcode hex values or use arbitrary values like \`bg-[#123]\`.
6. **Subtle borders over shadows.** Prefer \`border-ash\` over heavy drop shadows.

---

## Components

Import from \`@lukeashford/aurelius\`:

| Component | Props |
|-----------|-------|
`;

  // Generate components table
  const componentsDir = path.join(ROOT, 'src/components');
  if (fs.existsSync(componentsDir)) {
    const files = fs.readdirSync(componentsDir)
    .filter(f => f.endsWith('.tsx') && f !== 'index.tsx');

    files.forEach(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      const name = file.replace('.tsx', '');

      // Extract props from interface
      const propsMatch = content.match(/interface\s+\w*Props[^{]*{([^}]+)}/s);
      let propsStr = '';

      if (propsMatch) {
        const propsBlock = propsMatch[1];
        const props = propsBlock
        .split('\n')
        .map(line => line.trim())
        .filter(
            line => line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith(
                '*'))
        .map(line => {
          const match = line.match(/^(\w+)\??:/);
          return match ? match[1] : null;
        })
        .filter(Boolean);

        propsStr = props.join(', ');
      }

      output += `| ${name} | ${propsStr || 'children'} |\n`;
    });
  }

  output += `
### Component usage example

\`\`\`tsx
import { Button, Card, Input, Badge } from '@lukeashford/aurelius'

<Card variant="featured" className="p-6">
  <Badge variant="gold">New</Badge>
  <h2 className="text-gold text-xl mt-2">Title</h2>
  <Input placeholder="Enter value..." className="mt-4" />
  <Button variant="primary" className="mt-4">Submit</Button>
</Card>
\`\`\`

---

## Tailwind Classes

Use ONLY these token-based classes. Arbitrary values like \`bg-[#0a0a0a]\` will fail linting.

### Backgrounds (\`bg-*\`)
`;

  // Generate background classes from parsed colors
  const bgClasses = Object.keys(tokens.colors).map(c => toTailwindClass('bg', c));
  output += bgClasses.join(', ') + '\n';

  output += `
### Text (\`text-*\`)
`;
  const textClasses = Object.keys(tokens.colors).map(c => toTailwindClass('text', c));
  output += textClasses.join(', ') + '\n';

  output += `
### Borders (\`border-*\`)
`;
  const borderClasses = Object.keys(tokens.colors).map(c => toTailwindClass('border', c));
  output += borderClasses.join(', ') + '\n';

  output += `
### Typography

**Font families:** \`font-heading\` (${tokens.fonts.heading}), \`font-body\` (${tokens.fonts.body}), \`font-mono\` (${tokens.fonts.mono})

Standard Tailwind classes for size (\`text-sm\`, \`text-lg\`, etc.), weight (\`font-medium\`, \`font-bold\`), and spacing are available.

### Custom Utilities
`;
  output += tokens.utilities.join(', ') + '\n';

  output += `
### Opacity modifiers
Append \`/10\`, \`/20\`, \`/30\`, etc. to colors: \`bg-gold/20\`, \`border-ash/50\`

---

## What NOT to do

\`\`\`tsx
// ❌ Arbitrary values — will fail lint
<div className="bg-[#0a0a0a] text-[#c9a227]">

// ❌ Inline styles with colors
<div style={{ backgroundColor: '#141414' }}>

// ❌ White backgrounds
<div className="bg-white">

// ❌ Building components that already exist
<button className="bg-gold px-4 py-2">  // Use <Button variant="primary">

// ✅ Correct
<div className="bg-obsidian text-gold border border-ash p-4">
<Button variant="primary">Click</Button>
\`\`\`
`;

  fs.writeFileSync(OUT, output.trim());
  console.log(`✅ Generated ${OUT}`);
}

generateManifest();