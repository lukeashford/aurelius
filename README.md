# Aurelius Design System

**A Tailwind-first React design system — combining technical sophistication with cinematic aesthetics.**

[View the Live Demo](https://aurelius.lukeashford.com/)

---

## Philosophy

Aurelius blends technical precision with a cinematic aesthetic, relying on deep blacks, rich golds,
and refined typography to convey stability, trust, and quiet luxury.

**Core Principles:**

1. **Cinematic:** Strict dark mode. No white backgrounds.
2. **Refined:** Gold (#c9a227) is reserved for primary actions and highlights.
3. **Grounded:** 1px subtle borders (`border-ash`) replace heavy drop shadows.
4. **Token-Driven:** All styles derive from design tokens — no magic numbers.

---

## Usage Hierarchy

Aurelius is designed with a clear consumption priority:

### 1. **React Components (Preferred)**

Use the exported React components whenever possible. They provide the most ergonomic, type-safe API.

```tsx
import {Button, Card, Input} from '@lukeashford/aurelius'

export function LoginForm() {
  return (
    <Card variant="featured" className="max-w-sm mx-auto">
      <h2 className="text-gold text-2xl mb-6">Sign In</h2>
      <div className="space-y-4">
        <Input placeholder="email@example.com"/>
        <Button variant="primary" className="w-full">
          Enter the System
        </Button>
      </div>
    </Card>
  )
}
```

### 2. **Tailwind Utilities (For Custom Components)**

When building new components in a Tailwind project, use the utilities from the Aurelius preset. All utilities are derived from the design tokens.

```tsx
export function CustomCard() {
  return (
    <div className="bg-charcoal border border-gold/30 p-6 shadow-sm">
      <h3 className="font-heading text-xl text-white">Custom Component</h3>
      <p className="text-silver">Built with Aurelius tokens via Tailwind.</p>
    </div>
  )
}
```

**Available Token Utilities:**
- **Colors:** `bg-obsidian`, `text-gold`, `border-ash`, etc.
- **Spacing:** `p-4`, `m-6`, `gap-8` (standard Tailwind scale + tokens)
- **Typography:** `font-heading`, `font-body`, `font-mono`
- **Shadows:** `shadow-glow`, `shadow-glow-sm`, `shadow-glow-lg`
- **Radii:** `rounded-sm`, `rounded-md`, `rounded-lg`
- **Transitions:** `duration-fast`, `duration-normal`, `ease-smooth`

### 3. **CSS Classes (Non-Tailwind Fallback)**

If you're not using Tailwind, import the precompiled CSS and use the component classes directly.

```css
/* In your global CSS */
@import '@lukeashford/aurelius/styles/base.css';
```

```html
<!-- Plain HTML/CSS usage -->
<div class="aurelius-card aurelius-card--featured">
  <h2>Sign In</h2>
  <input class="aurelius-input" placeholder="email@example.com" />
  <button class="aurelius-btn aurelius-btn--primary aurelius-btn--md">
    Enter the System
  </button>
</div>
```

**Available CSS Classes:**
- **Buttons:** `.aurelius-btn`, `.aurelius-btn--primary`, `.aurelius-btn--sm`, etc.
- **Cards:** `.aurelius-card`, `.aurelius-card--elevated`, `.aurelius-card--featured`
- **Forms:** `.aurelius-input`, `.aurelius-textarea`, `.aurelius-select`, `.aurelius-checkbox`
- **Badges:** `.aurelius-badge`, `.aurelius-badge--gold`, `.aurelius-badge--success`
- **Alerts:** `.aurelius-alert`, `.aurelius-alert--info`, `.aurelius-alert--error`

### 4. **Design Tokens (Last Resort)**

Access raw design tokens when you need precise values for custom styling.

```tsx
import {colors, spacing, typography} from '@lukeashford/aurelius'

const customStyles = {
  backgroundColor: colors.obsidian,
  padding: spacing[6],
  fontFamily: typography.fontHeading.join(', '),
}
```

---

## Installation

### For Tailwind + React Projects (Recommended)

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
    './node_modules/@lukeashford/aurelius/**/*.{js,mjs,ts}',
  ],
}
```

Or in TypeScript:

```typescript
// tailwind.config.ts
import type {Config} from 'tailwindcss'
import aureliusPreset from '@lukeashford/aurelius/tailwind.preset'

export default {
  presets: [aureliusPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@lukeashford/aurelius/**/*.{js,mjs,ts}',
  ],
} satisfies Config
```

#### 3. Import Styles

```css
/* In your global CSS (e.g., src/index.css) */
@import '@lukeashford/aurelius/styles/base.css';
```

### For Plain CSS / Non-Tailwind Projects

#### 1. Install Package

```bash
npm install @lukeashford/aurelius
```

#### 2. Import Precompiled CSS

```css
/* In your global CSS */
@import '@lukeashford/aurelius/styles/base.css';
```

#### 3. Use Component Classes

```html
<button class="aurelius-btn aurelius-btn--primary aurelius-btn--md">
  Click Me
</button>
```

---

## Enforcing Design System Usage

To prevent developers from bypassing the design system in your app, consider these practices:

### 1. **Restrict Arbitrary Values (Tailwind)**

Use [`eslint-plugin-tailwindcss`](https://github.com/francoismassart/eslint-plugin-tailwindcss) to enforce best practices:

```bash
npm install -D eslint-plugin-tailwindcss
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['tailwindcss'],
  rules: {
    // Warn on arbitrary values like bg-[#ff0000]
    'tailwindcss/no-arbitrary-value': 'warn',
    // Enforce using preset colors
    'tailwindcss/no-custom-classname': 'warn',
  },
}
```

### 2. **Component-Only Architecture**

Encourage using only Aurelius components in your app code. Reserve raw Tailwind for the design system itself.

```typescript
// .eslintrc.js - Example (requires custom rule)
module.exports = {
  rules: {
    // Disallow className in app code (pseudo-code)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[name.name="className"]',
        message: 'Use Aurelius components instead of raw className',
      },
    ],
  },
}
```

**Note:** These enforcement rules apply to **your app**, not this package. Aurelius provides the building blocks; you decide how strictly to enforce usage.

---

## AI Agent Support 🤖

This package is **AI-Optimized**. It includes a machine-readable manifest file that helps AI coding
assistants understand the design system without hallucinating styles.

**How to Prompt Your Agent:**
> "I have installed `@lukeashford/aurelius`. Before writing any code, read
`node_modules/@lukeashford/aurelius/dist/llms.md`. This file contains the Design Philosophy
> (which you must strictly follow) and the Component API you have available."

The manifest includes:
- Design philosophy and usage rules
- Complete React component API with props
- Tailwind token mappings
- CSS class reference
- Design token values

---

## Available Components

- **Button** - Primary UI action with variants: `primary`, `important`, `elevated`, `outlined`, `featured`, `ghost`, `danger`
- **Card** - Content container with variants: `default`, `elevated`, `outlined`, `featured`
- **Input** - Text input field with error states
- **Textarea** - Multi-line text input
- **Select** - Dropdown select field
- **Checkbox** - Toggle checkbox
- **Radio** - Radio button
- **Switch** - Toggle switch
- **Badge** - Status indicator with tones: `default`, `gold`, `success`, `error`, `warning`, `info`
- **Avatar** - User avatar with sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`
- **Alert** - Notification banner with variants: `info`, `success`, `warning`, `error`
- **Modal** - Dialog overlay
- **Label** - Form field label
- **Skeleton** - Loading placeholder
- **Spinner** - Loading spinner
- **Tooltip** - Hover tooltip

See the [live demo](https://aurelius.lukeashford.com/) for examples of all components.

---

## Contributing

This is a personal design system, but feedback and bug reports are welcome!

---

## License

MIT
