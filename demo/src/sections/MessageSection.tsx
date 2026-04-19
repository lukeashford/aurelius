import React, {useState} from 'react'
import {Message, type MessageVariant} from '@lukeashford/aurelius'
import Section from './Section'

const FeedbackForm = () => {
  const [rating, setRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')

  return (
      <div className="space-y-4">
        <p className="text-sm text-white">How would you rate this task?</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
              <button
                  key={r}
                  onClick={() => setRating(r)}
                  className={`w-8 h-8 border border-ash flex items-center justify-center transition-colors ${rating
                  === r ? "bg-gold text-obsidian border-gold" : "hover:bg-white/10 text-white"}`}
              >
                {r}
              </button>
          ))}
        </div>
        <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Optional feedback..."
            className="w-full bg-obsidian border border-ash p-2 text-sm text-white"
        />
        <button
            onClick={() => alert(`Submitted: ${rating}, feedback: ${feedback}`)}
            className="bg-gold text-obsidian px-3 py-1.5 text-sm font-medium"
        >
          Submit
        </button>
      </div>
  )
}

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

          {/* Custom Content Example */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Custom Content</h3>
            <p className="text-sm text-silver mb-4">
              Messages can also render custom React nodes instead of text content.
            </p>
            <Message
                variant="assistant"
                content={<FeedbackForm/>}
            />
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
              When a message has multiple branches (from edits or retries), a branch navigator
              appears.
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
                  onRetry: () => {
                  },
                }}
            />
          </div>
        </div>
      </Section>
  )
}
