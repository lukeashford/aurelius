import React, {useState, useCallback, useRef} from 'react'
import {
  ChatInterface,
  type ChatMessage,
  type Conversation,
} from '@lukeashford/aurelius'

// Mock response content for the first message (no artifacts)
const FIRST_RESPONSE = `<p>Thanks for your message! I'm here to demonstrate the chat interface capabilities.</p>
<p>This is a <strong>production-grade chat experience</strong> with several key features:</p>
<ul>
<li><strong>Smart scrolling</strong> — Your message anchors to the top, my response streams below</li>
<li><strong>Collapsible sidebar</strong> — Click the collapse button on the left</li>
<li><strong>Artifacts panel</strong> — Will appear when I send rich content</li>
</ul>
<p>Send another message to see the <em>artifacts panel</em> in action!</p>`

// Mock response content for the second message (with artifacts)
const SECOND_RESPONSE = `<p>Great! Now I'll show you the artifacts panel with some rich content.</p>
<p>The panel slides in from the right and can display various types of content including images, videos, and formatted text.</p>
<p>Check out the artifact I've added for you:</p>

:::artifact{type="image" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800" alt="Code visualization" title="Component Architecture" subtitle="A visual guide to structuring your React components"}:::

<p>You can collapse or expand the artifacts panel at any time. Try sending more messages to see how the interface responds!</p>`

// Additional responses
const ADDITIONAL_RESPONSES = [
  `<p>Here's another artifact with a different image:</p>

:::artifact{type="image" src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800" alt="Developer workspace" title="Modern Development" subtitle="Setting up an efficient workspace"}:::

<p>The artifacts panel stacks multiple items vertically with smooth transitions.</p>`,

  `<p>This response demonstrates streaming without artifacts.</p>
<p>Notice how the scroll behavior works:</p>
<ol>
<li>Your message appears and anchors to the top</li>
<li>My response streams in below it</li>
<li>No jarring auto-scroll during generation</li>
</ol>
<p>This mimics the behavior of modern chat interfaces like Claude and ChatGPT.</p>`,

  `<p>Let me show you one more artifact:</p>

:::artifact{type="image" src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800" alt="Coding session" title="Development in Action" subtitle="Building with modern tools and frameworks"}:::

<p>Each artifact can have a title and subtitle for context. The panel supports scrolling when content overflows.</p>`,
]

// Mock conversation history with pre-filled messages
const MOCK_CONVERSATION_MESSAGES: Record<string, ChatMessage[]> = {
  '2': [
    {id: 'prev-user-1', variant: 'user', content: 'How should I structure my components?'},
    {id: 'prev-assistant-1', variant: 'assistant', content: '<p>For component architecture, I recommend:</p><ul><li><strong>Atomic design</strong> — Start with small, reusable atoms</li><li><strong>Composition</strong> — Build complex UIs from simple parts</li><li><strong>Single responsibility</strong> — Each component does one thing well</li></ul>'},
  ],
  '3': [
    {id: 'design-user-1', variant: 'user', content: 'Can you review the current design?'},
    {id: 'design-assistant-1', variant: 'assistant', content: '<p>Looking at the UI, I notice a few things:</p><ol><li>The color palette is cohesive and professional</li><li>Typography hierarchy is clear</li><li>Spacing follows a consistent rhythm</li></ol><p>Overall, it looks great!</p>'},
  ],
  '4': [
    {id: 'bug-user-1', variant: 'user', content: 'There seems to be an issue with the layout'},
    {id: 'bug-assistant-1', variant: 'assistant', content: '<p>Let me investigate. The issue seems to be related to flexbox overflow behavior. Try adding <code>min-width: 0</code> to the flex child that\'s overflowing.</p>'},
    {id: 'bug-user-2', variant: 'user', content: 'That worked, thanks!'},
    {id: 'bug-assistant-2', variant: 'assistant', content: '<p>Glad I could help! This is a common gotcha with flexbox. The default min-width is auto, which can cause unexpected overflow.</p>'},
  ],
}

// Mock conversation history
const MOCK_CONVERSATIONS: Conversation[] = [
  {id: '1', title: 'Current Chat', preview: 'Interactive demo session', timestamp: 'Now', isActive: true},
  {id: '2', title: 'Previous Discussion', preview: 'Component architecture...', timestamp: 'Yesterday'},
  {id: '3', title: 'Design Review', preview: 'Looking at the UI...', timestamp: '2 days ago'},
  {id: '4', title: 'Bug Investigation', preview: 'The issue seems to be...', timestamp: 'Last week'},
]

export default function ChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeConversationId, setActiveConversationId] = useState('1')
  const responseIndexRef = useRef(0)

  // Simulate streaming a response character by character
  const streamResponse = useCallback((response: string, onComplete: () => void) => {
    let currentIndex = 0
    const messageId = `assistant-${Date.now()}`

    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      {id: messageId, variant: 'assistant', content: '', isStreaming: true},
    ])

    const interval = setInterval(() => {
      if (currentIndex < response.length) {
        const chunk = response.slice(0, currentIndex + 1)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? {...msg, content: chunk} : msg
          )
        )
        currentIndex++
      } else {
        clearInterval(interval)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? {...msg, isStreaming: false} : msg
          )
        )
        onComplete()
      }
    }, 15) // Fast streaming for demo

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = useCallback(
    (message: string) => {
      if (isStreaming) return

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        variant: 'user',
        content: message,
      }
      setMessages((prev) => [...prev, userMessage])
      setIsStreaming(true)

      // Small delay before starting response
      setTimeout(() => {
        let response: string

        if (responseIndexRef.current === 0) {
          response = FIRST_RESPONSE
        } else if (responseIndexRef.current === 1) {
          response = SECOND_RESPONSE
        } else {
          // Cycle through additional responses
          const additionalIndex = (responseIndexRef.current - 2) % ADDITIONAL_RESPONSES.length
          response = ADDITIONAL_RESPONSES[additionalIndex]
        }

        responseIndexRef.current++

        streamResponse(response, () => {
          setIsStreaming(false)
        })
      }, 300)
    },
    [isStreaming, streamResponse]
  )

  const handleNewChat = useCallback(() => {
    const newId = `chat-${Date.now()}`
    setMessages([])
    responseIndexRef.current = 0
    setActiveConversationId(newId)

    // Add new chat to conversations
    const newChat: Conversation = {
      id: newId,
      title: 'New Chat',
      preview: 'Start typing...',
      timestamp: 'Now',
      isActive: true,
    }

    setConversations((prev) =>
      [newChat, ...prev.map((c) => ({...c, isActive: false}))].slice(0, 5)
    )
  }, [])

  const handleSelectConversation = useCallback((id: string) => {
    if (id === activeConversationId) return

    setActiveConversationId(id)
    responseIndexRef.current = 0

    // Load mock messages for the selected conversation
    const mockMessages = MOCK_CONVERSATION_MESSAGES[id] || []
    setMessages(mockMessages)

    // Update conversations to mark the selected one as active
    setConversations((prev) =>
      prev.map((c) => ({...c, isActive: c.id === id}))
    )
  }, [activeConversationId])

  const handleBack = useCallback(() => {
    window.location.hash = ''
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col bg-obsidian">
      {/* Header */}
      <header className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-ash/40 bg-charcoal/50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-silver hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Back to Docs</span>
          </button>
          <div className="h-6 w-px bg-ash/40" />
          <h1 className="text-lg font-semibold text-white">Chat Interface Demo</h1>
        </div>
        <p className="text-sm text-silver hidden sm:block">
          Type anything to interact with the mock assistant
        </p>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          conversations={conversations}
          onMessageSubmit={handleSubmit}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          isStreaming={isStreaming}
          placeholder="Send a message..."
          emptyStateHelper="Type anything to see a sample response"
        />
      </div>
    </div>
  )
}
