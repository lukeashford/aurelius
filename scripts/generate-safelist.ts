#!/usr/bin/env node

import {readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync} from 'fs'
import {join, resolve} from 'path'
import {colors} from '../src/tokens/colors.js'
import {spacing} from '../src/tokens/spacing.js'
import {radii} from '../src/tokens/radii.js'
import {shadows} from '../src/tokens/shadows.js'
import {duration, easing} from '../src/tokens/transitions.js'

// Get directory paths
const scriptsDir = resolve(__dirname || '.')
const rootDir = resolve(scriptsDir, '..')

/**
 * Generate safelist from design tokens
 *
 * This script generates all Tailwind utility classes that should be available
 * based on our design tokens, plus extracts structural utilities from components.
 */

// Color utility prefixes that should be generated for each color token
const COLOR_PREFIXES = [
  'bg',
  'text',
  'border',
  'ring',
  'fill',
  'stroke',
  'ring-offset',
]

// State modifiers for interactive classes
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
function generateColorUtilities(): string[] {
  const utilities: string[] = []

  // Process each color
  Object.keys(colors).forEach((colorKey) => {
    // Map camelCase token names to kebab-case Tailwind utilities
    const utilityName = colorKey
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')

    // Generate base utilities
    COLOR_PREFIXES.forEach((prefix) => {
      utilities.push(`${prefix}-${utilityName}`)

      // Add opacity variants for backgrounds, text, and borders
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

      // Add state modifiers for interactive properties
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
 * Generate spacing utilities from spacing tokens
 */
function generateSpacingUtilities(): string[] {
  const utilities: string[] = []

  Object.keys(spacing).forEach((size) => {
    SPACING_PREFIXES.forEach((prefix) => {
      utilities.push(`${prefix}-${size}`)

      // Add negative margins
      if (prefix.startsWith('m')) {
        utilities.push(`-${prefix}-${size}`)
      }
    })
  })

  return utilities
}

/**
 * Generate border radius utilities from radii tokens
 */
function generateRadiusUtilities(): string[] {
  const utilities: string[] = []

  Object.keys(radii).forEach((size) => {
    RADIUS_PREFIXES.forEach((prefix) => {
      utilities.push(`${prefix}-${size}`)
    })
  })

  return utilities
}

/**
 * Generate shadow utilities from shadow tokens
 */
function generateShadowUtilities(): string[] {
  const utilities: string[] = []

  Object.keys(shadows).forEach((size) => {
    utilities.push(`shadow-${size}`)
    utilities.push(`hover:shadow-${size}`)
  })

  return utilities
}

/**
 * Generate transition utilities from transition tokens
 */
function generateTransitionUtilities(): string[] {
  const utilities: string[] = []

  // Duration utilities
  Object.keys(duration).forEach((speed) => {
    utilities.push(`duration-${speed}`)
  })

  // Easing utilities
  Object.keys(easing).forEach((ease) => {
    utilities.push(`ease-${ease}`)
  })

  return utilities
}

/**
 * Extract structural utilities from component files
 * These are non-token utilities needed for layout and structure
 */
function extractStructuralUtilities(): string[] {
  const componentsDir = join(rootDir, 'src/components')
  const componentFiles = readdirSync(componentsDir).filter((f: string) => f.endsWith('.tsx'))

  const structuralClasses = new Set<string>()

  // Common structural utilities that components will likely use
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

    // Overflow
    'overflow-hidden', 'overflow-visible', 'overflow-auto', 'overflow-scroll',
    'overflow-x-hidden', 'overflow-y-hidden',
    'overflow-x-auto', 'overflow-y-auto',

    // Sizing
    'w-full', 'w-auto', 'w-screen', 'w-min', 'w-max', 'w-fit',
    'h-full', 'h-auto', 'h-screen', 'h-min', 'h-max', 'h-fit',
    'min-w-0', 'min-h-0',
    'max-w-none', 'max-w-full', 'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg', 'max-w-screen-xl',

    // Text
    'text-left', 'text-center', 'text-right', 'text-justify',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold',
    'font-heading', 'font-body', 'font-mono',
    'uppercase', 'lowercase', 'capitalize', 'normal-case',
    'truncate', 'text-ellipsis', 'text-clip',
    'whitespace-normal', 'whitespace-nowrap', 'whitespace-pre', 'whitespace-pre-line', 'whitespace-pre-wrap',
    'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest',

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
  ]

  commonStructural.forEach((cls) => structuralClasses.add(cls))

  // Also extract from actual component files
  componentFiles.forEach((file: string) => {
    const content = readFileSync(join(componentsDir, file), 'utf-8')

    // Extract classes from className strings
    const classNameMatches = content.matchAll(/className=["'`]([^"'`]+)["'`]/g)
    for (const match of classNameMatches) {
      const classes = match[1].split(/\s+/)
      classes.forEach((cls: string) => {
        // Only include known Tailwind utilities (skip custom classes like 'btn', 'card', etc.)
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
 * Validate components for non-token classes
 * This warns about classes that don't map to our design tokens
 */
function validateComponentClasses(): void {
  const componentsDir = join(rootDir, 'src/components')
  const componentFiles = readdirSync(componentsDir).filter((f: string) => f.endsWith('.tsx'))

  const warnings: Array<{file: string; line: number; class: string}> = []

  // Known custom classes that will be removed during refactor
  const knownCustomClasses = new Set([
    'btn', 'btn-primary', 'btn-important', 'btn-elevated', 'btn-outlined', 'btn-featured', 'btn-ghost', 'btn-danger',
    'btn-sm', 'btn-md', 'btn-lg', 'btn-xl',
    'card', 'card-elevated', 'card-outlined', 'card-featured', 'card-interactive',
    'input', 'input-error',
    'textarea', 'textarea-error',
    'badge', 'badge-default', 'badge-gold', 'badge-success', 'badge-error', 'badge-warning', 'badge-info',
    'avatar', 'avatar-xs', 'avatar-sm', 'avatar-md', 'avatar-lg', 'avatar-xl', 'avatar-2xl',
    'label', 'label-required',
    'select', 'checkbox', 'radio', 'switch', 'switch-thumb',
    'alert', 'alert-info', 'alert-success', 'alert-warning', 'alert-error',
    'modal-backdrop', 'modal-content',
    'tooltip',
  ])

  componentFiles.forEach((file: string) => {
    const filePath = join(componentsDir, file)
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line: string, index: number) => {
      const classNameMatches = line.matchAll(/className=["'`]([^"'`]+)["'`]/g)
      for (const match of classNameMatches) {
        const classes = match[1].split(/\s+/)
        classes.forEach((cls: string) => {
          // Check for arbitrary values (these might be okay, but flag for review)
          if (cls.includes('[') && cls.includes(']') && !cls.includes('data-')) {
            warnings.push({
              file,
              line: index + 1,
              class: cls,
            })
          }

          // Check for known custom classes (expected to be found now, will be removed)
          if (knownCustomClasses.has(cls)) {
            // These are expected for now, will be refactored
            return
          }
        })
      }
    })
  })

  if (warnings.length > 0) {
    console.log('\n⚠️  Potential non-token classes found in components:')
    warnings.forEach(({file, line, class: cls}) => {
      console.log(`   - ${cls} (${file}:${line})`)
    })
    console.log('   Consider using token values instead.\n')
  }
}

/**
 * Generate the complete safelist file
 */
function generateSafelistFile(): void {
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

  // Validate components
  validateComponentClasses()

  // Generate the output file
  const outputDir = join(rootDir, 'src/generated')
  const outputFile = join(outputDir, 'safelist.ts')

  // Ensure directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, {recursive: true})
  }

  const fileContent = `// Auto-generated by scripts/generate-safelist.ts
// DO NOT EDIT MANUALLY - Run 'npm run generate:safelist' to regenerate

/**
 * Token-derived utilities
 *
 * All Tailwind utility classes generated from design tokens.
 * These ensure every token value is available as a utility.
 */
export const tokenSafelist = [
${tokenUtilities.map((u: string) => `  '${u}',`).join('\n')}
]

/**
 * Structural utilities
 *
 * Layout and structural utilities extracted from components.
 * These don't map to tokens but are needed for component structure.
 */
export const structuralSafelist = [
${structuralUtilities.map((u: string) => `  '${u}',`).join('\n')}
]

/**
 * Complete safelist for Tailwind preset
 *
 * This safelist ensures all component classes are generated even when
 * Tailwind only scans the consumer's source files (not node_modules).
 */
export const aureliusSafelist = [...tokenSafelist, ...structuralSafelist]
`

  writeFileSync(outputFile, fileContent, 'utf-8')

  console.log(`\n✅ Generated ${outputFile}`)
  console.log(`   Total safelist entries: ${tokenUtilities.length + structuralUtilities.length}\n`)
}

// Run the generator
generateSafelistFile()
