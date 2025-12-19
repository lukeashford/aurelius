import React from 'react'
import {Card} from '@lukeashford/aurelius'
import Section from './Section'

export default function CardsSection() {
  return (
      <Section title="Cards" subtitle="Surface variations for content grouping.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-5">
            <h4 className="mb-2">Default</h4>
            <p className="text-silver">Neutral surface for general content.</p>
          </Card>

          <Card variant="elevated" className="p-5">
            <h4 className="mb-2">Elevated</h4>
            <p className="text-silver">Raised surface with shadow.</p>
          </Card>

          <Card variant="outlined" className="p-5">
            <h4 className="mb-2">Outlined</h4>
            <p className="text-silver">Subtle outline and reduced elevation.</p>
          </Card>

          <Card variant="featured" className="p-5">
            <h4 className="mb-2">Featured</h4>
            <p className="text-silver">Highlight style for important content.</p>
          </Card>

          <Card variant="ghost" className="p-5">
            <h4 className="mb-2">Ghost</h4>
            <p className="text-silver">Transparent background with no shadow.</p>
          </Card>

          <Card interactive className="p-5">
            <h4 className="mb-2">Interactive</h4>
            <p className="text-silver">Hover to see interactive elevation/border.</p>
          </Card>
        </div>
      </Section>
  )
}
