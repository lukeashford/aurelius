# Aurelius Design System — AI Manifest

## Setup (Tailwind v4)

### 1. Install

```bash
npm install @lukeashford/aurelius
npm install -D eslint @typescript-eslint/parser eslint-plugin-better-tailwindcss @poupe/eslint-plugin-tailwindcss @eslint/css tailwind-csstree
```

### 2. Import the design system

Create or update your `index.css`:

```css
/* Import the complete Aurelius design system (includes Tailwind v4, fonts, and theme) */
@import '@lukeashford/aurelius/styles/base.css';

/* Tell Tailwind to scan the Aurelius package for utility classes */
@source "../node_modules/@lukeashford/aurelius/dist";
```

Then import it in your entry file:

```typescript
// main.tsx or index.tsx
import './index.css'
```

### 3. Configure ESLint

Aurelius ships with a default ESLint config you can re-export in one line. It enforces design system
constraints — if ESLint complains, you're leaving the rails.

```javascript
// eslint.config.mjs
export { default } from '@lukeashford/aurelius/eslint';
```

---

## Rules (MUST follow)

1. **Dark mode only.** Use `bg-obsidian`, `bg-charcoal`, `bg-void`. Never white backgrounds.
2. **Text colors.** Use `text-white` for headings and primary content. Use `text-silver` for secondary text, descriptions, and metadata.
3. **Gold is for primary actions only.** Don't overuse `text-gold` or `bg-gold`.
4. **Use components first.** Check the Components table below before building custom elements.
5. **Stay on-system.** No custom/non-Aurelius class names, no arbitrary value utilities (`bg-[...]`, `text-[...]`, etc.), and follow Tailwind v4 CSS best practices in `.css` files.
6. **Subtle borders over shadows.** Prefer `border-ash` over heavy drop shadows.

---

## Components

Import from `@lukeashford/aurelius`:

| Component | Props |
|-----------|-------|
| Alert | variant (info, success, warning, error), title |
| Avatar | src, alt, name, size (xs, sm, md, lg, xl, 2xl), status (online, offline, busy) |
| Badge | variant (default, gold, success, error, warning, info) |
| BrandIcon | size (sm, md, lg), variant (solid, outline) |
| Button | variant (primary, important, elevated, outlined, featured, ghost, danger), size (sm, md, lg, xl), loading |
| Card | variant (default, elevated, outlined, ghost, featured), interactive, selected |
| ChatHistory | messages |
| Checkbox | label |
| Col | span (1-12 or 'auto'), sm, md, lg, xl (responsive column widths) |
| ColorSwatch | color, label |
| Container | size (sm, md, lg, xl, fluid, responsive) |
| HelperText | error |
| ImageCard | src, alt, title, subtitle, aspectRatio (${number}/${number}), overlay, mediaClassName, contentClassName |
| Input | error, leadingIcon, trailingIcon |
| Label | required |
| MarkdownContent | content, sanitizeConfig |
| Message | variant (user, assistant), content, isStreaming |
| Modal | isOpen, title, children, className |
| Radio | label |
| Row | gutter (0, 1, 2, 3, 4, 5, 6, 8, 10, 12) |
| SectionHeading | level (h2, h3) |
| Select | error, options |
| Skeleton | children |
| Spinner | size (sm, md, lg) |
| Stepper | steps, currentStep, status (complete, error) |
| StreamingCursor | children |
| Switch | checked, defaultChecked, label |
| Textarea | error |
| Tooltip | content, children, open, side (top, right, bottom, left) |

### Component usage examples

**Basic components:**
```tsx
import { Button, Card, Input, Badge } from '@lukeashford/aurelius'

<Card variant="featured" className="p-6">
  <Badge variant="gold">New</Badge>
  <h2 className="text-gold text-xl mt-2">Title</h2>
  <Input placeholder="Enter value..." className="mt-4" />
  <Button variant="primary" className="mt-4">Submit</Button>
</Card>
```

**Layout system (Container/Row/Col):**
```tsx
import { Container, Row, Col, Card } from '@lukeashford/aurelius'

<Container>
  <Row gutter="6">
    <Col span={12} md={6} lg={4}>
      <Card>Item 1</Card>
    </Col>
    <Col span={12} md={6} lg={4}>
      <Card>Item 2</Card>
    </Col>
    <Col span={12} md={6} lg={4}>
      <Card>Item 3</Card>
    </Col>
  </Row>
</Container>
```

**Layout with CSS classes (framework-agnostic):**
```html
<div class="container">
  <div class="row">
    <div class="col-span-12 md:col-span-6">Left</div>
    <div class="col-span-12 md:col-span-6">Right</div>
  </div>
</div>
```
Note: `.row` uses CSS Grid (12 columns). Children use Tailwind's `col-span-*` utilities.

---

## Tailwind Classes

Use ONLY these token-based classes. Arbitrary values like `bg-[#0a0a0a]` will fail linting.

### Backgrounds (`bg-*`)
bg-void, bg-obsidian, bg-charcoal, bg-graphite, bg-slate, bg-ash, bg-gold, bg-gold-light, bg-gold-bright, bg-gold-muted, bg-gold-pale, bg-gold-glow, bg-white, bg-silver, bg-zinc, bg-dim, bg-success, bg-success-muted, bg-error, bg-error-muted, bg-warning, bg-warning-muted, bg-info, bg-info-muted

### Text (`text-*`)
text-void, text-obsidian, text-charcoal, text-graphite, text-slate, text-ash, text-gold, text-gold-light, text-gold-bright, text-gold-muted, text-gold-pale, text-gold-glow, text-white, text-silver, text-zinc, text-dim, text-success, text-success-muted, text-error, text-error-muted, text-warning, text-warning-muted, text-info, text-info-muted

### Borders (`border-*`)
border-void, border-obsidian, border-charcoal, border-graphite, border-slate, border-ash, border-gold, border-gold-light, border-gold-bright, border-gold-muted, border-gold-pale, border-gold-glow, border-white, border-silver, border-zinc, border-dim, border-success, border-success-muted, border-error, border-error-muted, border-warning, border-warning-muted, border-info, border-info-muted

### Typography

**Font families:** `font-heading` ("Marcellus", serif), `font-body` ("Raleway", system-ui, sans-serif), `font-mono` ("JetBrains Mono", "Fira Code", "SF Mono", monospace)

Standard Tailwind classes for size (`text-sm`, `text-lg`, etc.), weight (`font-medium`, `font-bold`), and spacing are available.

### Layout Classes
**Containers:** `container`, `container-sm`, `container-md`, `container-lg`, `container-xl`, `container-fluid`

**Grid:** `row` (creates 12-column CSS Grid)

**Columns (Tailwind built-in):** `col-span-{1-12}`, `col-span-full`, `col-auto`, `sm:col-span-*`, `md:col-span-*`, `lg:col-span-*`, `xl:col-span-*`

### Custom Utilities
text-gradient-gold, glow, glow-sm, glow-md, glow-lg, scroll-smooth, scrollbar-hide, backdrop-glass, focus-ring, line-clamp-2, line-clamp-3, center-absolute

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