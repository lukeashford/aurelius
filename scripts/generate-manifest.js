const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'llms.md');

/**
 * Token values for manifest generation
 *
 * ⚠️ IMPORTANT: These values MUST match src/styles/theme.css
 * If you update theme.css, update these values to match!
 */
const colors = {
  void: '#000000',
  obsidian: '#0a0a0a',
  charcoal: '#141414',
  graphite: '#1f1f1f',
  slate: '#2a2a2a',
  ash: '#3d3d3d',
  gold: '#c9a227',
  goldLight: '#d4b84a',
  goldBright: '#e5c84d',
  goldMuted: '#8b7355',
  goldPale: '#d4c4a8',
  white: '#ffffff',
  silver: '#a3a3a3',
  zinc: '#71717a',
  dim: '#52525b',
  success: '#22c55e',
  successMuted: '#166534',
  error: '#dc2626',
  errorMuted: '#991b1b',
  warning: '#d97706',
  warningMuted: '#92400e',
  info: '#0ea5e9',
  infoMuted: '#0369a1',
};

function generateManifest() {
  let output = `# Aurelius Design System — AI Manifest

## Setup (Tailwind v4 CSS-first)

### 1. Install dependencies

\`\`\`bash
npm install @lukeashford/aurelius
npm install -D tailwindcss @tailwindcss/vite eslint eslint-plugin-tailwindcss
\`\`\`

### 2. Import base CSS (includes Tailwind v4, theme, and fonts)

\`\`\`css
/* src/index.css */
@import '@lukeashford/aurelius/styles/base.css';
\`\`\`

That's it! No tailwind.config.js needed. The base.css includes:
- Tailwind v4 with all utilities
- Aurelius theme variables (\`--color-*\`, \`--font-*\`, etc.)
- Custom fonts (Marcellus, Raleway, JetBrains Mono)
- Base styles for headings, links, scrollbars, etc.
- Custom utilities (\`.glow\`, \`.text-gradient-gold\`, etc.)

### 3. Configure ESLint (optional, enforces design system)

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

### 4. Vite configuration

\`\`\`typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
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

  // Generate color classes from tokens
  const colorNames = Object.keys(colors);
  const bgClasses = colorNames.map(c => `bg-${c.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  output += bgClasses.join(', ') + '\n';

  output += `
### Text (\`text-*\`)
text-white, text-silver, text-gold, text-gold-light, text-gold-muted, text-dim, text-success, text-error, text-warning, text-info

### Borders (\`border-*\`)
border-ash, border-gold, border-gold-muted, border-charcoal, border-graphite, border-success, border-error

### Spacing (\`p-*\`, \`m-*\`, \`gap-*\`, \`space-*\`)
0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64

### Border Radius (\`rounded-*\`)
none (preferred for Aurelius aesthetic), sm, md, lg, xl, 2xl, full

### Shadows (\`shadow-*\`)
sm, md, lg, xl, glow, glow-sm, glow-lg

### Opacity modifiers
Append \`/10\`, \`/20\`, \`/30\`, etc. to colors: \`bg-gold/20\`, \`border-ash/50\`

---

## CSS Variables (for JS runtime access)

Access theme values via CSS variables:

\`\`\`typescript
// For runtime token access
import { colors, typography } from '@lukeashford/aurelius'

// Or use CSS variables directly
getComputedStyle(document.documentElement).getPropertyValue('--color-gold')
\`\`\`

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
