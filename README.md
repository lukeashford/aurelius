# Aurelius Design System

**A cohesive visual language for creative technologists — combining technical sophistication with an artistic sensibility.**

[View the Live Demo](https://aurelius.lukeashford.com/)

---

## The Philosophy

Aurelius blends technical precision with a cinematic aesthetic, relying on deep blacks, rich golds, and refined typography to convey stability, trust, and quiet luxury.

**Core Principles:**

1. **Cinematic:** Strict dark mode. No white backgrounds.
2. **Refined:** Gold (#c9a227) is reserved for primary actions.
3. **Grounded:** 1px subtle borders (`border-ash`) replace heavy drop shadows.

**Implementation Strategy:**

Aurelius is a **Tailwind-first design system** that ships three primary things:

1. **React Components** (the preferred way to consume the design system)
2. **A Tailwind Preset** (design tokens)
3. **Precompiled CSS** (fallback for non-Tailwind users)

---

## AI Agent Support 🤖

This package is **AI-Optimized**. It includes a machine-readable manifest file that helps AI coding assistants understand the design system without hallucinating styles.

**How to Prompt Your Agent:**

> "I have installed `@lukeashford/aurelius`. Before writing any code, read `node_modules/@lukeashford/aurelius/dist/llms.md`. This file contains the Design Philosophy (which you must strictly follow) and the Component API you have available."

---

## Installation & Setup

### For Tailwind Users (Recommended)

#### 1. Install Package

```bash
npm install @lukeashford/aurelius
```

#### 2. Configure Tailwind

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

#### 3. Use Components

```tsx
import {Button, Card, Input} from '@lukeashford/aurelius'

export function LoginForm() {
  return (
    <Card variant="featured" className="p-8 max-w-sm mx-auto">
      <h2 className="text-gold text-2xl mb-6">Sign In</h2>
      <div className="space-y-4">
        <Input placeholder="email@example.com" />
        <Button variant="primary" className="w-full">
          Enter the System
        </Button>
      </div>
    </Card>
  )
}
```

**That's it!** The preset handles the rest.
---

### For Non-Tailwind Users

#### 1. Install Package

```bash
npm install @lukeashford/aurelius
```

#### 2. Import Precompiled CSS

```css
/* In your global CSS */
@import '@lukeashford/aurelius/styles/base.css';
```

#### 3. Use Components

```tsx
import {Button, Card, Input} from '@lukeashford/aurelius'

export function LoginForm() {
  return (
    <Card variant="featured" className="p-8 max-w-sm mx-auto">
      <h2 className="text-gold text-2xl mb-6">Sign In</h2>
      <div className="space-y-4">
        <Input placeholder="email@example.com" />
        <Button variant="primary" className="w-full">
          Enter the System
        </Button>
      </div>
    </Card>
  )
}
```

**The precompiled CSS contains:**
- ✅ All component styles
- ✅ All token-based utility classes
- ✅ Base styles (typography, tables, forms, etc.)

Components render identically whether you use Tailwind or precompiled CSS.

---

## Architecture

Aurelius is token-driven:

```
Design Tokens (src/tokens/*)
    ↓
Tailwind Preset (theme + safelist)
    ↓
┌─────────────────┬──────────────────┐
│  Tailwind Build │  CSS Fallback    │
│  (consumer)     │  (precompiled)   │
└─────────────────┴──────────────────┘
    ↓                   ↓
Components styled via Tailwind utilities
```

### Key Features

- **Single Source of Truth**: All styling comes from design tokens
- **Auto-Generated Utilities**: Adding a token automatically generates all related utilities
- **No Manual Safelist**: 2,400+ utilities generated from tokens
- **Universal Support**: Works with or without Tailwind
- **Type Safe**: Tokens and safelist are TypeScript

---

## Usage Hierarchy

**1. React Components (Preferred)**

```tsx
import {Button, Card, Input} from '@lukeashford/aurelius'

<Button variant="primary">Click Me</Button>
```

**2. Token-Based Utilities (For Custom Layouts)**

```tsx
<div className="bg-charcoal border border-gold/30 p-6 rounded-none">
  <h2 className="text-gold text-xl font-semibold">Custom Card</h2>
</div>
```

Available utility classes:
- **Colors**: `bg-*`, `text-*`, `border-*` (void, obsidian, charcoal, graphite, slate, ash, gold, gold-light, white, silver, success, error, etc.)
- **Spacing**: `p-*`, `m-*`, `gap-*` (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, etc.)
- **Shadows**: `shadow-*` (sm, md, lg, xl, 2xl, glow, glow-sm, glow-lg)
- **Radii**: `rounded-*` (sm, md, lg, xl, 2xl, 3xl, full, none)
- **Transitions**: `duration-*` (instant, fast, normal, slow), `ease-*` (smooth, snap)

**3. Design Tokens (Programmatic Access)**

```tsx
import {colors, spacing, shadows} from '@lukeashford/aurelius/tokens'

const theme = {
  primary: colors.gold,
  background: colors.charcoal,
  spacing: spacing[4],
}
```

---

## Enforcing the Design System

Aurelius provides the tools, but cannot enforce rules in your app. Here are recommended approaches:

### For Tailwind Users

1. **ESLint Plugin**: Use `eslint-plugin-tailwindcss` with the `no-arbitrary-value` rule to prevent arbitrary values like `bg-[#1a2b3c]`

```json
{
  "extends": ["plugin:tailwindcss/recommended"],
  "rules": {
    "tailwindcss/no-arbitrary-value": "warn"
  }
}
```

2. **Linting Patterns**: Create custom ESLint rules to encourage Aurelius components over raw elements

3. **Code Review**: Train your team to use Aurelius components and token-based utilities

### For React Apps

Prefer Aurelius components over styled divs:

```tsx
// ✅ Good
<Button variant="primary">Click Me</Button>

// ⚠️ Acceptable for custom layouts
<div className="bg-charcoal border border-gold p-4">...</div>

// ❌ Avoid
<div style={{backgroundColor: '#141414', border: '1px solid #c9a227'}}>...</div>
```

---

## Component API

### Button

```tsx
<Button variant="primary | important | elevated | outlined | featured | ghost | danger"
        size="sm | md | lg | xl"
        loading={boolean}>
  Click Me
</Button>
```

### Card

```tsx
<Card variant="default | elevated | outlined | ghost | featured"
      interactive={boolean}>
  Content
</Card>
```

### Input

```tsx
<Input error={boolean}
       leadingIcon={ReactNode}
       trailingIcon={ReactNode}
       placeholder="Enter text..." />
```

### Badge

```tsx
<Badge variant="default | gold | success | error | warning | info">
  Status
</Badge>
```

[See full component documentation in `dist/llms.md`]

---

## Development

```bash
# Install dependencies
npm install

# Generate safelist from tokens
npm run generate:safelist

# Build package
npm run build

# Run demo
npm run dev:demo

# Run both package and demo
npm run dev:all
```

---

## Architecture Details

### Token-Driven Safelist

Aurelius automatically generates Tailwind utilities from design tokens:

```bash
npm run generate:safelist
```

This creates `src/generated/safelist.ts` containing:
- **2,248 token-derived utilities** (colors, spacing, radii, shadows, transitions)
- **235 structural utilities** (flex, grid, positioning, etc.)

The safelist ensures all utilities are available even when consumers only scan their own source files.

### Build Process

```bash
npm run build
```

1. `generate:safelist` → Generate utilities from tokens
2. `tsup` → Build TypeScript (including generated safelist)
3. `generate:css-content` → Create safelist content file
4. `build:css` → Compile CSS fallback with Tailwind
5. `generate-manifest` → Create AI-readable manifest

---

## License

MIT
