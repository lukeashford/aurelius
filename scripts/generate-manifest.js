const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'llms.md');

// Import tokens directly from source (use tsx to run, or read and parse)
const {colors, spacing, radii, shadows} = require('../dist/tokens/index.js');

function generateManifest() {
  let output = `# Aurelius Design System

## Rules (MUST follow)
- Dark mode only. Use bg-obsidian, bg-charcoal, bg-void. Never white backgrounds.
- Gold is for primary actions only. Don't overuse.
- Use existing components. For custom elements, use Tailwind classes below. Never hardcode hex values.
- Borders: prefer subtle 1px borders (border-ash) over shadows.

## Components

| Component | Key Props |
|-----------|-----------|
`;

  // Auto-generate component table
  const componentsDir = path.join(ROOT, 'src/components');
  if (fs.existsSync(componentsDir)) {
    const files = fs.readdirSync(componentsDir)
    .filter(f => f.endsWith('.tsx') && f !== 'index.tsx');
    files.forEach(file => {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
      const name = file.replace('.tsx', '');

      // Extract variant/size from Props type
      const variantMatch = content.match(/variant\??\s*:\s*['"]([^'"]+)['"]/g);
      const sizeMatch = content.match(/size\??\s*:\s*['"]([^'"]+)['"]/g);

      let props = [];
      if (variantMatch) {
        props.push(`variant`);
      }
      if (sizeMatch) {
        props.push(`size`);
      }
      // Add other common props detection as needed

      output += `| ${name} | ${props.join(', ') || 'see types'} |\n`;
    });
  }

  // Color classes (just list the class names)
  output += `
## Available Tailwind Classes

### Colors (bg-*, text-*, border-*)
`;
  const colorNames = Object.keys(colors).map(k => k.replace(/([A-Z])/g, '-$1').toLowerCase());
  output += colorNames.join(', ') + '\n';

  // Spacing
  output += `
### Spacing
Standard Tailwind scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64
Use with p-*, m-*, gap-*, space-*
`;

  // Shadows
  output += `
### Shadows
shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-glow, shadow-glow-sm, shadow-glow-lg
`;

  // Radii
  output += `
### Border Radius
rounded-none (preferred), rounded-sm, rounded-md, rounded-lg, rounded-full
`;

  fs.writeFileSync(OUT, output);
  console.log('✅ Generated llms.md');
}

generateManifest();