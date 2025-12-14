import React from 'react'
import {Button, Card, Tooltip} from '@lukeashford/aurelius'

export default function TooltipSection() {
  const [openId, setOpenId] = React.useState<string | null>(null)

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id))

  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Tooltip</h2>
          <p className="text-silver">Simple controlled tooltips demonstrating positioning.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(['top', 'right', 'bottom', 'left'] as const).map(side => (
              <Card key={side} className="p-6 flex items-center justify-center">
                <Tooltip content={`Tooltip on ${side}`} open={openId === side} side={side}>
                  <Button onClick={() => toggle(side)}>Hover {side}</Button>
                </Tooltip>
              </Card>
          ))}
        </div>
      </div>
  )
}
