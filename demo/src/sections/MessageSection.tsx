import React from 'react'
import {Message, type MessageVariant} from '@lukeashford/aurelius'

const variants: MessageVariant[] = ['user', 'sent', 'assistant', 'received']

export default function MessageSection() {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Messages</h2>
          <p className="text-silver">Chat message components for conversational interfaces.</p>
        </header>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Variants</h3>
            <div className="space-y-3">
              {variants.map(variant => (
                  <div key={variant}>
                    <p className="text-silver text-sm mb-2 font-mono">{variant}</p>
                    <Message variant={variant}>
                      This is a {variant} message. It demonstrates the styling for this variant.
                    </Message>
                  </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Conversation Example</h3>
            <div className="space-y-3 max-w-4xl">
              <Message variant="user">
                Hello! Can you help me understand how to use this component?
              </Message>
              <Message variant="assistant">
                Of course! The Message component is designed for chat interfaces. It supports
                different
                variants for user and assistant messages, and automatically aligns them
                appropriately.
              </Message>
              <Message variant="user">
                That's great! What about longer messages with multiple paragraphs?
              </Message>
              <Message variant="assistant">
                Longer messages work perfectly fine. The component will expand to fit the content
                while
                maintaining the maximum width constraint. This ensures readability even with
                extensive text.
                You can include any content you need within the message.
              </Message>
            </div>
          </div>
        </div>
      </div>
  )
}
