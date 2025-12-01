import React from 'react'
import {Card} from '@lukeashford/aurelius'

type Typography = any

export default function TypographySection({tokens}: { tokens: Typography }) {
  const body = (tokens.fontBody || ['Inter', 'system-ui']).join(', ')
  const heading = (tokens.fontHeading || ['Plus Jakarta Sans', 'Inter']).join(', ')
  const mono = (tokens.fontMono || ['JetBrains Mono', 'monospace']).join(', ')

  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Typography</h2>
          <p className="text-silver">Font stacks and type scale used throughout the system.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-gold mb-2">Headings</h3>
            <div className="space-y-2">
              <h1>Heading One — H1</h1>
              <h2>Heading Two — H2</h2>
              <h3>Heading Three — H3</h3>
              <h4>Heading Four — H4</h4>
              <h5>Heading Five — H5</h5>
              <h6>Heading Six — H6</h6>
            </div>
            <div className="mt-4 text-sm text-silver">
              Stack: <code className="text-white">{heading}</code>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gold mb-2">Body & Mono</h3>
            <p className="text-base text-white">
              Body text — clear, warm, and readable. Supports semantic emphasis
              like <strong>bold</strong> and
              <em> italic</em>.
            </p>
            <p className="mt-2 text-silver">
              Secondary body text with reduced contrast for supportive content.
            </p>
            <pre className="mt-4 rounded-md bg-slate p-3 text-silver"><code>{`const greet = (name: string) => {
  return \`Hello, \${name}!\`
}`}</code></pre>
            <div className="mt-4 text-sm text-silver space-y-1">
              <div>Body Stack: <code className="text-white">{body}</code></div>
              <div>Mono Stack: <code className="text-white">{mono}</code></div>
            </div>
          </Card>
        </div>
      </div>
  )
}
