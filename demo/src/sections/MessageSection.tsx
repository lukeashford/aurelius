import React, {useEffect, useRef, useState} from 'react'
import {
  ChatHistory,
  type ChatHistoryItem,
  Message,
  type MessageVariant
} from '@lukeashford/aurelius'
import Section from './Section'

const variants: Array<{ variant: MessageVariant, label: string }> = [
  {variant: 'assistant', label: 'Assistant'},
  {variant: 'user', label: 'User'}
]

const styledStreamingResponse = `<p>Longer messages work <strong>perfectly fine</strong>. Here's what you can do:</p>
<ul>
<li><em>Multiple paragraphs</em> are fully supported</li>
<li>The component <strong>expands</strong> to fit content</li>
<li>Maximum width ensures <em>readability</em></li>
</ul>
<p>You can include <strong>any styled content</strong> you need!</p>`

export default function MessageSection() {
  const [streamedContent, setStreamedContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Smooth scroll container to bottom when content changes
  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current

      if (typeof el.scrollTo === 'function') {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        })
      } else {
        el.scrollTop = el.scrollHeight
      }
    }
  }, [streamedContent])

  // Start streaming on mount and when cycleKey changes
  useEffect(() => {
    let currentIndex = 0
    setStreamedContent('')
    setIsStreaming(true)

    const streamInterval = setInterval(() => {
      if (currentIndex < styledStreamingResponse.length) {
        setStreamedContent(styledStreamingResponse.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsStreaming(false)
        clearInterval(streamInterval)
      }
    }, 20)

    return () => clearInterval(streamInterval)
  }, [cycleKey])

  // Separate effect for restarting after pause
  useEffect(() => {
    if (!isStreaming && streamedContent.length > 0) {
      const restartTimeout = setTimeout(() => {
        setCycleKey(k => k + 1)
      }, 3000)

      return () => clearTimeout(restartTimeout)
    }
  }, [isStreaming, streamedContent.length])

  const conversation: ChatHistoryItem[] = [
    {
      id: 'user-1',
      variant: 'user',
      content: 'Hello! Can you help me understand how to use this component?'
    },
    {
      id: 'assistant-1',
      variant: 'assistant',
      content:
          'Of course! The Message component is designed for chat interfaces. It supports different variants for user and assistant messages, and automatically aligns them appropriately.'
    },
    {
      id: 'user-2',
      variant: 'user',
      content: "That's great! What about longer messages with multiple paragraphs?"
    },
    {
      id: 'assistant-2',
      variant: 'assistant',
      content: streamedContent,
      isStreaming
    },
  ]

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

          <div>
            <h3 className="text-lg font-semibold mb-4">Conversation Example</h3>
            <div
                ref={scrollRef}
                className="bg-charcoal/50 border border-ash/40 p-4 h-96 overflow-y-auto flex flex-col"
            >
              <ChatHistory messages={conversation} className="mt-auto"/>
            </div>
          </div>
        </div>
      </Section>
  )
}