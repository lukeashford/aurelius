import React from 'react'
import {Badge, type BadgeVariant} from '@lukeashford/aurelius'
import Section from './Section'

const variants: BadgeVariant[] = ['default', 'gold', 'success', 'error', 'warning', 'info']

export default function BadgesSection() {
  return (
      <Section title="Badges" subtitle="Inline status and metadata indicators.">
        <div className="flex flex-wrap gap-3">
          {variants.map(v => (
              <Badge key={v} variant={v}>
                {v}
              </Badge>
          ))}
        </div>
      </Section>
  )
}
