# Aurelius Design System

**A cohesive visual language for creative technologists — combining technical sophistication with an
artistic sensibility.**

[View the Live Demo](https://aurelius.lukeashford.com/)

---

## The Philosophy

Aurelius blends technical precision with a cinematic aesthetic, relying on deep blacks, rich golds,
and refined typography to convey stability, trust, and quiet luxury.

**Core Principles:**

1. **Cinematic:** Strict dark mode. No white backgrounds.
2. **Refined:** Gold (#c9a227) is reserved for primary actions.
3. **Grounded:** 1px subtle borders (`border-ash`) replace heavy drop shadows.

**Implementation Strategy:**
We follow a strict hierarchy:

1. **React Components** (`<Button />`) — *Always prefer these.*
2. **Component Classes** (`.btn`) — *Fallback for non-React.*
3. **Utility Classes** (`bg-obsidian`) — *For custom layouts.*
4. **Design Tokens** — *Last resort.*

---

## AI Agent Support 🤖

This package is **AI-Optimized**. It includes a machine-readable manifest file that helps AI coding
assistants understand the design system without hallucinating styles.

**How to Prompt Your Agent:**
> "I have installed `@lukeashford/aurelius`. Before writing any code, read
`node_modules/@lukeashford/aurelius/dist/llms.md`. This file contains the Design Philosophy (
> which you must strictly follow) and the Component API you have available."

---

## Installation

### 1. Install Package

```bash
npm install @lukeashford/aurelius
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

### 3. Import Styles

```css
/* In your global CSS */
@import '@lukeashford/aurelius/styles/base.css';
```

---

## Quick Start

```tsx
import {Button, Card, Input} from '@lukeashford/aurelius'

export function LoginForm() {
  return (
      <Card variant="featured" className="p-8 max-w-sm mx-auto">
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
