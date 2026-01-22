import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {
  addMessageToTree,
  type Attachment,
  ChatInterface,
  type Conversation,
  type ConversationTree,
  createEmptyTree,
  generateId,
  type Task,
  updateNodeContent,
  useArtifacts,
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

// Mock response content for the second message (with artifact)
const SECOND_RESPONSE = `<p>Great! Now I'll show you the artifacts panel with some rich content.</p>
<p>The panel slides in from the right and can display various types of content including images, videos, and formatted text.</p>
<p>Check out the artifact I've added for you — it appears in the panel on the right!</p>
<p>You can collapse or expand the artifacts panel at any time. Try sending more messages to see how the interface responds!</p>`

// Artifact data for second response
const SECOND_ARTIFACT = {
  id: 'artifact-1',
  type: 'image' as const,
  src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
  alt: 'Code visualization',
  title: 'Component Architecture',
  subtitle: 'A visual guide to structuring your React components',
}

// Slow response for stop demo
const SLOW_RESPONSE = `<p>This is a deliberately slow response to demonstrate the Stop button.</p>
<p>Watch the input area — you'll see a red Stop button appear instead of the Send button while I'm generating.</p>
<p>Click it to stop generation at any point. The partial response will be kept.</p>
<p>This is useful when you want to interrupt a long response or if you realize you asked the wrong question.</p>
<p>The streaming will continue... slowly... so you have time to stop it.</p>
<p>Still going...</p>
<p>And going...</p>
<p>You can stop me anytime!</p>`

// Additional responses with artifacts
const ADDITIONAL_RESPONSES = [
  {
    content: `<p>Here's another artifact with a different image!</p>
<p>The artifacts panel stacks multiple items vertically with smooth transitions.</p>`,
    artifact: {
      id: 'artifact-2',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      alt: 'Developer workspace',
      title: 'Modern Development',
      subtitle: 'Setting up an efficient workspace',
    },
  },
  {
    content: `<p>This response demonstrates streaming without artifacts.</p>
<p>Notice how the scroll behavior works:</p>
<ol>
<li>Your message appears and anchors to the top</li>
<li>My response streams in below it</li>
<li>No jarring auto-scroll during generation</li>
</ol>
<p>This mimics the behavior of modern chat interfaces like Claude and ChatGPT.</p>`,
    artifact: null,
  },
  {
    content: `<p>Let me show you one more artifact!</p>
<p>Each artifact can have a title and subtitle for context. The panel supports scrolling when content overflows.</p>`,
    artifact: {
      id: 'artifact-3',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      alt: 'Coding session',
      title: 'Development in Action',
      subtitle: 'Building with modern tools and frameworks',
    },
  },
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

// ============================================================================
// BRAND ANALYSIS DEMO - Luminova Coffee
// ============================================================================

// Movie script artifact content for brand analysis
const LUMINOVA_SCRIPT = `<div class="script-content">
  <p class="scene-heading">FADE IN:</p>

  <p class="scene-heading">EXT. MOUNTAIN COFFEE FARM - DAWN</p>

  <p class="action">Mist rolls through lush green coffee plants. The first rays of sunlight pierce through clouds, illuminating dewdrops on coffee cherries.</p>

  <p class="character">NARRATOR (V.O.)</p>
  <p class="dialogue">In the highlands where clouds kiss the earth...</p>

  <p class="scene-heading">CUT TO:</p>

  <p class="scene-heading">INT. ARTISAN ROASTERY - DAY</p>

  <p class="action">ELENA (30s, passionate artisan roaster) carefully tends to a vintage copper roasting drum. Steam rises as she checks the beans' color.</p>

  <p class="character">ELENA</p>
  <p class="dialogue">Every bean has a story. Our job is to let it speak.</p>

  <p class="action">Her loyal companion, a golden retriever named BEAN, watches attentively from his bed nearby.</p>

  <p class="scene-heading">CUT TO:</p>

  <p class="scene-heading">EXT. COZY CAFÉ - MORNING</p>

  <p class="action">A bustling café with warm wooden interiors. Customers cradle cups, lost in conversation or quiet contemplation. BEAN weaves between tables, spreading joy.</p>

  <p class="character">NARRATOR (V.O.)</p>
  <p class="dialogue">Luminova Coffee. Where every cup illuminates your moment.</p>

  <p class="action">The Luminova logo appears, golden and radiant, as the tagline fades in:</p>

  <p class="tagline">"Illuminate Your Day"</p>

  <p class="scene-heading">FADE OUT.</p>
</div>

<style>
  .script-content { font-family: 'Courier New', monospace; }
  .scene-heading { font-weight: bold; margin-top: 1.5em; text-transform: uppercase; color: #fecb6b; }
  .action { margin: 1em 0; color: #a3a3a3; }
  .character { margin-top: 1.5em; margin-left: 2em; font-weight: bold; color: #ffffff; }
  .dialogue { margin-left: 1em; margin-right: 2em; color: #d4d4d4; }
  .tagline { text-align: center; font-size: 1.2em; font-style: italic; margin-top: 2em; color: #fecb6b; }
</style>`

// Brand analysis workflow responses
const BRAND_ANALYSIS_INTRO = `<p>I'll help you create a comprehensive brand video for <strong>Luminova Coffee</strong>!</p>
<p>This will involve several steps:</p>
<ol>
<li>Collecting sources about coffee industry trends and competitor analysis</li>
<li>Analyzing the data to understand brand positioning</li>
<li>Writing a compelling video script</li>
<li>Generating visual assets (hero character, location, brand mascot)</li>
<li>Producing the final video compilation</li>
</ol>
<p>Watch the tasks panel on the right to see my progress. Let's begin!</p>`

const BRAND_ANALYSIS_PROGRESS = `<p>Great progress! I've completed the research and analysis phases.</p>
<p>The script is now ready — you can see it in the artifacts panel. It tells the story of Elena, an artisan roaster, and her loyal companion Bean (a golden retriever).</p>
<p>Now I'm generating the visual assets to bring this story to life...</p>`

const BRAND_ANALYSIS_IMAGES = `<p>The visual assets are coming together beautifully!</p>
<p>I've created:</p>
<ul>
<li><strong>Elena</strong> — Our hero character, the passionate artisan roaster</li>
<li><strong>Bean</strong> — The adorable golden retriever brand mascot</li>
<li><strong>The Roastery</strong> — A warm, inviting café location</li>
</ul>
<p>Now compiling everything into the final video...</p>`

const BRAND_ANALYSIS_COMPLETE = `<p>The brand video for <strong>Luminova Coffee</strong> is complete!</p>
<p>Check out all the artifacts in the panel — the script, character images, and the final video.</p>
<p>The video captures the essence of the brand: artisanal quality, warmth, and the joy of a perfect cup of coffee.</p>
<p><em>Note: One image generation was cancelled as we decided to focus on the main dog character rather than creating duplicates.</em></p>`

// Brand analysis artifacts
const BRAND_ARTIFACTS = {
  script: {
    id: 'brand-script',
    type: 'html' as const,
    content: LUMINOVA_SCRIPT,
    title: 'Luminova Coffee — Brand Video Script',
    subtitle: '30-second spot • Directed by AI Creative',
  },
  hero: {
    id: 'brand-hero',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    alt: 'Elena the artisan roaster',
    title: 'Elena — Hero Character',
    subtitle: 'The passionate artisan roaster',
  },
  dog: {
    id: 'brand-dog',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    alt: 'Bean the golden retriever',
    title: 'Bean — Brand Mascot',
    subtitle: 'The loyal café companion',
  },
  location: {
    id: 'brand-location',
    type: 'image' as const,
    src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    alt: 'Cozy artisan roastery',
    title: 'The Roastery',
    subtitle: 'Warm, inviting café atmosphere',
  },
  video: {
    id: 'brand-video',
    type: 'video' as const,
    src: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    title: 'Luminova Coffee — Final Video',
    subtitle: '30-second brand spot',
  },
}

// Initial tasks for brand analysis (before any subtasks are known)
const INITIAL_BRAND_TASKS: Task[] = [
  {id: 'task-collect', label: 'Collect sources online', status: 'pending'},
  {id: 'task-analyze', label: 'Analyze sources', status: 'pending'},
  {id: 'task-script', label: 'Generate script', status: 'pending'},
  {id: 'task-pictures', label: 'Generate pictures', status: 'pending'},
  {id: 'task-video', label: 'Generate short video from pictures', status: 'pending'},
  {id: 'task-impossible', label: 'Do something impossible', status: 'pending'},
]

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
  {
    id: 'brand-analysis',
    title: 'Brand Analysis Demo',
    preview: 'Luminova Coffee campaign...',
    timestamp: 'Pinned',
    isActive: false
  },
]

export default function ChatDemo() {
  const navigate = useNavigate()
  const [conversationTree, setConversationTree] = useState<ConversationTree>(createEmptyTree())
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeConversationId, setActiveConversationId] = useState('1')
  const responseIndexRef = useRef(0)
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentMessageIdRef = useRef<string | null>(null)
  const brandWorkflowRef = useRef<NodeJS.Timeout[]>([])

  // Use the artifacts hook for controlling the artifacts panel
  const {artifacts, scheduleArtifact, showArtifact, removeArtifact, clearArtifacts} = useArtifacts()

  // Tasks state for the TodosList
  const [tasks, setTasks] = useState<Task[]>([])

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

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current)
      }
      brandWorkflowRef.current.forEach(clearTimeout)
    }
  }, [])

  // Update a specific task's status
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? {...t, ...updates} : t
    ))
  }, [])

  // Update a subtask within a parent task
  const updateSubtask = useCallback((parentId: string, subtaskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === parentId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map(st =>
            st.id === subtaskId ? {...st, ...updates} : st
          )
        }
      }
      return t
    }))
  }, [])

  // Add subtasks to a parent task
  const addSubtasks = useCallback((parentId: string, subtasks: Task[]) => {
    setTasks(prev => prev.map(t =>
      t.id === parentId ? {...t, subtasks} : t
    ))
  }, [])

  // Simulate streaming a response with optional artifact
  const streamResponse = useCallback((
    response: string,
    artifact: typeof SECOND_ARTIFACT | null,
    onComplete: () => void,
    slow = false
  ) => {
    const messageId = generateId()
    currentMessageIdRef.current = messageId

    // If there's an artifact, schedule it first (shows skeleton)
    // This simulates receiving an SSE operator.started event
    if (artifact) {
      scheduleArtifact({id: artifact.id, type: artifact.type})
    }

    // Split into tokens
    const tokens: string[] = []
    let remaining = response
    while (remaining.length > 0) {
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

        // Show the artifact with full data (simulates SSE artifact.created event)
        if (artifact) {
          showArtifact(artifact.id, {
            type: artifact.type,
            src: artifact.src,
            alt: artifact.alt,
            title: artifact.title,
            subtitle: artifact.subtitle,
          })
        }

        currentMessageIdRef.current = null
        onComplete()
      }
    }, interval)
  }, [scheduleArtifact, showArtifact])

  // Run the brand analysis workflow
  const runBrandAnalysisWorkflow = useCallback(() => {
    // Clear any existing workflow timeouts
    brandWorkflowRef.current.forEach(clearTimeout)
    brandWorkflowRef.current = []

    // Reset state
    setTasks([...INITIAL_BRAND_TASKS])
    clearArtifacts()
    setIsStreaming(true)
    setIsThinking(true)

    // Add user message
    const userMessageId = generateId()
    setConversationTree((prev) => {
      return addMessageToTree(prev, {
        id: userMessageId,
        role: 'user',
        content: 'Create a brand video for Luminova Coffee, a premium artisan coffee brand.',
        parentId: null,
      }, null)
    })

    // Timeline of events (all times in ms from start)
    const timeline = [
      // Intro response and start first task
      {time: 1500, action: () => {
        setIsThinking(false)
        updateTask('task-collect', {status: 'in_progress'})
        streamResponse(BRAND_ANALYSIS_INTRO, null, () => {
          setIsStreaming(false)
        })
      }},

      // Complete collect, start analyze
      {time: 5000, action: () => {
        updateTask('task-collect', {status: 'done'})
        updateTask('task-analyze', {status: 'in_progress'})
      }},

      // Complete analyze, start script
      {time: 8000, action: () => {
        updateTask('task-analyze', {status: 'done'})
        updateTask('task-script', {status: 'in_progress'})
        // Schedule script artifact
        scheduleArtifact({id: BRAND_ARTIFACTS.script.id, type: 'html'})
      }},

      // Complete script with artifact, send progress message
      {time: 12000, action: () => {
        updateTask('task-script', {status: 'done'})
        showArtifact(BRAND_ARTIFACTS.script.id, {
          type: 'html',
          content: BRAND_ARTIFACTS.script.content,
          title: BRAND_ARTIFACTS.script.title,
          subtitle: BRAND_ARTIFACTS.script.subtitle,
        })

        // Start pictures task with subtasks
        updateTask('task-pictures', {status: 'in_progress'})
        addSubtasks('task-pictures', [
          {id: 'subtask-hero', label: 'Hero character', status: 'pending'},
          {id: 'subtask-dog', label: 'Dog', status: 'pending'},
          {id: 'subtask-location', label: 'Location', status: 'pending'},
          {id: 'subtask-dog2', label: 'Another dog picture', status: 'pending'},
        ])

        // Stream progress message
        setIsStreaming(true)
        streamResponse(BRAND_ANALYSIS_PROGRESS, null, () => {
          setIsStreaming(false)
        })
      }},

      // Start generating hero image
      {time: 14000, action: () => {
        updateSubtask('task-pictures', 'subtask-hero', {status: 'in_progress'})
        scheduleArtifact({id: BRAND_ARTIFACTS.hero.id, type: 'image'})
      }},

      // Complete hero, start dog
      {time: 17000, action: () => {
        updateSubtask('task-pictures', 'subtask-hero', {status: 'done'})
        showArtifact(BRAND_ARTIFACTS.hero.id, {
          type: 'image',
          src: BRAND_ARTIFACTS.hero.src,
          alt: BRAND_ARTIFACTS.hero.alt,
          title: BRAND_ARTIFACTS.hero.title,
          subtitle: BRAND_ARTIFACTS.hero.subtitle,
        })
        updateSubtask('task-pictures', 'subtask-dog', {status: 'in_progress'})
        scheduleArtifact({id: BRAND_ARTIFACTS.dog.id, type: 'image'})
      }},

      // Complete dog, start location
      {time: 20000, action: () => {
        updateSubtask('task-pictures', 'subtask-dog', {status: 'done'})
        showArtifact(BRAND_ARTIFACTS.dog.id, {
          type: 'image',
          src: BRAND_ARTIFACTS.dog.src,
          alt: BRAND_ARTIFACTS.dog.alt,
          title: BRAND_ARTIFACTS.dog.title,
          subtitle: BRAND_ARTIFACTS.dog.subtitle,
        })
        updateSubtask('task-pictures', 'subtask-location', {status: 'in_progress'})
        scheduleArtifact({id: BRAND_ARTIFACTS.location.id, type: 'image'})
      }},

      // Complete location, cancel duplicate dog, complete pictures task
      {time: 23000, action: () => {
        updateSubtask('task-pictures', 'subtask-location', {status: 'done'})
        showArtifact(BRAND_ARTIFACTS.location.id, {
          type: 'image',
          src: BRAND_ARTIFACTS.location.src,
          alt: BRAND_ARTIFACTS.location.alt,
          title: BRAND_ARTIFACTS.location.title,
          subtitle: BRAND_ARTIFACTS.location.subtitle,
        })
        // Cancel the duplicate dog picture
        updateSubtask('task-pictures', 'subtask-dog2', {status: 'cancelled'})
        updateTask('task-pictures', {status: 'done'})

        // Send images complete message
        setIsStreaming(true)
        streamResponse(BRAND_ANALYSIS_IMAGES, null, () => {
          setIsStreaming(false)
        })
      }},

      // Start video generation
      {time: 26000, action: () => {
        updateTask('task-video', {status: 'in_progress'})
        scheduleArtifact({id: BRAND_ARTIFACTS.video.id, type: 'video'})
      }},

      // Complete video, start impossible task
      {time: 30000, action: () => {
        updateTask('task-video', {status: 'done'})
        showArtifact(BRAND_ARTIFACTS.video.id, {
          type: 'video',
          src: BRAND_ARTIFACTS.video.src,
          title: BRAND_ARTIFACTS.video.title,
          subtitle: BRAND_ARTIFACTS.video.subtitle,
        })
        updateTask('task-impossible', {status: 'in_progress'})
      }},

      // Fail impossible task, send completion message
      {time: 33000, action: () => {
        updateTask('task-impossible', {status: 'failed'})

        // Send final message
        setIsStreaming(true)
        streamResponse(BRAND_ANALYSIS_COMPLETE, null, () => {
          setIsStreaming(false)
        })
      }},
    ]

    // Schedule all timeline events
    timeline.forEach(({time, action}) => {
      const timeoutId = setTimeout(action, time)
      brandWorkflowRef.current.push(timeoutId)
    })
  }, [clearArtifacts, scheduleArtifact, showArtifact, streamResponse, updateTask, updateSubtask, addSubtasks])

  // Handle stop generation
  const handleStop = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current)
      streamIntervalRef.current = null
    }
    // Clear brand workflow timeouts
    brandWorkflowRef.current.forEach(clearTimeout)
    brandWorkflowRef.current = []

    // Capture the message ID before the callback
    const messageId = currentMessageIdRef.current
    if (messageId) {
      setConversationTree((prev) => {
        const node = prev.nodes[messageId]
        if (node) {
          return updateNodeContent(prev, messageId, node.content, false)
        }
        return prev
      })
      currentMessageIdRef.current = null
    }

    // If there are pending artifacts, remove them (simulates SSE operator.failed)
    artifacts.forEach((a) => {
      if (a.isPending) {
        removeArtifact(a.id)
      }
    })

    setIsStreaming(false)
    setIsThinking(false)
  }, [artifacts, removeArtifact])

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
        let artifact: typeof SECOND_ARTIFACT | null = null
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
          artifact = SECOND_ARTIFACT
        } else {
          const additionalIndex = (responseIndexRef.current - 2) % ADDITIONAL_RESPONSES.length
          const additional = ADDITIONAL_RESPONSES[additionalIndex]
          response = additional.content
          artifact = additional.artifact
        }

        responseIndexRef.current++

        streamResponse(response, artifact, () => {
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
      streamResponse(response, null, () => {
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
    clearArtifacts()
    setTasks([])
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
      [newChat, ...prev.map((c) => ({...c, isActive: false}))].slice(0, 6)
    )
  }, [clearArtifacts])

  // Handle conversation selection
  const handleSelectConversation = useCallback((id: string) => {
    if (id === activeConversationId) {
      return
    }

    // Stop any ongoing workflows
    handleStop()

    setActiveConversationId(id)
    responseIndexRef.current = 0
    clearArtifacts()
    setTasks([])

    if (id === 'branching') {
      // Load the branching demo
      setConversationTree(createBranchingDemoTree())
    } else if (id === 'brand-analysis') {
      // Start the brand analysis workflow
      setConversationTree(createEmptyTree())
      // Use setTimeout to ensure state is cleared before starting
      setTimeout(() => {
        runBrandAnalysisWorkflow()
      }, 100)
    } else {
      setConversationTree(createEmptyTree())
    }

    setConversations((prev) =>
      prev.map((c) => ({...c, isActive: c.id === id}))
    )
  }, [activeConversationId, clearArtifacts, handleStop, runBrandAnalysisWorkflow])

  const handleBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  // Determine empty state helper based on conversation
  const getEmptyStateHelper = () => {
    if (activeConversationId === 'branching') {
      return 'This conversation has branches — look for the ← 1/2 → indicators to explore alternate paths'
    }
    if (activeConversationId === 'brand-analysis') {
      return 'Starting brand analysis workflow...'
    }
    return (
      <span>
        Type anything to start. Try <em>&quot;show me something slow&quot;</em> to test the Stop button, or attach a file!
      </span>
    )
  }

  // Determine header subtitle based on conversation
  const getHeaderSubtitle = () => {
    if (activeConversationId === 'branching') {
      return 'Explore the branching demo — use ← → to navigate alternate paths'
    }
    if (activeConversationId === 'brand-analysis') {
      return 'Brand Analysis Demo — Watch tasks progress and artifacts appear'
    }
    return 'Try actions below messages • Drag files to attach • Type "slow" to test Stop'
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
            {getHeaderSubtitle()}
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
          artifacts={artifacts}
          tasks={tasks}
          tasksTitle="Workflow Progress"
          placeholder="Send a message..."
          emptyStateHelper={getEmptyStateHelper()}
          showAttachmentButton={true}
          enableMessageActions={true}
        />
      </div>
    </div>
  )
}
