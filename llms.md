# Aurelius Design System — AI Manifest

## Setup (Tailwind v4 CSS-first)

### 1. Install dependencies

```bash
npm install @lukeashford/aurelius
npm install -D tailwindcss @tailwindcss/vite eslint eslint-plugin-tailwindcss
```

### 2. Import base CSS (includes Tailwind v4, theme, and fonts)

```css
/* src/index.css */
@import '@lukeashford/aurelius/styles/base.css';
```

That's it! No tailwind.config.js needed. The base.css includes:
- Tailwind v4 with all utilities
- Aurelius theme variables (`--color-*`, `--font-*`, etc.)
- Custom fonts (Marcellus, Raleway, JetBrains Mono)
- Base styles for headings, links, scrollbars, etc.
- Custom utilities (`.glow`, `.text-gradient-gold`, etc.)

### 3. Configure ESLint (optional, enforces design system)

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
  },
];
```

### 4. Vite configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## Rules (MUST follow)

1. **Dark mode only.** Use `bg-obsidian`, `bg-charcoal`, `bg-void`. Never white backgrounds.
2. **Text colors.** Use `text-white` for headings and primary content. Use `text-silver` for secondary text, descriptions, and metadata.
3. **Gold is for primary actions only.** Don't overuse `text-gold` or `bg-gold`.
4. **Use components first.** Check the Components table below before building custom elements.
5. **Use Tailwind classes from this manifest.** Never hardcode hex values or use arbitrary values like `bg-[#123]`.
6. **Subtle borders over shadows.** Prefer `border-ash` over heavy drop shadows.

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
bg-void, bg-obsidian, bg-charcoal, bg-graphite, bg-slate, bg-ash, bg-gold, bg-gold-light, bg-gold-bright, bg-gold-muted, bg-gold-pale, bg-white, bg-silver, bg-zinc, bg-dim, bg-success, bg-success-muted, bg-error, bg-error-muted, bg-warning, bg-warning-muted, bg-info, bg-info-muted

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

## CSS Variables (for JS runtime access)

Access theme values via CSS variables:

```typescript
// For runtime token access
import { colors, typography } from '@lukeashford/aurelius'

// Or use CSS variables directly
getComputedStyle(document.documentElement).getPropertyValue('--color-gold')
```

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