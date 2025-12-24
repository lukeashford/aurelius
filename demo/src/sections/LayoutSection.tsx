import React from 'react'
import { Card, Stack, Divider, Container, Row, Col } from '@lukeashford/aurelius'
import Section from './Section'

export default function LayoutSection() {
  return (
    <Section
      className="space-y-8"
      title="Layout"
      subtitle="Components for organizing content and structure."
    >
      <div className="space-y-8">
        {/* Container */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Container</h3>
          <p className="text-sm text-silver">
            Responsive max-width wrapper that centers content with consistent
            horizontal padding.
          </p>
          <div className="bg-graphite p-4">
            <Container size="md" className="bg-charcoal p-4">
              <p className="text-sm text-center">
                Container (md) - Max width 768px
              </p>
            </Container>
          </div>
        </Card>

        {/* Row & Col Grid System */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Grid System (Row & Col)</h3>
          <p className="text-sm text-silver">
            12-column CSS Grid system with responsive breakpoints.
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-zinc mb-2">Equal columns</p>
              <Row gutter={4}>
                <Col span={4}>
                  <div className="bg-gold/20 border border-gold/30 p-3 text-sm text-center">
                    4 cols
                  </div>
                </Col>
                <Col span={4}>
                  <div className="bg-gold/20 border border-gold/30 p-3 text-sm text-center">
                    4 cols
                  </div>
                </Col>
                <Col span={4}>
                  <div className="bg-gold/20 border border-gold/30 p-3 text-sm text-center">
                    4 cols
                  </div>
                </Col>
              </Row>
            </div>
            <div>
              <p className="text-xs text-zinc mb-2">Responsive columns</p>
              <Row gutter={4}>
                <Col span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="bg-charcoal border border-ash p-3 text-sm text-center">
                    12 → 6 → 3
                  </div>
                </Col>
                <Col span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="bg-charcoal border border-ash p-3 text-sm text-center">
                    12 → 6 → 3
                  </div>
                </Col>
                <Col span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="bg-charcoal border border-ash p-3 text-sm text-center">
                    12 → 6 → 3
                  </div>
                </Col>
                <Col span={{ base: 12, md: 6, lg: 3 }}>
                  <div className="bg-charcoal border border-ash p-3 text-sm text-center">
                    12 → 6 → 3
                  </div>
                </Col>
              </Row>
            </div>
            <div>
              <p className="text-xs text-zinc mb-2">Mixed widths with offset</p>
              <Row gutter={4}>
                <Col span={3}>
                  <div className="bg-charcoal border border-ash p-3 text-sm text-center">
                    3 cols
                  </div>
                </Col>
                <Col span={6} offset={3}>
                  <div className="bg-charcoal border border-ash p-3 text-sm text-center">
                    6 cols (offset 3)
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Card>

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
                <Stack
                  direction="horizontal"
                  gap={4}
                  align="center"
                  className="bg-graphite p-4"
                >
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
      </div>
    </Section>
  )
}
