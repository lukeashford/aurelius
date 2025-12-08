import React from 'react'
import {Card} from '@lukeashford/aurelius'

type Tokens = Record<string, string>

const families: Record<string, string[]> = {
  Black: ['void', 'obsidian', 'charcoal', 'graphite', 'slate', 'ash'],
  Gold: ['gold', 'goldLight', 'goldBright', 'goldMuted', 'goldPale'],
  Neutrals: ['white', 'silver', 'zinc', 'dim'],
  Semantic: [
    'success',
    'successMuted',
    'error',
    'errorMuted',
    'warning',
    'warningMuted',
    'info',
    'infoMuted',
  ],
}

// Explicit mapping so Tailwind JIT can see every class as a literal
const bgClasses: Record<string, string> = {
  void: 'bg-void',
  obsidian: 'bg-obsidian',
  charcoal: 'bg-charcoal',
  graphite: 'bg-graphite',
  slate: 'bg-slate',
  ash: 'bg-ash',

  gold: 'bg-gold',
  goldLight: 'bg-gold-light',
  goldBright: 'bg-gold-bright',
  goldMuted: 'bg-gold-muted',
  goldPale: 'bg-gold-pale',

  white: 'bg-white',
  silver: 'bg-silver',
  zinc: 'bg-zinc',
  dim: 'bg-dim',

  success: 'bg-success',
  successMuted: 'bg-success-muted',
  error: 'bg-error',
  errorMuted: 'bg-error-muted',
  warning: 'bg-warning',
  warningMuted: 'bg-warning-muted',
  info: 'bg-info',
  infoMuted: 'bg-info-muted',
}

export default function ColorsSection({tokens}: { tokens: Tokens }) {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Colors</h2>
          <p className="text-silver">
            Core palette organized by family. Utilities reflect Tailwind preset names.
          </p>
        </header>

        <div className="space-y-10">
          {Object.entries(families).map(([family, keys]) => (
              <div key={family}>
                <h3 className="mb-4 text-lg text-gold">{family}</h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  {keys.map((k) => {
                    const value = tokens[k]
                    const className = bgClasses[k] || ''

                    return (
                        <Card key={k} className="p-3">
                          <div className={`h-16 w-full rounded-lg ${className}`}/>
                          <div className="mt-2 text-sm">
                            <div className="font-mono text-white">{k}</div>
                            <div className="text-silver">{value}</div>
                            <div className="text-xs text-silver/80">.{className}</div>
                          </div>
                        </Card>
                    )
                  })}
                </div>
              </div>
          ))}
        </div>
      </div>
  )
}
