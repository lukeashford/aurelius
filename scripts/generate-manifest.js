const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_FILE = path.join(ROOT_DIR, 'dist/llms.md');
const PHILOSOPHY_FILE = path.join(ROOT_DIR, 'PHILOSOPHY.md');
const TOKENS_FILE = path.join(ROOT_DIR, 'dist/tokens/index.js');

// Helper to read file content
const readFile = (relativePath) => fs.readFileSync(path.join(ROOT_DIR, relativePath), 'utf8');

// Helper to flatten tokens
function flattenTokens(obj, prefix = '', result = []) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenTokens(value, newKey, result);
    } else {
      let stringValue = value;
      if (Array.isArray(value)) {
          stringValue = `[${value.map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(', ')}]`;
      } else if (typeof value === 'object') {
          stringValue = JSON.stringify(value);
      }
      result.push({ key: newKey, value: stringValue });
    }
  }
  return result;
}

// Component class descriptions
const componentDescriptions = {
  // Buttons
  'aurelius-btn': 'Base button styles',
  'aurelius-btn--primary': 'Primary button variant (charcoal with gold border)',
  'aurelius-btn--important': 'Important button variant (gold background)',
  'aurelius-btn--elevated': 'Elevated button variant (with shadow)',
  'aurelius-btn--outlined': 'Outlined button variant (transparent background)',
  'aurelius-btn--featured': 'Featured button variant (with glow effect)',
  'aurelius-btn--ghost': 'Ghost button variant (minimal styling)',
  'aurelius-btn--danger': 'Danger button variant (error color)',
  'aurelius-btn--sm': 'Small button size',
  'aurelius-btn--md': 'Medium button size (default)',
  'aurelius-btn--lg': 'Large button size',
  'aurelius-btn--xl': 'Extra large button size',

  // Inputs
  'aurelius-input': 'Base input field styles',
  'aurelius-input--error': 'Input error state',
  'aurelius-textarea': 'Textarea field styles',
  'aurelius-textarea--error': 'Textarea error state',
  'aurelius-select': 'Select dropdown styles',
  'aurelius-checkbox': 'Checkbox input styles',
  'aurelius-radio': 'Radio button styles',

  // Cards
  'aurelius-card': 'Base card container styles',
  'aurelius-card--elevated': 'Elevated card variant (with shadow)',
  'aurelius-card--outlined': 'Outlined card variant',
  'aurelius-card--featured': 'Featured card variant (with glow)',
  'aurelius-card--interactive': 'Interactive/clickable card styles',

  // Badges
  'aurelius-badge': 'Base badge styles',
  'aurelius-badge--default': 'Default badge tone',
  'aurelius-badge--gold': 'Gold badge tone',
  'aurelius-badge--success': 'Success badge tone',
  'aurelius-badge--error': 'Error badge tone',
  'aurelius-badge--warning': 'Warning badge tone',
  'aurelius-badge--info': 'Info badge tone',

  // Avatar
  'aurelius-avatar': 'Base avatar styles',
  'aurelius-avatar--xs': 'Extra small avatar size',
  'aurelius-avatar--sm': 'Small avatar size',
  'aurelius-avatar--md': 'Medium avatar size',
  'aurelius-avatar--lg': 'Large avatar size',
  'aurelius-avatar--xl': 'Extra large avatar size',
  'aurelius-avatar--2xl': 'Double extra large avatar size',

  // Alerts
  'aurelius-alert': 'Base alert styles',
  'aurelius-alert--info': 'Info alert variant',
  'aurelius-alert--success': 'Success alert variant',
  'aurelius-alert--warning': 'Warning alert variant',
  'aurelius-alert--error': 'Error alert variant',

  // Modal
  'aurelius-modal-backdrop': 'Modal backdrop/overlay',
  'aurelius-modal-content': 'Modal content container',

  // Switch
  'aurelius-switch': 'Toggle switch base styles',
  'aurelius-switch-thumb': 'Switch toggle thumb',

  // Other
  'aurelius-label': 'Form field label',
  'aurelius-label--required': 'Required field label (with asterisk)',
  'aurelius-tooltip': 'Tooltip styles',
  'aurelius-divider': 'Horizontal divider',
  'aurelius-divider--vertical': 'Vertical divider',
};

function generateManifest() {
  let output = '';

  // 1. Add Philosophy
  if (fs.existsSync(PHILOSOPHY_FILE)) {
    output += fs.readFileSync(PHILOSOPHY_FILE, 'utf8') + '\n\n';
  } else {
    console.warn('⚠️ PHILOSOPHY.md not found!');
    output += '# Aurelius Design System\n\n';
  }

  // 2. Add Usage Rules for AI Agents
  output += '---\n\n';
  output += '## Usage Rules & Priorities (for AI Agents)\n\n';
  output += 'When working with Aurelius, **always follow this strict hierarchy**:\n\n';
  output += '### 1. Use React Components First\n\n';
  output += 'Prefer the exported React components (e.g., `<Button />`, `<Card />`, `<Input />`) whenever possible. ';
  output += 'These are the primary API and provide type safety, consistent behavior, and the best developer experience.\n\n';
  output += '```tsx\nimport {Button, Card, Input} from \'@lukeashford/aurelius\'\n\n';
  output += 'export function Example() {\n';
  output += '  return (\n';
  output += '    <Card variant="featured">\n';
  output += '      <Input placeholder="Email" />\n';
  output += '      <Button variant="primary">Submit</Button>\n';
  output += '    </Card>\n';
  output += '  )\n';
  output += '}\n```\n\n';
  output += '### 2. Use Tailwind Utilities for Custom Components\n\n';
  output += 'If no suitable React component exists and the project uses Tailwind, build new components using ';
  output += 'the Tailwind utilities from the Aurelius preset. **Always use the design token utilities** (e.g., `bg-obsidian`, `text-gold`, `border-ash`) ';
  output += 'rather than arbitrary values like `bg-[#0a0a0a]` or `p-[17px]`.\n\n';
  output += '```tsx\nexport function CustomElement() {\n';
  output += '  return (\n';
  output += '    <div className="bg-charcoal border border-gold/30 p-6 rounded-none">\n';
  output += '      <h3 className="font-heading text-xl text-white">Title</h3>\n';
  output += '      <p className="text-silver">Description</p>\n';
  output += '    </div>\n';
  output += '  )\n';
  output += '}\n```\n\n';
  output += '**Key Tailwind Token Utilities:**\n';
  output += '- **Colors:** `bg-obsidian`, `bg-charcoal`, `bg-graphite`, `text-gold`, `text-silver`, `border-ash`\n';
  output += '- **Typography:** `font-heading`, `font-body`, `font-mono`\n';
  output += '- **Shadows:** `shadow-glow`, `shadow-glow-sm`, `shadow-glow-lg`\n';
  output += '- **Spacing/Radii:** Standard Tailwind scale derived from tokens\n';
  output += '- **Transitions:** `duration-fast`, `duration-normal`, `ease-smooth`\n\n';
  output += '### 3. Use CSS Classes as Fallback\n\n';
  output += 'If Tailwind is not available, use the precompiled CSS classes. These mirror the React component variants.\n\n';
  output += '```html\n<div class="aurelius-card aurelius-card--featured">\n';
  output += '  <input class="aurelius-input" placeholder="Email" />\n';
  output += '  <button class="aurelius-btn aurelius-btn--primary aurelius-btn--md">Submit</button>\n';
  output += '</div>\n```\n\n';
  output += '### 4. Design Tokens (Last Resort)\n\n';
  output += 'Only access raw design tokens when you need precise values for custom styling outside of React/Tailwind.\n\n';
  output += '```tsx\nimport {colors, spacing, typography} from \'@lukeashford/aurelius\'\n\n';
  output += 'const customStyle = {\n';
  output += '  backgroundColor: colors.obsidian,\n';
  output += '  padding: spacing[6],\n';
  output += '  fontFamily: typography.fontHeading.join(\', \'),\n';
  output += '}\n```\n\n';
  output += '**Important:** Never hallucinate CSS classes or Tailwind utilities. If you\'re unsure whether a class or utility exists, ';
  output += 'check the sections below or use a React component instead.\n\n';

  // 3. Add Components
  output += '---\n\n';
  output += '## React Components API\n\n';
  output += 'These are the primary way to use Aurelius. Always check here first before building custom components.\n\n';
  try {
    const componentsDir = path.join(ROOT_DIR, 'src/components');
    if (fs.existsSync(componentsDir)) {
      const componentFiles = fs.readdirSync(componentsDir)
      .filter(f => f.endsWith('.tsx') && !f.includes('index'));

      componentFiles.forEach(file => {
        const content = readFile(`src/components/${file}`);
        const name = file.replace('.tsx', '');

        // Extract Props interface
        const propsMatch = content.match(
            /interface\s+(\w+Props)(?:\s+extends[^{]*)?\s*{([^}]+)}/s);

        output += `### <${name} />\n\n`;
        if (propsMatch) {
          const props = propsMatch[2].split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('//') && !line.startsWith('/*'))
          .map(line => `- \`${line}\``)
          .join('\n');
          output += `**Props:**\n${props}\n`;
        } else {
          output += '*No props interface found*\n';
        }
        output += '\n';
      });
    }
  } catch (e) {
    console.warn('Could not parse components', e);
  }

  // 4. Add Tailwind Utilities Mapping
  output += '---\n\n';
  output += '## Tailwind Utilities & Token Mapping\n\n';
  output += 'When building custom components with Tailwind, use these token-based utilities. The Aurelius preset ';
  output += 'extends Tailwind\'s theme with the design tokens.\n\n';
  output += '### Color Utilities\n\n';
  output += '| Utility | Token | Use Case |\n|---|---|---|\n';
  output += '| `bg-void`, `text-void` | `#000000` | Pure black |\n';
  output += '| `bg-obsidian`, `text-obsidian` | `#0a0a0a` | Primary background (dark mode) |\n';
  output += '| `bg-charcoal`, `text-charcoal` | `#141414` | Card/container backgrounds |\n';
  output += '| `bg-graphite`, `text-graphite` | `#1f1f1f` | Input backgrounds |\n';
  output += '| `bg-slate`, `text-slate` | `#2a2a2a` | Disabled states |\n';
  output += '| `bg-ash`, `text-ash`, `border-ash` | `#3d3d3d` | Borders, dividers |\n';
  output += '| `bg-gold`, `text-gold`, `border-gold` | `#c9a227` | Primary color (actions, highlights) |\n';
  output += '| `bg-gold-light`, `text-gold-light` | `#d4b84a` | Gold hover states |\n';
  output += '| `bg-gold-bright`, `text-gold-bright` | `#e5c84d` | Gold active states |\n';
  output += '| `bg-silver`, `text-silver` | `#a3a3a3` | Secondary text |\n';
  output += '| `bg-white`, `text-white`, `border-white` | `#ffffff` | Primary text (dark mode) |\n';
  output += '| `bg-success`, `text-success` | `#22c55e` | Success states |\n';
  output += '| `bg-error`, `text-error` | `#dc2626` | Error states |\n';
  output += '| `bg-warning`, `text-warning` | `#d97706` | Warning states |\n';
  output += '| `bg-info`, `text-info` | `#0ea5e9` | Info states |\n\n';
  output += '### Typography Utilities\n\n';
  output += '| Utility | Token | Use Case |\n|---|---|---|\n';
  output += '| `font-heading` | Marcellus, serif | Headings (h1-h6) |\n';
  output += '| `font-body` | Raleway, system-ui | Body text, UI text |\n';
  output += '| `font-mono` | JetBrains Mono, Fira Code | Code, monospace |\n\n';
  output += '### Shadow Utilities\n\n';
  output += '| Utility | Description |\n|---|---|\n';
  output += '| `shadow-sm` to `shadow-2xl` | Standard shadows (darker than default Tailwind) |\n';
  output += '| `shadow-glow` | Gold glow effect (20px blur) |\n';
  output += '| `shadow-glow-sm` | Small gold glow (10px blur) |\n';
  output += '| `shadow-glow-lg` | Large gold glow (40px blur) |\n';
  output += '| `shadow-inner` | Inner shadow |\n\n';
  output += '### Other Utilities\n\n';
  output += '- **Spacing:** Standard Tailwind scale (`p-4`, `m-6`, `gap-8`, etc.)\n';
  output += '- **Border Radius:** `rounded-sm` (0.125rem), `rounded-md` (0.25rem), `rounded-lg` (0.375rem), etc.\n';
  output += '- **Transitions:** `duration-instant` (75ms), `duration-fast` (150ms), `duration-normal` (200ms), `duration-slow` (300ms), `duration-slower` (500ms)\n';
  output += '- **Easing:** `ease-smooth` (cubic-bezier(0.16, 1, 0.3, 1)), `ease-snap` (cubic-bezier(0.5, 0, 0.1, 1))\n\n';

  // 5. Add CSS Classes
  output += '---\n\n';
  output += '## CSS Classes (Non-Tailwind Fallback)\n\n';
  output += 'Use these classes if Tailwind is not available. All classes use the `aurelius-` prefix to avoid conflicts.\n\n';
  try {
    const baseCss = readFile('src/styles/base.css');

    // Helper to extract classes
    const extractClasses = (text) => {
      const classes = new Set();
      const regex = /(?:^|[\r\n])\s*\.([a-zA-Z_-][a-zA-Z0-9_-]*)(?=\s*[:{])/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        classes.add(match[1]);
      }
      return Array.from(classes).sort();
    };

    // Split by layers
    const parts = baseCss.split('@layer ');
    const componentsPart = parts.find(p => p.startsWith('components'));
    const utilitiesPart = parts.find(p => p.startsWith('utilities'));

    if (componentsPart) {
        const classes = extractClasses(componentsPart);
        if (classes.length > 0) {
            output += '### Component Classes\n\n';
            output += '| Class | Description |\n|---|---|\n';
            classes.forEach(c => {
              const desc = componentDescriptions[c] || '';
              output += `| \`.${c}\` | ${desc} |\n`;
            });
            output += '\n';
        }
    }

    if (utilitiesPart) {
        const classes = extractClasses(utilitiesPart);
        if (classes.length > 0) {
            output += '### Utility Classes\n\n';
            output += '| Class | Description |\n|---|---|\n';
            classes.forEach(c => {
              const desc = componentDescriptions[c] || '';
              output += `| \`.${c}\` | ${desc} |\n`;
            });
            output += '\n';
        }
    }

  } catch (e) {
    console.warn('Could not parse base.css', e);
  }

  // 6. Add Design Tokens
  output += '---\n\n';
  output += '## Design Tokens (Reference)\n\n';
  output += 'Raw token values for reference. Prefer using React components or Tailwind utilities instead of accessing these directly.\n\n';
  if (fs.existsSync(TOKENS_FILE)) {
    try {
      // Clear cache to ensure fresh require if running multiple times
      delete require.cache[require.resolve(TOKENS_FILE)];
      const tokensModule = require(TOKENS_FILE);

      for (const [groupName, groupTokens] of Object.entries(tokensModule)) {
          if (groupName === 'default') continue;

          // Format title
          const title = groupName.charAt(0).toUpperCase() + groupName.slice(1);
          output += `### ${title}\n\n`;

          output += '| Token | Value |\n|---|---|\n';
          const flat = flattenTokens(groupTokens, groupName);
          flat.forEach(t => {
              output += `| \`${t.key}\` | ${t.value} |\n`;
          });
          output += '\n';
      }
    } catch (e) {
      console.warn('Could not load tokens from dist', e);
      output += '> Error loading tokens. Ensure `npm run build` has been run.\n\n';
    }
  } else {
      output += '> Tokens file not found. Ensure `npm run build` has been run.\n\n';
  }

  // Ensure dist exists
  if (!fs.existsSync(path.join(ROOT_DIR, 'dist'))) {
    fs.mkdirSync(path.join(ROOT_DIR, 'dist'), {recursive: true});
  }

  fs.writeFileSync(OUT_FILE, output);
  console.log(`✅ AI Manifest generated at ${OUT_FILE}`);
}

generateManifest();
