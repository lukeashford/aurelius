import React from 'react'
import { Card, Stack, Divider } from '@lukeashford/aurelius'
import Section from './Section'

export default function LayoutSection() {
  return (
    <Section
      className="space-y-8"
      title="Layout"
      subtitle="Components for organizing content and structure."
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Stack */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Stack</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-silver mb-2">Vertical Stack (default)</p>
              <Stack gap={2} className="bg-graphite p-4">
                <div className="bg-charcoal p-2 text-sm">Item 1</div>
                <div className="bg-charcoal p-2 text-sm">Item 2</div>
                <div className="bg-charcoal p-2 text-sm">Item 3</div>
              </Stack>
            </div>
            <div>
              <p className="text-sm text-silver mb-2">Horizontal Stack</p>
              <Stack direction="horizontal" gap={4} align="center" className="bg-graphite p-4">
                <div className="bg-charcoal p-2 text-sm">Item 1</div>
                <div className="bg-charcoal p-2 text-sm">Item 2</div>
                <div className="bg-charcoal p-2 text-sm">Item 3</div>
              </Stack>
            </div>
          </div>
        </Card>

        {/* Divider */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Divider</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-silver mb-2">Horizontal (default)</p>
              <div className="space-y-2">
                <p className="text-sm">Content above</p>
                <Divider />
                <p className="text-sm">Content below</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-silver mb-2">With label</p>
              <Divider label="OR" />
            </div>
            <div>
              <p className="text-sm text-silver mb-2">Vertical</p>
              <div className="flex items-center gap-4 h-8">
                <span className="text-sm">Left</span>
                <Divider orientation="vertical" />
                <span className="text-sm">Right</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  )
}
