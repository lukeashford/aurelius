import React, {useCallback, useEffect, useRef, useState} from 'react'
import {
  addMessageToTree,
  type Attachment,
  ChatInterface,
  type Conversation,
  type ConversationTree,
  createEmptyTree,
  generateId,
  updateNodeContent,
} from '@lukeashford/aurelius'

// Mock response content for the first message (no artifacts)
const FIRST_RESPONSE = `<p>Thanks for your message! I'm here to demonstrate the chat interface capabilities.</p>
<p>This is a <strong>production-grade chat experience</strong> with several key features:</p>
<ul>
<li><strong>Smart scrolling</strong> — Your message anchors to the top, my response streams below</li>
<li><strong>Collapsible sidebar</strong> — Click the collapse button on the left</li>
<li><strong>Message actions</strong> — Hover over messages to copy, edit, or retry</li>
<li><strong>File attachments</strong> — Click the paperclip or drag files to attach</li>
</ul>
<p>Try editing this response or sending another message!</p>`

// Mock response content for the second message (with artifacts)
const SECOND_RESPONSE = `<p>Great! Now I'll show you the artifacts panel with some rich content.</p>
<p>The panel slides in from the right and can display various types of content including images, videos, and formatted text.</p>
<p>Check out the artifact I've added for you:</p>

:::artifact{type="image" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800" alt="Code visualization" title="Component Architecture" subtitle="A visual guide to structuring your React components"}:::

<p>You can collapse or expand the artifacts panel at any time. Try sending more messages to see how the interface responds!</p>`

// Slow response for stop demo
const SLOW_RESPONSE = `<p>This is a deliberately slow response to demonstrate the Stop button.</p>
<p>Watch the input area — you'll see a red Stop button appear instead of the Send button while I'm generating.</p>
<p>Click it to stop generation at any point. The partial response will be kept.</p>
<p>This is useful when you want to interrupt a long response or if you realize you asked the wrong question.</p>
<p>The streaming will continue... slowly... so you have time to stop it.</p>
<p>Still going...</p>
<p>And going...</p>
<p>You can stop me anytime!</p>`

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

// Create a pre-populated conversation tree with branches
function createBranchingDemoTree(): ConversationTree {
  let tree = createEmptyTree()

  // Root user message
  tree = addMessageToTree(tree, {
    id: 'branch-user-1',
    role: 'user',
    content: 'What programming language should I learn first?',
    parentId: null,
  }, null)

  // First assistant response
  tree = addMessageToTree(tree, {
    id: 'branch-assistant-1a',
    role: 'assistant',
    content: '<p>I recommend starting with <strong>Python</strong>! It has:</p><ul><li>Clean, readable syntax</li><li>Huge ecosystem of libraries</li><li>Great for beginners and professionals alike</li></ul>',
    parentId: 'branch-user-1',
  }, 'branch-user-1')

  // Add a second branch (alternative response) - this creates a sibling
  const node1a = tree.nodes['branch-assistant-1a']
  tree = {
    ...tree,
    nodes: {
      ...tree.nodes,
      'branch-assistant-1b': {
        id: 'branch-assistant-1b',
        role: 'assistant',
        content: '<p>I\'d suggest <strong>JavaScript</strong> as your first language:</p><ul><li>Runs everywhere (browser, server, mobile)</li><li>Immediate visual feedback</li><li>Essential for web development</li></ul>',
        parentId: 'branch-user-1',
        children: [],
        branchIndex: 1,
      },
      'branch-user-1': {
        ...tree.nodes['branch-user-1'],
        children: ['branch-assistant-1a', 'branch-assistant-1b'],
      },
    },
  }

  // Continue the Python branch
  tree = addMessageToTree(tree, {
    id: 'branch-user-2',
    role: 'user',
    content: 'What should I build first with Python?',
    parentId: 'branch-assistant-1a',
  }, 'branch-assistant-1a')

  tree = addMessageToTree(tree, {
    id: 'branch-assistant-2',
    role: 'assistant',
    content: '<p>Here are some great first projects:</p><ol><li><strong>Calculator</strong> — Practice basic logic</li><li><strong>Todo app</strong> — Learn data structures</li><li><strong>Web scraper</strong> — Explore libraries</li></ol><p>Start small and build up!</p>',
    parentId: 'branch-user-2',
  }, 'branch-user-2')

  return tree
}

// Mock conversation history
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    title: 'Interactive Demo',
    preview: 'Try all features...',
    timestamp: 'Now',
    isActive: true
  },
  {
    id: 'branching',
    title: 'Branching Demo',
    preview: 'Explore alternate paths...',
    timestamp: 'Pinned',
    isActive: false
  },
]

export default function ChatDemo() {
  const [conversationTree, setConversationTree] = useState<ConversationTree>(createEmptyTree())
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeConversationId, setActiveConversationId] = useState('1')
  const responseIndexRef = useRef(0)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentMessageIdRef = useRef<string | null>(null)

  // Track attachments for mock upload simulation
  const [attachments, setAttachments] = useState<Attachment[]>([])

  const handleAttachmentsChange = useCallback((newAttachments: Attachment[]) => {
    setAttachments(newAttachments)

    // Simulate upload for any new pending attachments
    newAttachments.forEach((attachment) => {
      if (attachment.status === 'pending') {
        // Step 1: Pending -> Uploading after 1s
        setTimeout(() => {
          setAttachments((prev) =>
              prev.map((a) => (a.id === attachment.id ? {...a, status: 'uploading' as const} : a))
          )

          // Step 2: Uploading -> Complete after another 1s
          setTimeout(() => {
            setAttachments((prev) =>
                prev.map((a) => (a.id === attachment.id ? {...a, status: 'complete' as const} : a))
            )
          }, 1000)
        }, 1000)
      }
    })
  }, [])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
      }
    }
  }, [])

  // Simulate streaming a response
  const streamResponse = useCallback((response: string, onComplete: () => void, slow = false) => {
    const messageId = generateId()
    currentMessageIdRef.current = messageId

    // Split into tokens
    const tokens: string[] = []
    let remaining = response
    while (remaining.length > 0) {
      const artifactMatch = remaining.match(/^:::artifact\{[^}]*\}:::/)
      if (artifactMatch) {
        tokens.push(artifactMatch[0])
        remaining = remaining.slice(artifactMatch[0].length)
        continue
      }
      const wordMatch = remaining.match(/^(<[^>]+>|[^\s<]+)/)
      if (wordMatch) {
        tokens.push(wordMatch[0])
        remaining = remaining.slice(wordMatch[0].length)
        continue
      }
      const spaceMatch = remaining.match(/^\s+/)
      if (spaceMatch) {
        tokens.push(spaceMatch[0])
        remaining = remaining.slice(spaceMatch[0].length)
        continue
      }
      tokens.push(remaining[0])
      remaining = remaining.slice(1)
    }

    let currentTokenIndex = 0

    // Add empty assistant message to tree
    setConversationTree((prev) => {
      const parentId = prev.activeLeafId
      return addMessageToTree(prev, {
        id: messageId,
        role: 'assistant',
        content: '',
        parentId,
        isStreaming: true,
      }, parentId)
    })

    const interval = slow ? 150 : 30 // Slower for stop demo
    streamIntervalRef.current = setInterval(() => {
      if (currentTokenIndex < tokens.length) {
        const chunk = tokens.slice(0, currentTokenIndex + 1).join('')
        setConversationTree((prev) => updateNodeContent(prev, messageId, chunk, true))
        currentTokenIndex++
      } else {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current)
          streamIntervalRef.current = null
        }
        setConversationTree((prev) => updateNodeContent(prev, messageId, tokens.join(''), false))
        currentMessageIdRef.current = null
        onComplete()
      }
    }, interval)
  }, [])

  // Handle stop generation
  const handleStop = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    if (currentMessageIdRef.current) {
      setConversationTree((prev) => {
        const node = prev.nodes[currentMessageIdRef.current!]
        if (node) {
          return updateNodeContent(prev, currentMessageIdRef.current!, node.content, false)
        }
        return prev
      })
      currentMessageIdRef.current = null
    }
    setIsStreaming(false)
    setIsThinking(false)
  }, [])

  // Handle message submission
  const handleSubmit = useCallback(
      (message: string, _attachments?: Attachment[]) => {
        if (isStreaming) {
          return
        }

        // Clear attachments after submission
        setAttachments([])

        // Add user message to tree
        const userMessageId = generateId()
        setConversationTree((prev) => {
          const parentId = prev.activeLeafId
          return addMessageToTree(prev, {
            id: userMessageId,
            role: 'user',
            content: message,
            parentId,
          }, parentId)
        })

        setIsStreaming(true)
        setIsThinking(true)

        // Simulate thinking delay (1-2s)
        const thinkingDelay = 1000 + Math.random() * 1000
        setTimeout(() => {
          setIsThinking(false)

          let response: string
          let slow = false

          // Check for specific demo triggers
          const lowerMessage = message.toLowerCase()
          if (lowerMessage.includes('slow') || lowerMessage.includes('stop')) {
            response = SLOW_RESPONSE
            slow = true
          } else if (responseIndexRef.current === 0) {
            response = FIRST_RESPONSE
          } else if (responseIndexRef.current === 1) {
            response = SECOND_RESPONSE
          } else {
            const additionalIndex = (responseIndexRef.current - 2) % ADDITIONAL_RESPONSES.length
            response = ADDITIONAL_RESPONSES[additionalIndex]
          }

          responseIndexRef.current++

          streamResponse(response, () => {
            setIsStreaming(false)
          }, slow)
        }, thinkingDelay)
      },
      [isStreaming, streamResponse]
  )

  // Handle edit message (creates a branch)
  const handleEditMessage = useCallback((messageId: string, newContent: string) => {
    const node = conversationTree.nodes[messageId]
    if (!node || node.role !== 'user') {
      return
    }

    // Add the edited message as a new branch from the same parent
    const newMessageId = generateId()
    setConversationTree((prev) => {
      const parentId = node.parentId
      return addMessageToTree(prev, {
        id: newMessageId,
        role: 'user',
        content: newContent,
        parentId,
      }, parentId)
    })

    // Trigger a new response
    setIsStreaming(true)
    setIsThinking(true)

    setTimeout(() => {
      setIsThinking(false)
      const response = '<p>I see you\'ve edited your message! This created a new branch in the conversation. You can use the branch navigator (← 1/2 →) above messages to switch between different paths.</p>'
      streamResponse(response, () => {
        setIsStreaming(false)
      })
    }, 1500)
  }, [conversationTree, streamResponse])

  // Handle retry message (creates a branch)
  const handleRetryMessage = useCallback((messageId: string) => {
    const node = conversationTree.nodes[messageId]
    if (!node || node.role !== 'assistant') {
      return
    }

    const parentId = node.parentId

    // Immediately switch to parent (hides the old assistant message)
    // and show thinking indicator
    setConversationTree((prev) => ({
      ...prev,
      activeLeafId: parentId,
    }))
    setIsStreaming(true)
    setIsThinking(true)

    // After thinking delay, add the new message and stream
    setTimeout(() => {
      setIsThinking(false)
      const newMessageId = generateId()
      currentMessageIdRef.current = newMessageId

      setConversationTree((prev) => {
        return addMessageToTree(prev, {
          id: newMessageId,
          role: 'assistant',
          content: '',
          parentId,
          isStreaming: true,
        }, parentId)
      })

      const response = '<p>Here\'s an alternative response! When you retry, it creates a new branch. You can navigate between different responses using the branch indicator above.</p><p>This is great for exploring different conversation paths or getting a fresh perspective on a topic.</p>'

      // Stream the response
      const tokens = response.split(/(\s+)/).filter(Boolean)
      let currentIndex = 0

      const streamIt = () => {
        if (currentIndex < tokens.length) {
          const chunk = tokens.slice(0, currentIndex + 1).join('')
          setConversationTree((prev) => updateNodeContent(prev, newMessageId, chunk, true))
          currentIndex++
          setTimeout(streamIt, 30)
        } else {
          setConversationTree((prev) => updateNodeContent(prev, newMessageId, response, false))
          currentMessageIdRef.current = null
          setIsStreaming(false)
        }
      }
      streamIt()
    }, 1500)
  }, [conversationTree])

  // Handle new chat
  const handleNewChat = useCallback(() => {
    const newId = `chat-${Date.now()}`
    setConversationTree(createEmptyTree())
    responseIndexRef.current = 0
    setActiveConversationId(newId)

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

  // Handle conversation selection
  const handleSelectConversation = useCallback((id: string) => {
    if (id === activeConversationId) {
      return
    }

    setActiveConversationId(id)
    responseIndexRef.current = 0

    if (id === 'branching') {
      // Load the branching demo
      setConversationTree(createBranchingDemoTree())
    } else {
      setConversationTree(createEmptyTree())
    }

    setConversations((prev) =>
        prev.map((c) => ({...c, isActive: c.id === id}))
    )
  }, [activeConversationId])

  const handleBack = useCallback(() => {
    window.location.hash = ''
  }, [])

  // Determine empty state helper based on conversation
  const getEmptyStateHelper = () => {
    if (activeConversationId === 'branching') {
      return 'This conversation has branches — look for the ← 1/2 → indicators to explore alternate paths'
    }
    return (
        <span>
        Type anything to start. Try <em>&quot;show me something slow&quot;</em> to test the Stop button, or attach a file!
      </span>
    )
  }

  return (
      <div className="h-screen w-screen flex flex-col bg-obsidian">
        {/* Header */}
        <header
            className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-ash/40 bg-charcoal/50">
          <div className="flex items-center gap-4">
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-silver hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                   className="w-5 h-5">
                <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                    clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Back to Docs</span>
            </button>
            <div className="h-6 w-px bg-ash/40"/>
            <h1 className="text-lg font-semibold text-white">Chat Interface Demo</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-silver hidden md:block">
              {activeConversationId === 'branching'
                  ? 'Explore the branching demo — use ← → to navigate alternate paths'
                  : 'Hover messages for actions • Drag files to attach • Type "slow" to test Stop'}
            </p>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
              conversationTree={conversationTree}
              onTreeChange={setConversationTree}
              conversations={conversations}
              onMessageSubmit={handleSubmit}
              onEditMessage={handleEditMessage}
              onRetryMessage={handleRetryMessage}
              onStop={handleStop}
              onSelectConversation={handleSelectConversation}
              onNewChat={handleNewChat}
              isStreaming={isStreaming}
              isThinking={isThinking}
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
              placeholder="Send a message..."
              emptyStateHelper={getEmptyStateHelper()}
              showAttachmentButton={true}
              enableMessageActions={true}
          />
        </div>
      </div>
  )
}
