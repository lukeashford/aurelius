import React from 'react'
import {Card} from '@lukeashford/aurelius'

type Tokens = Record<string, string>

function toKebab(key: string) {
  return key
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/_/g, '-')
  .toLowerCase()
}

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

export default function ColorsSection({tokens}: { tokens: Tokens }) {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Colors</h2>
          <p className="text-silver">Core palette organized by family. Utilities reflect Tailwind
            preset names.</p>
        </header>

        <div className="space-y-10">
          {Object.entries(families).map(([family, keys]) => (
              <div key={family}>
                <h3 className="mb-4 text-lg text-gold">{family}</h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  {keys.map(k => {
                    const value = tokens[k]

                    // Compute class more simply based on preset shape
                    const className =
                        k === 'gold'
                            ? 'bg-gold'
                            : k.startsWith('gold')
                                ? `bg-gold-${toKebab(k.replace('gold', ''))}`
                                : ['success', 'error', 'warning', 'info'].some(n => k.startsWith(n))
                                    ? `bg-${toKebab(k)}`
                                    : `bg-${toKebab(k)}`

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
