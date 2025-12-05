#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Import tokens by reading and evaluating the TypeScript files
// This is a workaround since we can't easily import TS from plain Node
function loadTokens() {
  const colorsContent = fs.readFileSync(path.join(__dirname, '../src/tokens/colors.ts'), 'utf-8')
  const spacingContent = fs.readFileSync(path.join(__dirname, '../src/tokens/spacing.ts'), 'utf-8')
  const radiiContent = fs.readFileSync(path.join(__dirname, '../src/tokens/radii.ts'), 'utf-8')
  const shadowsContent = fs.readFileSync(path.join(__dirname, '../src/tokens/shadows.ts'), 'utf-8')
  const transitionsContent = fs.readFileSync(path.join(__dirname, '../src/tokens/transitions.ts'), 'utf-8')

  // Extract the token objects using regex
  const extractObject = (content, varName) => {
    const regex = new RegExp(`export const ${varName}\\s*=\\s*({[\\s\\S]*?})\\s*as const`, 'm')
    const match = content.match(regex)
    if (match) {
      // eslint-disable-next-line no-eval
      return eval(`(${match[1]})`)
    }
    return {}
  }

  return {
    colors: extractObject(colorsContent, 'colors'),
    spacing: extractObject(spacingContent, 'spacing'),
    radii: extractObject(radiiContent, 'radii'),
    shadows: extractObject(shadowsContent, 'shadows'),
    duration: extractObject(transitionsContent, 'duration'),
    easing: extractObject(transitionsContent, 'easing'),
  }
}

const tokens = loadTokens()

/**
 * Generate safelist from design tokens
 */

// Color utility prefixes
const COLOR_PREFIXES = [
  'bg',
  'text',
  'border',
  'ring',
  'fill',
  'stroke',
  'ring-offset',
]

// State modifiers
const STATE_MODIFIERS = [
  'hover',
  'focus',
  'focus-visible',
  'active',
  'disabled',
]

// Spacing utility prefixes
const SPACING_PREFIXES = [
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'gap', 'gap-x', 'gap-y',
  'space-x', 'space-y',
  'w', 'h',
  'min-w', 'min-h',
  'max-w', 'max-h',
  'inset', 'top', 'right', 'bottom', 'left',
]

// Border radius utility prefixes
const RADIUS_PREFIXES = [
  'rounded',
  'rounded-t',
  'rounded-r',
  'rounded-b',
  'rounded-l',
  'rounded-tl',
  'rounded-tr',
  'rounded-br',
  'rounded-bl',
]

/**
 * Generate color utilities from color tokens
 */
function generateColorUtilities() {
  const utilities = []

  Object.keys(tokens.colors).forEach((colorKey) => {
    // Map camelCase to kebab-case
    const utilityName = colorKey
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')

    COLOR_PREFIXES.forEach((prefix) => {
      utilities.push(`${prefix}-${utilityName}`)

      // Add opacity variants
      if (['bg', 'text', 'border'].includes(prefix)) {
        utilities.push(`${prefix}-${utilityName}/10`)
        utilities.push(`${prefix}-${utilityName}/20`)
        utilities.push(`${prefix}-${utilityName}/30`)
        utilities.push(`${prefix}-${utilityName}/40`)
        utilities.push(`${prefix}-${utilityName}/50`)
        utilities.push(`${prefix}-${utilityName}/60`)
        utilities.push(`${prefix}-${utilityName}/70`)
        utilities.push(`${prefix}-${utilityName}/80`)
        utilities.push(`${prefix}-${utilityName}/90`)
      }

      // Add state modifiers
      if (['bg', 'text', 'border'].includes(prefix)) {
        STATE_MODIFIERS.forEach((modifier) => {
          utilities.push(`${modifier}:${prefix}-${utilityName}`)
        })
      }
    })
  })

  return utilities
}

/**
 * Generate spacing utilities
 */
function generateSpacingUtilities() {
  const utilities = []

  Object.keys(tokens.spacing).forEach((size) => {
    SPACING_PREFIXES.forEach((prefix) => {
      utilities.push(`${prefix}-${size}`)

      if (prefix.startsWith('m')) {
        utilities.push(`-${prefix}-${size}`)
      }
    })
  })

  return utilities
}

/**
 * Generate radius utilities
 */
function generateRadiusUtilities() {
  const utilities = []

  Object.keys(tokens.radii).forEach((size) => {
    RADIUS_PREFIXES.forEach((prefix) => {
      utilities.push(`${prefix}-${size}`)
    })
  })

  return utilities
}

/**
 * Generate shadow utilities
 */
function generateShadowUtilities() {
  const utilities = []

  Object.keys(tokens.shadows).forEach((size) => {
    utilities.push(`shadow-${size}`)
    utilities.push(`hover:shadow-${size}`)
  })

  return utilities
}

/**
 * Generate transition utilities
 */
function generateTransitionUtilities() {
  const utilities = []

  Object.keys(tokens.duration).forEach((speed) => {
    utilities.push(`duration-${speed}`)
  })

  Object.keys(tokens.easing).forEach((ease) => {
    utilities.push(`ease-${ease}`)
  })

  return utilities
}

/**
 * Extract structural utilities
 */
function extractStructuralUtilities() {
  const componentsDir = path.join(__dirname, '../src/components')
  const componentFiles = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'))

  const structuralClasses = new Set()

  // Common structural utilities
  const commonStructural = [
    // Display
    'flex', 'inline-flex', 'grid', 'inline-grid', 'block', 'inline-block', 'inline', 'hidden',

    // Flexbox & Grid
    'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap',
    'items-start', 'items-center', 'items-end', 'items-stretch', 'items-baseline',
    'justify-start', 'justify-center', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly',
    'self-start', 'self-center', 'self-end', 'self-stretch',
    'flex-1', 'flex-auto', 'flex-initial', 'flex-none',
    'grow', 'grow-0', 'shrink', 'shrink-0',

    // Positioning
    'relative', 'absolute', 'fixed', 'sticky', 'static',
    'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50',
    'inset-0',

    // Overflow
    'overflow-hidden', 'overflow-visible', 'overflow-auto', 'overflow-scroll',
    'overflow-x-hidden', 'overflow-y-hidden',
    'overflow-x-auto', 'overflow-y-auto',

    // Sizing
    'w-full', 'w-auto', 'w-screen', 'w-min', 'w-max', 'w-fit',
    'h-full', 'h-auto', 'h-screen', 'h-min', 'h-max', 'h-fit',
    'min-w-0', 'min-h-0',
    'max-w-none', 'max-w-full', 'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl',
    'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg', 'max-w-screen-xl',

    // Text
    'text-left', 'text-center', 'text-right', 'text-justify',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'font-heading', 'font-body', 'font-mono',
    'uppercase', 'lowercase', 'capitalize', 'normal-case',
    'truncate', 'text-ellipsis', 'text-clip',
    'whitespace-normal', 'whitespace-nowrap', 'whitespace-pre', 'whitespace-pre-line', 'whitespace-pre-wrap',
    'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',
    'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',

    // Opacity
    'opacity-0', 'opacity-50', 'opacity-75', 'opacity-80', 'opacity-90', 'opacity-100',

    // Pointer events
    'pointer-events-none', 'pointer-events-auto',

    // Cursor
    'cursor-pointer', 'cursor-default', 'cursor-not-allowed',

    // User select
    'select-none', 'select-text', 'select-all', 'select-auto',

    // Transitions
    'transition', 'transition-all', 'transition-colors', 'transition-opacity', 'transition-transform',

    // Transforms
    'transform', 'scale-100', 'scale-105', 'scale-110',
    'translate-x-0', 'translate-y-0', '-translate-x-1/2', '-translate-y-1/2',
    'translate-x-5',
    'rotate-0', 'rotate-45', 'rotate-90', 'rotate-180',

    // Appearance
    'appearance-none',

    // Outline
    'outline-none', 'outline',
    'focus:outline-none', 'focus-visible:outline-none',

    // Ring
    'ring-0', 'ring-1', 'ring-2', 'ring-4',
    'ring-inset',
    'focus:ring-1', 'focus:ring-2',
    'focus-visible:ring-1', 'focus-visible:ring-2',
    'ring-offset-1', 'ring-offset-2',

    // Backdrop
    'backdrop-blur', 'backdrop-blur-sm', 'backdrop-blur-md', 'backdrop-blur-lg',

    // Shadow
    'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-none',

    // Border
    'border', 'border-0', 'border-2', 'border-4',
    'border-t', 'border-r', 'border-b', 'border-l',
    'border-t-0', 'border-r-0', 'border-b-0', 'border-l-0',
    'border-t-2', 'border-r-2', 'border-b-2', 'border-l-2',
    'border-t-4', 'border-r-4', 'border-b-4', 'border-l-4',

    // Animations
    'animate-pulse', 'animate-spin', 'animate-ping', 'animate-bounce',

    // Rounded (structural, not from tokens)
    'rounded-none', 'rounded-full',
  ]

  commonStructural.forEach((cls) => structuralClasses.add(cls))

  // Extract from component files
  componentFiles.forEach((file) => {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8')
    const classNameMatches = content.matchAll(/className=["'`]([^"'`]+)["'`]/g)

    for (const match of classNameMatches) {
      const classes = match[1].split(/\s+/)
      classes.forEach((cls) => {
        // Skip custom component classes
        if (cls && !cls.startsWith('btn') && !cls.startsWith('card') && !cls.startsWith('input') &&
            !cls.startsWith('badge') && !cls.startsWith('avatar') && !cls.startsWith('label') &&
            !cls.startsWith('alert') && !cls.startsWith('modal') && !cls.startsWith('tooltip') &&
            !cls.startsWith('select') && !cls.startsWith('textarea') && !cls.startsWith('checkbox') &&
            !cls.startsWith('radio') && !cls.startsWith('switch') && !cls.startsWith('divider')) {
          structuralClasses.add(cls)
        }
      })
    }
  })

  return Array.from(structuralClasses).sort()
}

/**
 * Generate the safelist file
 */
function generateSafelistFile() {
  console.log('🔨 Generating safelist from design tokens...\n')

  const tokenUtilities = [
    ...generateColorUtilities(),
    ...generateSpacingUtilities(),
    ...generateRadiusUtilities(),
    ...generateShadowUtilities(),
    ...generateTransitionUtilities(),
  ]

  const structuralUtilities = extractStructuralUtilities()

  console.log(`✅ Generated ${tokenUtilities.length} token-derived utilities`)
  console.log(`✅ Extracted ${structuralUtilities.length} structural utilities`)

  // Generate output file
  const outputDir = path.join(__dirname, '../src/generated')
  const outputFile = path.join(outputDir, 'safelist.ts')

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true})
  }

  const fileContent = `// Auto-generated by scripts/generate-safelist.js
// DO NOT EDIT MANUALLY - Run 'npm run generate:safelist' to regenerate

/**
 * Token-derived utilities
 *
 * All Tailwind utility classes generated from design tokens.
 * These ensure every token value is available as a utility.
 */
export const tokenSafelist = [
${tokenUtilities.map((u) => `  '${u}',`).join('\n')}
]

/**
 * Structural utilities
 *
 * Layout and structural utilities extracted from components.
 * These don't map to tokens but are needed for component structure.
 */
export const structuralSafelist = [
${structuralUtilities.map((u) => `  '${u}',`).join('\n')}
]

/**
 * Complete safelist for Tailwind preset
 *
 * This safelist ensures all component classes are generated even when
 * Tailwind only scans the consumer's source files (not node_modules).
 */
export const aureliusSafelist = [...tokenSafelist, ...structuralSafelist]
`

  fs.writeFileSync(outputFile, fileContent, 'utf-8')

  console.log(`\n✅ Generated ${outputFile}`)
  console.log(`   Total safelist entries: ${tokenUtilities.length + structuralUtilities.length}\n`)
}

// Run the generator
generateSafelistFile()
