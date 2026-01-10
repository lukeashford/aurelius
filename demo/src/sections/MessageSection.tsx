import React from 'react'
import {
  Message,
  type MessageVariant
} from '@lukeashford/aurelius'
import Section from './Section'

const variants: Array<{ variant: MessageVariant, label: string }> = [
  {variant: 'assistant', label: 'Assistant'},
  {variant: 'user', label: 'User'}
]

export default function MessageSection() {
  return (
      <Section
          title="Messages"
          subtitle="Chat message components for conversational interfaces."
      >
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Variants</h3>
            <div className="space-y-3">
              {variants.map(({variant, label}) => (
                  <div key={variant} className="space-y-3">
                    <label className="block text-sm text-silver">{label}</label>
                    <Message
                        variant={variant}
                        content={`This is the ${label.toLowerCase()} message variant. It demonstrates the styling for this variant.`}
                    />
                  </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
  )
}
