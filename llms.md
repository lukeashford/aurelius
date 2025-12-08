# Aurelius Design System — AI Manifest

## Setup

### 1. Install dependencies

```bash
npm install -D eslint eslint-plugin-tailwindcss
```

### 2. Configure Tailwind

```javascript
// tailwind.config.js
const aureliusPreset = require('@lukeashford/aurelius/tailwind.preset')

module.exports = {
  presets: [aureliusPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@lukeashford/aurelius/dist/**/*.{js,mjs}',
  ],
}
```

### 3. Configure ESLint (enforces design system)

```javascript
// eslint.config.js
import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  {
    plugins: { tailwindcss },
    rules: {
      'tailwindcss/no-arbitrary-value': 'error',
      'tailwindcss/no-custom-classname': 'error',
    },
    settings: {
      tailwindcss: { config: './tailwind.config.js' },
    },
  },
];
```

### 4. Add lint script

```json
{
  "scripts": {
    "lint": "eslint src --max-warnings 0",
    "dev": "npm run lint && vite",
    "build": "npm run lint && vite build"
  }
}
```

### 5. Import fonts and directives

```typescript
// main.tsx
import '@lukeashford/aurelius/styles/fonts.css'
import './index.css'
```

```css
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Rules (MUST follow)

1. **Dark mode only.** Use `bg-obsidian`, `bg-charcoal`, `bg-void`. Never white backgrounds.
2. **Gold is for primary actions only.** Don't overuse `text-gold` or `bg-gold`.
3. **Use components first.** Check the Components table below before building custom elements.
4. **Use Tailwind classes from this manifest.** Never hardcode hex values or use arbitrary values like `bg-[#123]`.
5. **Subtle borders over shadows.** Prefer `border-ash` over heavy drop shadows.

---

## Components

Import from `@lukeashford/aurelius`:

| Component | Props |
|-----------|-------|
| Alert | variant, title |
| Avatar | src, alt, name, size, status |
| Badge | variant |
| Button | variant, size, loading |
| Card | variant, interactive |
| Checkbox | label |
| HelperText | error |
| Input | error, leadingIcon, trailingIcon |
| Label | required |
| Modal | isOpen, onClose, title, children, className |
| Radio | label |
| Select | error, options |
| Skeleton | children |
| Spinner | size |
| Switch | checked, defaultChecked, onCheckedChange, label |
| Textarea | error |
| Tooltip | content, children, open, side |

### Component usage example

```tsx
import { Button, Card, Input, Badge } from '@lukeashford/aurelius'

<Card variant="featured" className="p-6">
  <Badge variant="gold">New</Badge>
  <h2 className="text-gold text-xl mt-2">Title</h2>
  <Input placeholder="Enter value..." className="mt-4" />
  <Button variant="primary" className="mt-4">Submit</Button>
</Card>
```

---

## Tailwind Classes

Use ONLY these token-based classes. Arbitrary values like `bg-[#0a0a0a]` will fail linting.

### Backgrounds (`bg-*`)
bg-void, bg-obsidian, bg-charcoal, bg-graphite, bg-slate, bg-ash, bg-gold, bg-gold-light, bg-gold-bright, bg-gold-muted, bg-gold-pale, bg-gold-glow, bg-white, bg-silver, bg-zinc, bg-dim, bg-success, bg-success-muted, bg-error, bg-error-muted, bg-warning, bg-warning-muted, bg-info, bg-info-muted

### Text (`text-*`)
text-white, text-silver, text-gold, text-gold-light, text-gold-muted, text-dim, text-success, text-error, text-warning, text-info

### Borders (`border-*`)
border-ash, border-gold, border-gold-muted, border-charcoal, border-graphite, border-success, border-error

### Spacing (`p-*`, `m-*`, `gap-*`, `space-*`)
0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64

### Border Radius (`rounded-*`)
none (preferred for Aurelius aesthetic), sm, md, lg, xl, 2xl, full

### Shadows (`shadow-*`)
sm, md, lg, xl, glow, glow-sm, glow-lg

### Opacity modifiers
Append `/10`, `/20`, `/30`, etc. to colors: `bg-gold/20`, `border-ash/50`

---

## What NOT to do

```tsx
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
```

---

## Non-Tailwind fallback

If not using Tailwind, import precompiled CSS:

```typescript
import '@lukeashford/aurelius/styles/base.css'
```