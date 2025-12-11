import React from 'react'
import { Badge, type BadgeVariant } from '@lukeashford/aurelius'

const variants: BadgeVariant[] = ['default', 'gold', 'success', 'error', 'warning', 'info']

export default function BadgesSection() {
  return (
    <div>
      <header className="mb-4">
        <h2 className="text-2xl">Badges</h2>
        <p className="text-silver">Inline status and metadata indicators.</p>
      </header>

      <div className="flex flex-wrap gap-3">
        {variants.map(v => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </div>
    </div>
  )
}
