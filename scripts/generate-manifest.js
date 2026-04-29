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

/**
 * Extract JSDoc comment from content starting at a position
 * Returns the comment text without the markers
 */
function extractJSDoc(content, startIndex) {
  const beforeContent = content.substring(0, startIndex);
  const lastJSDocStart = beforeContent.lastIndexOf('/**');
  if (lastJSDocStart === -1) {
    return null;
  }

  // Make sure there's no other code between the JSDoc and the target
  const between = beforeContent.substring(lastJSDocStart);
  const jsDocEnd = between.indexOf('*/');
  if (jsDocEnd === -1) {
    return null;
  }

  // Check that there's only whitespace between end of JSDoc and the target
  const afterJSDoc = between.substring(jsDocEnd + 2);
  if (afterJSDoc.trim().length > 0) {
    return null;
  }

  const jsDocContent = between.substring(3, jsDocEnd);
  // Clean up the JSDoc content - remove leading * and whitespace
  return jsDocContent
  .split('\n')
  .map(line => line.replace(/^\s*\*\s?/, ''))
  .join('\n')
  .trim();
}

/**
 * Extract an interface body from content, handling nested braces
 */
function extractInterfaceBody(content, interfaceName) {
  const interfaceRegex = new RegExp(`export\\s+interface\\s+${interfaceName}\\s*\\{`);
  const match = content.match(interfaceRegex);
  if (!match) {
    return null;
  }

  const startIndex = match.index + match[0].length;
  let braceCount = 1;
  let endIndex = startIndex;

  while (braceCount > 0 && endIndex < content.length) {
    const char = content[endIndex];
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
    }
    endIndex++;
  }

  return content.substring(startIndex, endIndex - 1);
}

/**
 * Parse interface properties with their JSDoc comments
 */
function parseInterfaceProperties(interfaceBody) {
  const properties = [];
  // Match JSDoc followed by property definition
  // Handles multi-line JSDoc and various type definitions
  const propRegex = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(\w+)\??:\s*([^;\n]+)/g;
  let propMatch;

  while ((propMatch = propRegex.exec(interfaceBody)) !== null) {
    const propDoc = propMatch[1].replace(/\s*\*\s*/g, ' ').trim();
    const propName = propMatch[2];
    const propType = propMatch[3].trim();
    properties.push({
      name: propName,
      type: propType,
      description: propDoc
    });
  }

  return properties;
}

/**
 * Parse a hook file and extract documentation
 */
function parseHookFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.ts');

  // Extract the main hook function's JSDoc
  const hookFunctionMatch = content.match(
      new RegExp(`export\\s+function\\s+(${fileName})\\s*[(<]`));
  if (!hookFunctionMatch) {
    return null;
  }

  const hookName = hookFunctionMatch[1];
  const hookJSDoc = extractJSDoc(content, hookFunctionMatch.index);

  // Extract description (first paragraph before @example or @param)
  let description = '';
  let example = '';
  if (hookJSDoc) {
    const exampleMatch = hookJSDoc.match(/@example\s*\n```(\w+)?\n([\s\S]*?)```/);
    if (exampleMatch) {
      example = exampleMatch[2].trim();
    }

    // Get description - everything before @example, @param, @returns, etc.
    const descEnd = hookJSDoc.search(/@(example|param|returns|see)/);
    description = descEnd > -1
        ? hookJSDoc.substring(0, descEnd).trim()
        : hookJSDoc.trim();
  }

  // Capitalize first letter for interface names (useArtifacts -> UseArtifacts)
  const capitalizedHookName = hookName.charAt(0).toUpperCase() + hookName.slice(1);

  // Extract return interface (UseXxxReturn)
  const returnInterfaceBody = extractInterfaceBody(content, `${capitalizedHookName}Return`);
  const returnProperties = returnInterfaceBody ? parseInterfaceProperties(returnInterfaceBody) : [];

  // Extract options interface if present
  const optionsInterfaceBody = extractInterfaceBody(content, `${capitalizedHookName}Options`);
  const optionsProperties = optionsInterfaceBody ? parseInterfaceProperties(optionsInterfaceBody)
      : [];

  return {
    name: hookName,
    description,
    example,
    returnProperties,
    optionsProperties
  };
}

/**
 * Generate hooks documentation from source files
 */
function generateHooksSection() {
  const hooksDir = path.join(ROOT, 'src/components/chat/hooks');
  if (!fs.existsSync(hooksDir)) {
    return '';
  }

  // Only document hooks that are exported from the main package
  const exportedHooks = ['useArtifacts', 'useScrollAnchor'];

  let output = '';

  exportedHooks.forEach((hookName) => {
    const hookFile = path.join(hooksDir, `${hookName}.ts`);
    if (!fs.existsSync(hookFile)) {
      return;
    }

    const hookData = parseHookFile(hookFile);
    if (!hookData) {
      return;
    }

    output += `### ${hookData.name}\n\n`;

    if (hookData.description) {
      output += `${hookData.description}\n\n`;
    }

    if (hookData.optionsProperties.length > 0) {
      output += `**Options:**\n\n`;
      output += `| Property | Type | Description |\n`;
      output += `|----------|------|-------------|\n`;
      hookData.optionsProperties.forEach(prop => {
        output += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.description} |\n`;
      });
      output += '\n';
    }

    if (hookData.returnProperties.length > 0) {
      const capitalizedName = hookData.name.charAt(0).toUpperCase() + hookData.name.slice(1);
      output += `**Returns:** \`${capitalizedName}Return\`\n\n`;
      output += `| Property | Type | Description |\n`;
      output += `|----------|------|-------------|\n`;
      hookData.returnProperties.forEach(prop => {
        output += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.description} |\n`;
      });
      output += '\n';
    }

    if (hookData.example) {
      output += `**Example:**\n\n`;
      output += `\`\`\`tsx\n${hookData.example}\n\`\`\`\n\n`;
    }
  });

  return output;
}

function generateManifest() {
  const tokens = parseThemeCSS();

  let output = `<!--
  DO NOT EDIT THIS FILE DIRECTLY.
  This file is auto-generated by scripts/generate-manifest.js.
-->

# Aurelius Design System — AI Manifest

## Setup (Tailwind v4)

### 1. Install

\`\`\`bash
# For Vite projects (Recommended)
npm install @lukeashford/aurelius
npm install -D tailwindcss @tailwindcss/vite eslint @typescript-eslint/parser eslint-plugin-better-tailwindcss @poupe/eslint-plugin-tailwindcss @eslint/css tailwind-csstree

# For other projects (font bundling might not work)
npm install -D tailwindcss @tailwindcss/postcss postcss ...
\`\`\`

### 2. Configure (Vite)

If using Vite, add the Tailwind CSS plugin to your \`vite.config.ts\`:

\`\`\`typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
\`\`\`

### 3. Import the design system

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

### 4. Configure ESLint

Aurelius ships with a default ESLint config you can re-export in one line. It enforces design system
constraints — if ESLint complains, you're leaving the rails.

\`\`\`javascript
// eslint.config.mjs
export { default } from '@lukeashford/aurelius/eslint';
\`\`\`

### 5. Add lint script and run it

Add a lint script and wire it into your workflow:

\`\`\`json
{
  "scripts": {
    "lint": "eslint src --max-warnings 0",
    "dev": "npm run lint && vite",
    "build": "npm run lint && vite build"
  }
}
\`\`\`

If your project already has CI (or you're asked to add one), include \`npm run lint\` in that
pipeline so lint failures block merges.

---

## Rules (MUST follow)

1. **Dark mode only.** Use \`bg-obsidian\`, \`bg-charcoal\`, \`bg-void\`. Never white backgrounds.
2. **Text colors.** Use \`text-white\` for headings and primary content. Use \`text-silver\` for secondary text, descriptions, and metadata.
3. **Gold is for primary actions only.** Don't overuse \`text-gold\` or \`bg-gold\`.
4. **Use components first.** Check the Components table below before building custom elements.
5. **Stay on-system.** No custom/non-Aurelius class names, no arbitrary value utilities (\`bg-[...]\`, \`text-[...]\`, etc.), and follow Tailwind v4 CSS best practices in \`.css\` files.
6. **Subtle borders over shadows.** Prefer \`border-ash\` over heavy drop shadows.

---

## Components

Import from \`@lukeashford/aurelius\`:

| Component | Props |
|-----------|-------|
`;

  // Generate components table
  const componentsDir = path.join(ROOT, 'src/components');
  const componentNotes = {}; // Store JSDoc notes for components

  if (fs.existsSync(componentsDir)) {
    const getFiles = (dir) => {
      let results = [];
      const list = fs.readdirSync(dir);
      list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
          results = results.concat(getFiles(file));
        } else if (file.endsWith('.tsx') && !file.endsWith('index.tsx')) {
          results.push(file);
        }
      });
      return results;
    };

    const files = getFiles(componentsDir);

    files.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const name = path.basename(filePath, '.tsx');

      // Extract component description
      const componentDoc = extractJSDoc(content,
          content.search(new RegExp(`export\\s+(const|function)\\s+${name}`)));

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

      // Extract props from all interfaces with JSDoc
      const interfaceRegex = /interface\s+(\w+)[^{]*{([^}]+)}/gs;
      const propsWithVariants = [];
      const propDocs = [];
      let interfaceMatch;

      while ((interfaceMatch = interfaceRegex.exec(content)) !== null) {
        const interfaceName = interfaceMatch[1];
        const propsBlock = interfaceMatch[2];
        const lines = propsBlock.split('\n');
        const isMainProps = interfaceName.endsWith('Props');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Check if this line is a JSDoc comment
          if (line.startsWith('/**')) {
            // Extract JSDoc content (may span multiple lines)
            let docLines = [];
            let j = i;
            while (j < lines.length) {
              const docLine = lines[j].trim();
              docLines.push(docLine);
              if (docLine.includes('*/')) {
                break;
              }
              j++;
            }
            const docCommentMatch = docLines.join('\n').match(/\/\*\*\s*([\s\S]+?)\s*\*\//);
            let docComment = docCommentMatch ? docCommentMatch[1].replace(/\n\s*\*\s*/g, ' ').trim()
                : '';

            // Get the next non-empty line which should be the prop definition
            for (let k = j + 1; k < lines.length; k++) {
              const propLine = lines[k].trim();
              if (propLine && !propLine.startsWith('//') && !propLine.startsWith('/*')) {
                const propMatch = propLine.match(/^(\w+)\??:/);
                if (propMatch && docComment) {
                  const prefix = isMainProps ? '' : `${interfaceName}.`;
                  propDocs.push(`**${prefix}${propMatch[1]}**: ${docComment}`);
                }
                break;
              }
            }
          }

          // Extract prop name and type for the main table (only from main Props interface)
          if (isMainProps && line && !line.startsWith('//') && !line.startsWith('/*')
              && !line.startsWith('*')) {
            const propMatch = line.match(/^(\w+)\??:\s*([^;,\n]+)/);
            if (propMatch) {
              const propName = propMatch[1];
              const propType = propMatch[2].trim();

              // Check if the prop type is one of our exported type aliases
              if (typeAliases[propType]) {
                propsWithVariants.push(`${propName} (${typeAliases[propType].join(', ')})`);
              } else {
                propsWithVariants.push(propName);
              }
            }
          }
        }
      }

      const propsStr = propsWithVariants.length > 0 ? propsWithVariants.join(', ') : 'children';
      output += `| ${name} | ${propsStr} |\n`;

      // Store notes if any JSDoc was found
      if (propDocs.length > 0 || componentDoc) {
        componentNotes[name] = {
          description: componentDoc,
          props: propDocs
        };
      }
    });
  }

  // Add component notes section if any components have JSDoc
  if (Object.keys(componentNotes).length > 0) {
    output += `
### Component Notes

`;
    Object.entries(componentNotes).forEach(([componentName, data]) => {
      output += `**${componentName}**\n`;
      if (data.description) {
        output += `${data.description}\n\n`;
      }
      data.props.forEach(note => {
        output += `- ${note}\n`;
      });
      output += '\n';
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

## Hooks

Import hooks from \`@lukeashford/aurelius\`:

`;

  // Generate hooks documentation from source files
  output += generateHooksSection();

  output += `---

`;

  output += `## Tailwind Classes

Use ONLY these token-based classes. Arbitrary values like \`bg-[#0a0a0a]\` will fail linting.

### Backgrounds (\`bg-*\`)
`;

  // Generate background classes from parsed colors
  const bgClasses = Object.keys(tokens.colors).map((c) => toTailwindClass('bg', c));
  output += bgClasses.join(', ') + '\n';

  output += `
### Text (\`text-*\`)
`;
  const textClasses = Object.keys(tokens.colors).map((c) => toTailwindClass('text', c));
  output += textClasses.join(', ') + '\n';

  output += `
### Borders (\`border-*\`)
`;
  const borderClasses = Object.keys(tokens.colors).map((c) => toTailwindClass('border', c));
  output += borderClasses.join(', ') + '\n';

  output += `
### Typography

**Font families:** \`font-heading\` (${tokens.fonts.heading}), \`font-body\` (${tokens.fonts.body}), \`font-mono\` (${tokens.fonts.mono})

Standard Tailwind classes for size (\`text-sm\`, \`text-lg\`, etc.), weight (\`font-medium\`, \`font-bold\`), and spacing are available.

### Layout Classes
**Containers:** \`container\`, \`container-sm\`, \`container-md\`, \`container-lg\`, \`container-xl\`, \`container-fluid\`

**Grid:** \`row\` (creates 12-column CSS Grid)

**Columns (Tailwind built-in):** \`col-span-{1-12}\`, \`col-span-full\`, \`col-auto\`, \`sm:col-span-*\`, \`md:col-span-*\`, \`lg:col-span-*\`, \`xl:col-span-*\`

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
