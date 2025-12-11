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
npm install -D eslint eslint-plugin-better-tailwindcss @poupe/eslint-plugin-tailwindcss
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
// eslint.config.mjs
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import poupeTailwindcss from '@poupe/eslint-plugin-tailwindcss';

export default [
  // JS/TS/React files: enforce allowed Tailwind classes only
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        // Tailwind v4 CSS entry that imports Aurelius + @source
        entryPoint: './src/index.css',
      },
    },
    rules: {
      // No custom/non-Aurelius class names
      'better-tailwindcss/no-unknown-classes': 'error',

      // No arbitrary value utilities (bg-[...], text-[...], etc.)
      'better-tailwindcss/no-restricted-classes': [
        'error',
        {
          restrict: ['\\\\[.*\\\\]'],
        },
      ],
    },
  },

  // CSS files: enforce Tailwind v4 CSS usage and tokens
  {
    files: ['**/*.css'],
    language: 'tailwindcss/css',
    plugins: {
      tailwindcss: poupeTailwindcss,
    },
    rules: {
      ...poupeTailwindcss.configs.recommended.rules,
      'tailwindcss/no-conflicting-utilities': 'error',
      'tailwindcss/valid-apply-directive': 'error',
      'tailwindcss/valid-modifier-syntax': 'error',
      'tailwindcss/prefer-theme-tokens': 'warn',
      'tailwindcss/no-arbitrary-value-overuse': 'warn',
    },
  },
];
\`\`\`

**What this enforces:**

- \`better-tailwindcss/no-unknown-classes\` → Use only Tailwind classes that are registered in your Aurelius CSS entry file.
- \`better-tailwindcss/no-restricted-classes\` → Do **not** use arbitrary value utilities (\`bg-[...]\`, \`text-[...]\`, etc.).
- \`@poupe/eslint-plugin-tailwindcss\` rules → Enforce Tailwind v4 CSS usage in \`.css\` files. No conflicting utilities, prefer theme tokens over raw CSS, and more.

**If ESLint complains from these rules, you're leaving the Aurelius design system rails.**

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

      // Extract exported type aliases (e.g., export type ButtonVariant = 'primary' | 'secondary')
      // Handle both single-line and multi-line definitions
      const typeAliasRegex = /export\s+type\s+(\w+)\s*=\s*((?:[^\n;]|\n\s*\|)+)/g;
      const typeAliases = {};
      let typeMatch;

      while ((typeMatch = typeAliasRegex.exec(content)) !== null) {
        const typeName = typeMatch[1];
        const typeDefinition = typeMatch[2].trim();

        // Extract union values from string literal types
        // Match patterns like 'value' | "value" | `value`
        const unionValues = typeDefinition.match(/['"`]([^'"`]+)['"`]/g);
        if (unionValues) {
          // Remove quotes and store
          typeAliases[typeName] = unionValues.map(v => v.replace(/['"`]/g, ''));
        }
      }

      // Extract props from interface
      const propsMatch = content.match(/interface\s+\w*Props[^{]*{([^}]+)}/s);
      const propsWithVariants = [];

      if (propsMatch) {
        const propsBlock = propsMatch[1];
        const propLines = propsBlock
        .split('\n')
        .map(line => line.trim())
        .filter(
            line => line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith(
                '*'));

        propLines.forEach(line => {
          // Match prop name and its type
          const propMatch = line.match(/^(\w+)\??:\s*(\w+)/);
          if (propMatch) {
            const propName = propMatch[1];
            const propType = propMatch[2];

            // Check if the prop type is one of our exported type aliases
            if (typeAliases[propType]) {
              propsWithVariants.push(`${propName} (${typeAliases[propType].join(', ')})`);
            } else {
              propsWithVariants.push(propName);
            }
          }
        });
      }

      const propsStr = propsWithVariants.length > 0 ? propsWithVariants.join(', ') : 'children';
      output += `| ${name} | ${propsStr} |\n`;
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