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
          {/* Basic Variants */}
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

          {/* With Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">With Actions</h3>
            <p className="text-sm text-silver mb-4">
              Messages can have action buttons for copy, edit (user), and retry (assistant).
            </p>
            <div className="space-y-4">
              <Message
                  variant="user"
                  content="This user message has actions. Try the copy and edit buttons below."
                  actions={{
                    showCopy: true,
                    onEdit: (newContent) => {
                      console.log('Edit submitted:', newContent)
                      alert(`Edit submitted: "${newContent}"`)
                    },
                  }}
              />
              <Message
                  variant="assistant"
                  content="This assistant message has actions. You can copy or retry this response."
                  actions={{
                    showCopy: true,
                    onRetry: () => {
                      console.log('Retry clicked')
                      alert('Retry clicked!')
                    },
                  }}
              />
            </div>
          </div>

          {/* With Branch Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">With Branch Navigation</h3>
            <p className="text-sm text-silver mb-4">
              When a message has multiple branches (from edits or retries), a branch navigator appears.
            </p>
            <div className="space-y-4">
              <Message
                  variant="assistant"
                  content="This message is part of a branched conversation. Use the navigator to switch between alternate responses."
                  actions={{
                    showCopy: true,
                    onRetry: () => console.log('Retry'),
                  }}
                  branchInfo={{
                    current: 1,
                    total: 3,
                    onPrevious: () => console.log('Previous branch'),
                    onNext: () => console.log('Next branch'),
                  }}
              />
            </div>
          </div>

          {/* Streaming State */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Streaming</h3>
            <p className="text-sm text-silver mb-4">
              During streaming, a cursor is shown and actions are hidden.
            </p>
            <Message
                variant="assistant"
                content="This message is currently streaming"
                isStreaming={true}
                actions={{
                  showCopy: true,
                  onRetry: () => {},
                }}
            />
          </div>
        </div>
      </Section>
  )
}
