import React from 'react'
import {Card} from '@lukeashford/aurelius'
import Section from './Section'

// Hard-coded stacks to mirror your Tailwind config
const headingStack = '"Marcellus", serif'
const bodyStack = '"Raleway", system-ui, sans-serif'
const monoStack =
    '"JetBrains Mono", "Fira Code", "SF Mono", monospace'

// Font size scale mapped to utilities
const fontSizes = [
  {
    token: 'fontSize.xs',
    utility: 'text-xs',
    size: '0.75rem',
    lineHeight: '1rem',
    className: 'text-xs',
  },
  {
    token: 'fontSize.sm',
    utility: 'text-sm',
    size: '0.875rem',
    lineHeight: '1.25rem',
    className: 'text-sm',
  },
  {
    token: 'fontSize.base',
    utility: 'text-base',
    size: '1rem',
    lineHeight: '1.5rem',
    className: 'text-base',
  },
  {
    token: 'fontSize.lg',
    utility: 'text-lg',
    size: '1.125rem',
    lineHeight: '1.75rem',
    className: 'text-lg',
  },
  {
    token: 'fontSize.xl',
    utility: 'text-xl',
    size: '1.25rem',
    lineHeight: '1.75rem',
    className: 'text-xl',
  },
  {
    token: 'fontSize.2xl',
    utility: 'text-2xl',
    size: '1.5rem',
    lineHeight: '2rem',
    className: 'text-2xl',
  },
  {
    token: 'fontSize.3xl',
    utility: 'text-3xl',
    size: '1.875rem',
    lineHeight: '2.25rem',
    className: 'text-3xl',
  },
  {
    token: 'fontSize.4xl',
    utility: 'text-4xl',
    size: '2.25rem',
    lineHeight: '2.5rem',
    className: 'text-4xl',
  },
  {
    token: 'fontSize.5xl',
    utility: 'text-5xl',
    size: '3rem',
    lineHeight: '1',
    className: 'text-5xl',
  },
  {
    token: 'fontSize.6xl',
    utility: 'text-6xl',
    size: '3.75rem',
    lineHeight: '1',
    className: 'text-6xl',
  },
]

// Weights, line heights, and tracking mapped to utilities
const fontWeights = [
  {token: 'fontWeight.normal', utility: 'font-normal', value: '400'},
  {token: 'fontWeight.medium', utility: 'font-medium', value: '500'},
  {token: 'fontWeight.semibold', utility: 'font-semibold', value: '600'},
  {token: 'fontWeight.bold', utility: 'font-bold', value: '700'},
]

const lineHeights = [
  {token: 'lineHeight.none', utility: 'leading-none', value: '1'},
  {token: 'lineHeight.tight', utility: 'leading-tight', value: '1.25'},
  {token: 'lineHeight.snug', utility: 'leading-snug', value: '1.375'},
  {token: 'lineHeight.normal', utility: 'leading-normal', value: '1.5'},
  {token: 'lineHeight.relaxed', utility: 'leading-relaxed', value: '1.625'},
  {token: 'lineHeight.loose', utility: 'leading-loose', value: '2'},
]

const letterSpacings = [
  {token: 'letterSpacing.tighter', utility: 'tracking-tighter', value: '-0.05em'},
  {token: 'letterSpacing.tight', utility: 'tracking-tight', value: '-0.025em'},
  {token: 'letterSpacing.normal', utility: 'tracking-normal', value: '0'},
  {token: 'letterSpacing.wide', utility: 'tracking-wide', value: '0.025em'},
  {token: 'letterSpacing.wider', utility: 'tracking-wider', value: '0.05em'},
  {token: 'letterSpacing.widest', utility: 'tracking-widest', value: '0.1em'},
]

const tokenCardClass =
    'rounded-md border border-slate/60 bg-void/40 p-3'

export default function TypographySection() {
  return (
      <Section
          title="Typography"
          subtitle="Font stacks and type scale used throughout the system."
      >
        {/* Top row: headings + body/mono */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-2 text-gold">Headings</h3>
            <div className="space-y-2">
              <h1>Heading One — H1</h1>
              <h2>Heading Two — H2</h2>
              <h3>Heading Three — H3</h3>
              <h4>Heading Four — H4</h4>
              <h5>Heading Five — H5</h5>
              <h6>Heading Six — H6</h6>
            </div>
            <div className="mt-4 text-sm text-silver">
              Stack:{' '}
              <code className="text-white">
                {headingStack}
              </code>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-2 text-gold">Body &amp; Mono</h3>
            <p className="text-base text-white">
              Body text — clear, warm, and readable. Supports semantic emphasis
              like <strong>bold</strong> and
              <em> italic</em>.
            </p>
            <p className="mt-2 text-silver">
              Secondary body text with reduced contrast for supportive content.
            </p>
            <pre className="mt-4 rounded-md bg-slate p-3 text-silver">
            <code>{`const greet = (name: string) => {
  return \`Hello, \${name}!\`
}`}</code>
          </pre>
            <div className="mt-4 space-y-1 text-sm text-silver">
              <div>
                Body Stack:{' '}
                <code className="text-white">
                  {bodyStack}
                </code>
              </div>
              <div>
                Mono Stack:{' '}
                <code className="text-white">
                  {monoStack}
                </code>
              </div>
            </div>
          </Card>

          {/* Sizes card spanning both columns */}
          <Card className="md:col-span-2 p-6">
            <h3 className="mb-2 text-gold">Font Sizes</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {fontSizes.map(({token, utility, size, lineHeight, className}) => (
                  <Card
                      key={token}
                      className={tokenCardClass}
                  >
                    <div className={`mb-2 font-heading ${className}`}>Aa</div>
                    <div className="space-y-1 text-xs text-silver">
                      <div className="font-mono text-white">{token}</div>
                      <div>
                        {size} / {lineHeight}
                      </div>
                      <div className="text-silver/80">.{utility}</div>
                    </div>
                  </Card>
              ))}
            </div>
          </Card>

          {/* Font weight */}
          <Card className="md:col-span-2 p-6">
            <h3 className="mb-4 text-gold">Font Weight</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {fontWeights.map(({token, utility, value}) => (
                  <Card
                      key={token}
                      className={tokenCardClass}
                  >
                    <div className={`mb-2 text-base ${utility}`}>
                      Aa — The quick brown fox
                    </div>
                    <div className="space-y-1 text-xs text-silver">
                      <div className="font-mono text-white">{token}</div>
                      <div>Weight: {value}</div>
                      <div className="text-silver/80">.{utility}</div>
                    </div>
                  </Card>
              ))}
            </div>
          </Card>

          {/* Line height */}
          <Card className="md:col-span-2 p-6">
            <h3 className="mb-4 text-gold">Line Height</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {lineHeights.map(({token, utility, value}) => (
                  <Card
                      key={token}
                      className={tokenCardClass}
                  >
                    <div className={`mb-2 text-base ${utility}`}>
                      Aa — The quick brown fox jumps over the lazy dog.
                    </div>
                    <div className="space-y-1 text-xs text-silver">
                      <div className="font-mono text-white">{token}</div>
                      <div>Line height: {value}</div>
                      <div className="text-silver/80">.{utility}</div>
                    </div>
                  </Card>
              ))}
            </div>
          </Card>

          {/* Letter spacing */}
          <Card className="md:col-span-2 p-6">
            <h3 className="mb-4 text-gold">Letter Spacing</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {letterSpacings.map(({token, utility, value}) => (
                  <Card
                      key={token}
                      className={tokenCardClass}
                  >
                    <div className={`mb-2 text-base ${utility}`}>
                      Aa — Tracking sample
                    </div>
                    <div className="space-y-1 text-xs text-silver">
                      <div className="font-mono text-white">{token}</div>
                      <div>Letter spacing: {value}</div>
                      <div className="text-silver/80">.{utility}</div>
                    </div>
                  </Card>
              ))}
            </div>
          </Card>
        </div>
      </Section>
  )
}
