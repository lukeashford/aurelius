import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {
  addMessageToTree,
  type ArtifactNode,
  type Attachment,
  ChatInterface,
  type Conversation,
  type ConversationTree,
  createEmptyTree,
  generateId,
  type ScriptElement,
  type Task,
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

// Mock response content for the second message (with artifact)
const SECOND_RESPONSE = `<p>Great! Now I'll show you the artifacts panel with some rich content.</p>
<p>The panel slides in from the right and can display various types of content including images, videos, and formatted text.</p>
<p>Check out the artifact I've added for you — it appears in the panel on the right!</p>
<p>You can collapse or expand the artifacts panel at any time. Try sending more messages to see how the interface responds!</p>`

// Artifact data for second response
const SECOND_ARTIFACT_NODE: ArtifactNode = {
  id: 'artifact-1',
  type: 'ARTIFACT',
  name: 'component_architecture',
  label: 'Component Architecture',
  artifact: {
    id: 'artifact-1',
    type: 'IMAGE',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    alt: 'Code visualization',
    title: 'Component Architecture',
    subtitle: 'A visual guide to structuring your React components',
  },
  children: [],
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
const ADDITIONAL_RESPONSES: { content: string; artifactNode: ArtifactNode | null }[] = [
  {
    content: `<p>Here's another artifact with a different image!</p>
<p>The artifacts panel stacks multiple items vertically with smooth transitions.</p>`,
    artifactNode: {
      id: 'artifact-2',
      type: 'ARTIFACT',
      name: 'modern_development',
      label: 'Modern Development',
      artifact: {
        id: 'artifact-2',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        alt: 'Developer workspace',
        title: 'Modern Development',
        subtitle: 'Setting up an efficient workspace',
      },
      children: [],
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
    artifactNode: null,
  },
  {
    content: `<p>Let me show you one more artifact!</p>
<p>Each artifact can have a title and subtitle for context. The panel supports scrolling when content overflows.</p>`,
    artifactNode: {
      id: 'artifact-3',
      type: 'ARTIFACT',
      name: 'development_in_action',
      label: 'Development in Action',
      artifact: {
        id: 'artifact-3',
        type: 'IMAGE',
        url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        alt: 'Coding session',
        title: 'Development in Action',
        subtitle: 'Building with modern tools and frameworks',
      },
      children: [],
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

// Movie script using structured ScriptElement format
const LUMINOVA_SCRIPT_ELEMENTS: ScriptElement[] = [
  {type: 'scene-heading', content: 'FADE IN:'},
  {type: 'scene-heading', content: 'EXT. MOUNTAIN COFFEE FARM - DAWN'},
  {
    type: 'action',
    content: 'Mist rolls through lush green coffee plants. The first rays of sunlight pierce through clouds, illuminating dewdrops on coffee cherries.'
  },
  {type: 'character', content: 'NARRATOR (V.O.)'},
  {type: 'dialogue', content: 'In the highlands where clouds kiss the earth...'},
  {type: 'transition', content: 'CUT TO:'},
  {type: 'scene-heading', content: 'INT. ARTISAN ROASTERY - DAY'},
  {
    type: 'action',
    content: 'ELENA (30s, passionate artisan roaster) carefully tends to a vintage copper roasting drum. Steam rises as she checks the beans\' color.'
  },
  {type: 'character', content: 'ELENA'},
  {type: 'dialogue', content: 'Every bean has a story. Our job is to let it speak.'},
  {
    type: 'action',
    content: 'Her loyal companion, a golden retriever named BEAN, watches attentively from his bed nearby.'
  },
  {type: 'transition', content: 'CUT TO:'},
  {type: 'scene-heading', content: 'EXT. COZY CAFÉ - MORNING'},
  {
    type: 'action',
    content: 'A bustling café with warm wooden interiors. Customers cradle cups, lost in conversation or quiet contemplation. BEAN weaves between tables, spreading joy.'
  },
  {type: 'character', content: 'NARRATOR (V.O.)'},
  {type: 'dialogue', content: 'Luminova Coffee. Where every cup illuminates your moment.'},
  {
    type: 'action',
    content: 'The Luminova logo appears, golden and radiant, as the tagline fades in:'
  },
  {type: 'title', content: '"Illuminate Your Day"'},
  {type: 'transition', content: 'FADE OUT.'},
]

// Brand analysis workflow responses
const BRAND_ANALYSIS_INTRO = `<p>I'll help you create a comprehensive brand video for <strong>Luminova Coffee</strong>!</p>
<p>This will involve several steps:</p>
<ol>
<li>Collecting sources about coffee industry trends and competitor analysis</li>
<li>Analyzing the data to understand brand positioning</li>
<li>Writing a compelling video script</li>
<li>Generating storyboard panels for the key scenes</li>
<li>Exploring color treatment options</li>
<li>Building a detailed scene breakdown</li>
</ol>
<p>Watch the tasks and artifacts panels to see everything stream in. Let's begin!</p>`

const BRAND_ANALYSIS_SCRIPT_DONE = `<p>Great progress! I've completed the research and analysis phases.</p>
<p>The script is now ready — you can see it in the artifacts panel. It tells the story of Elena, an artisan roaster, and her loyal companion Bean (a golden retriever).</p>
<p>Now I'll generate the storyboard panels to visualize each scene...</p>`

const BRAND_ANALYSIS_STORYBOARD_DONE = `<p>The storyboard is taking shape! Watch the panel — each panel lands as it's generated.</p>
<p>Next up: exploring color treatments for the visual identity...</p>`

const BRAND_ANALYSIS_COMPLETE = `<p>The creative package for <strong>Luminova Coffee</strong> is complete!</p>
<p>Explore the artifacts panel — click into the <strong>Storyboard</strong> group to see all panels, compare the <strong>Color Treatments</strong> side by side, and drill into the <strong>Scene Breakdown</strong> to see script notes and lighting options.</p>
<p>Everything is organized into a navigable tree. Use the breadcrumbs to jump between levels.</p>`

// ============================================================================
// Artifact tree node data — individual pieces assembled incrementally
// ============================================================================

const IMG = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'

// Script (standalone artifact at root level)
const SCRIPT_NODE: ArtifactNode = {
  id: 'brand-script-node',
  type: 'ARTIFACT',
  name: 'brand_script',
  label: 'Brand Video Script',
  artifact: {
    id: 'brand-script',
    type: 'SCRIPT',
    scriptElements: LUMINOVA_SCRIPT_ELEMENTS,
    title: 'Luminova Coffee — Brand Video Script',
    subtitle: '30-second spot • Directed by AI Creative',
    fullWidth: true,
  },
  children: [],
}

// Storyboard group — starts empty, panels stream in one by one
const STORYBOARD_PANELS: ArtifactNode[] = [
  {
    id: 'sb-panel-1',
    type: 'ARTIFACT',
    name: 'panel_1',
    label: 'Panel 1 — Opening',
    artifact: {
      id: 'a-sb-1',
      type: 'IMAGE',
      url: IMG,
      alt: 'Opening shot',
      title: 'Panel 1 — Opening',
      subtitle: 'Wide establishing shot',
    },
    children: [],
  },
  {
    id: 'sb-panel-2',
    type: 'ARTIFACT',
    name: 'panel_2',
    label: 'Panel 2 — Elena',
    artifact: {
      id: 'a-sb-2',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
      alt: 'Elena the roaster',
      title: 'Panel 2 — Elena',
      subtitle: 'Medium close-up',
    },
    children: [],
  },
  {
    id: 'sb-panel-3',
    type: 'ARTIFACT',
    name: 'panel_3',
    label: 'Panel 3 — Bean',
    artifact: {
      id: 'a-sb-3',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
      alt: 'Bean the dog',
      title: 'Panel 3 — Bean',
      subtitle: 'The loyal companion',
    },
    children: [],
  },
]

// Color treatment children — stream into variant set one by one
const COLOR_CHILDREN: ArtifactNode[] = [
  {
    id: 'color-warm',
    type: 'ARTIFACT',
    name: 'warm',
    label: 'Warm Analog',
    artifact: {
      id: 'a-color-warm',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
      alt: 'Warm tones',
      title: 'Warm Analog',
      subtitle: 'Golden tones, film grain',
    },
    children: [],
  },
  {
    id: 'color-neon',
    type: 'ARTIFACT',
    name: 'neon',
    label: 'Neon Noir',
    artifact: {
      id: 'a-color-neon',
      type: 'IMAGE',
      url: IMG,
      alt: 'Neon noir',
      title: 'Neon Noir',
      subtitle: 'Cool blues, electric highlights',
    },
    children: [],
  },
  {
    id: 'color-mono',
    type: 'ARTIFACT',
    name: 'mono',
    label: 'Monochrome',
    artifact: {
      id: 'a-color-mono',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      alt: 'Monochrome',
      title: 'Monochrome',
      subtitle: 'High-contrast black & white',
    },
    children: [],
  },
]

// Scene breakdown children
const SCENE_SCRIPT_NOTES: ArtifactNode = {
  id: 'sb-script-notes',
  type: 'ARTIFACT',
  name: 'script_notes',
  label: 'Script Notes',
  artifact: {
    id: 'a-script-notes',
    type: 'TEXT',
    inlineContent: '## Act I\n\n- **INT. ROASTERY — DAWN** — Elena begins her craft\n- **EXT. CAFÉ — MORNING** — Bean greets customers\n- **CLOSE-UP** — The perfect pour',
    mimeType: 'text/markdown',
    title: 'Script Notes',
    subtitle: 'Scene breakdown',
  },
  children: [],
}

const LIGHTING_CHILDREN: ArtifactNode[] = [
  {
    id: 'light-practical',
    type: 'ARTIFACT',
    name: 'practical',
    label: 'Practical',
    artifact: {
      id: 'a-light-practical',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      alt: 'Practical lighting',
      title: 'Practical Lighting',
      subtitle: 'In-scene sources only',
    },
    children: [],
  },
  {
    id: 'light-stylized',
    type: 'ARTIFACT',
    name: 'stylized',
    label: 'Stylized',
    artifact: {
      id: 'a-light-stylized',
      type: 'IMAGE',
      url: IMG,
      alt: 'Stylized neon',
      title: 'Stylized Neon',
      subtitle: 'Exaggerated color washes',
    },
    children: [],
  },
]

/**
 * Immutably add a child to a node identified by parentId within a tree.
 * Returns a new tree array with the updated parent.
 */
function addChildToNode(tree: ArtifactNode[], parentId: string,
    child: ArtifactNode): ArtifactNode[] {
  return tree.map(node => {
    if (node.id === parentId) {
      return {...node, children: [...node.children, child]}
    }
    if (node.children.length > 0) {
      const updatedChildren = addChildToNode(node.children, parentId, child)
      if (updatedChildren !== node.children) {
        return {...node, children: updatedChildren}
      }
    }
    return node
  })
}

// Initial tasks for brand analysis
const INITIAL_BRAND_TASKS: Task[] = [
  {id: 'task-collect', label: 'Collect sources online', status: 'pending'},
  {id: 'task-analyze', label: 'Analyze sources', status: 'pending'},
  {id: 'task-script', label: 'Generate script', status: 'pending'},
  {id: 'task-storyboard', label: 'Generate storyboard panels', status: 'pending'},
  {id: 'task-colors', label: 'Generate color treatments', status: 'pending'},
  {id: 'task-scene', label: 'Build scene breakdown', status: 'pending'},
]

// Mock conversation history
const now = Date.now()
const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    title: 'Interactive Demo',
    project: 'Aurelius Playground',
    timestamp: new Date(now),
    isActive: true,
  },
  {
    id: 'brand-analysis',
    title: 'Brand Analysis Demo',
    project: 'Luminova Coffee',
    timestamp: new Date(now - 3 * HOUR),
    isActive: false,
  },
  {
    id: 'branching',
    title: 'Branching Demo',
    project: 'Aurelius Playground',
    timestamp: new Date(now - DAY - 2 * HOUR),
    isActive: false,
  },
  {
    id: 'old-1',
    title: 'Tagline Brainstorm',
    project: 'Luminova Coffee',
    timestamp: new Date(now - 5 * DAY),
    isActive: false,
  },
  {
    id: 'old-2',
    title: 'Release Notes Draft',
    project: 'Aurelius Playground',
    timestamp: new Date(now - 12 * DAY),
    isActive: false,
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
  const runBrandAnalysisWorkflowRef = useRef<() => void>(() => {
  })

  // Artifact nodes for the tree-aware panel (simple + brand workflow)

  // Tasks state for the TodosList
  const [tasks, setTasks] = useState<Task[]>([])

  // Artifact tree nodes for tree-aware panel
  const [artifactNodes, setArtifactNodes] = useState<ArtifactNode[]>([])

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

  // Update a specific task's status (and optionally add subtasks)
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t =>
        t.id === taskId ? {...t, ...updates} : t
    ))
  }, [])

  // Update a subtask within a parent task
  const updateSubtask = useCallback(
      (parentId: string, subtaskId: string, updates: Partial<Task>) => {
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

  // Simulate streaming a response with optional artifact node
  const streamResponse = useCallback((
      response: string,
      artifactNode: ArtifactNode | null,
      onComplete: () => void,
      slow = false
  ) => {
    const messageId = generateId()
    currentMessageIdRef.current = messageId

    // If there's an artifact node, add it with isPending on the inner artifact
    if (artifactNode && artifactNode.artifact) {
      const pendingNode: ArtifactNode = {
        ...artifactNode,
        artifact: {...artifactNode.artifact, isPending: true},
      }
      setArtifactNodes(prev => [...prev, pendingNode])
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

        // Reveal the artifact (clear isPending)
        if (artifactNode) {
          setArtifactNodes(prev =>
              prev.map(n => n.id === artifactNode.id ? artifactNode : n)
          )
        }

        currentMessageIdRef.current = null
        onComplete()
      }
    }, interval)
  }, [])

  // Run the brand analysis workflow
  const runBrandAnalysisWorkflow = useCallback(() => {
    // Clear any existing workflow timeouts
    brandWorkflowRef.current.forEach(clearTimeout)
    brandWorkflowRef.current = []

    // Reset state
    setTasks([...INITIAL_BRAND_TASKS])
    setArtifactNodes([])
    setConversationTree(createEmptyTree())
    setIsStreaming(true)
    setIsThinking(true)

    // Helper: add a top-level node to the tree
    const pushNode = (node: ArtifactNode) =>
        setArtifactNodes(prev => [...prev, node])

    // Helper: add a child to a parent node inside the tree
    const pushChild = (parentId: string, child: ArtifactNode) =>
        setArtifactNodes(prev => addChildToNode(prev, parentId, child))

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
      // Intro response, start research
      {
        time: 1500, action: () => {
          setIsThinking(false)
          updateTask('task-collect', {status: 'in_progress'})
          streamResponse(BRAND_ANALYSIS_INTRO, null, () => {
            setIsStreaming(false)
          })
        }
      },

      // Complete collect, start analyze
      {
        time: 5000, action: () => {
          updateTask('task-collect', {status: 'done'})
          updateTask('task-analyze', {status: 'in_progress'})
        }
      },

      // Complete analyze, start script generation
      {
        time: 8000, action: () => {
          updateTask('task-analyze', {status: 'done'})
          updateTask('task-script', {status: 'in_progress'})
        }
      },

      // Script done — add script node to tree
      {
        time: 11000, action: () => {
          updateTask('task-script', {status: 'done'})
          pushNode(SCRIPT_NODE)

          // Stream progress message
          setIsStreaming(true)
          streamResponse(BRAND_ANALYSIS_SCRIPT_DONE, null, () => {
            setIsStreaming(false)
          })
        }
      },

      // ---- Storyboard: group appears empty, then panels land 1s apart ----

      // Start storyboard task, add empty group
      {
        time: 13000, action: () => {
          updateTask('task-storyboard', {status: 'in_progress'})
          addSubtasks('task-storyboard', [
            {id: 'sub-sb-1', label: 'Panel 1 — Opening', status: 'pending'},
            {id: 'sub-sb-2', label: 'Panel 2 — Elena', status: 'pending'},
            {id: 'sub-sb-3', label: 'Panel 3 — Bean', status: 'pending'},
          ])
          pushNode({
            id: 'storyboard-group',
            type: 'GROUP',
            name: 'storyboard',
            label: 'Storyboard',
            children: [],
          })
        }
      },

      // Panel 1 lands
      {
        time: 14000, action: () => {
          updateSubtask('task-storyboard', 'sub-sb-1', {status: 'in_progress'})
        }
      },
      {
        time: 15000, action: () => {
          updateSubtask('task-storyboard', 'sub-sb-1', {status: 'done'})
          pushChild('storyboard-group', STORYBOARD_PANELS[0])
        }
      },

      // Panel 2 lands
      {
        time: 15500, action: () => {
          updateSubtask('task-storyboard', 'sub-sb-2', {status: 'in_progress'})
        }
      },
      {
        time: 16500, action: () => {
          updateSubtask('task-storyboard', 'sub-sb-2', {status: 'done'})
          pushChild('storyboard-group', STORYBOARD_PANELS[1])
        }
      },

      // Panel 3 lands
      {
        time: 17000, action: () => {
          updateSubtask('task-storyboard', 'sub-sb-3', {status: 'in_progress'})
        }
      },
      {
        time: 18000, action: () => {
          updateSubtask('task-storyboard', 'sub-sb-3', {status: 'done'})
          pushChild('storyboard-group', STORYBOARD_PANELS[2])
          updateTask('task-storyboard', {status: 'done'})

          // Stream progress
          setIsStreaming(true)
          streamResponse(BRAND_ANALYSIS_STORYBOARD_DONE, null, () => {
            setIsStreaming(false)
          })
        }
      },

      // ---- Color treatments: variant set appears, children stream in ----

      {
        time: 20000, action: () => {
          updateTask('task-colors', {status: 'in_progress'})
          addSubtasks('task-colors', [
            {id: 'sub-color-1', label: 'Warm Analog', status: 'pending'},
            {id: 'sub-color-2', label: 'Neon Noir', status: 'pending'},
            {id: 'sub-color-3', label: 'Monochrome', status: 'pending'},
          ])
          pushNode({
            id: 'color-treatments',
            type: 'VARIANT_SET',
            name: 'color_treatments',
            label: 'Color Treatments',
            children: [],
          })
        }
      },

      {
        time: 21000, action: () => {
          updateSubtask('task-colors', 'sub-color-1', {status: 'done'})
          pushChild('color-treatments', COLOR_CHILDREN[0])
        }
      },

      {
        time: 22000, action: () => {
          updateSubtask('task-colors', 'sub-color-2', {status: 'done'})
          pushChild('color-treatments', COLOR_CHILDREN[1])
        }
      },

      {
        time: 23000, action: () => {
          updateSubtask('task-colors', 'sub-color-3', {status: 'done'})
          pushChild('color-treatments', COLOR_CHILDREN[2])
          updateTask('task-colors', {status: 'done'})
        }
      },

      // ---- Scene breakdown: group → script notes → lighting variant set ----

      {
        time: 24000, action: () => {
          updateTask('task-scene', {status: 'in_progress'})
          addSubtasks('task-scene', [
            {id: 'sub-scene-notes', label: 'Script notes', status: 'pending'},
            {id: 'sub-scene-lighting', label: 'Lighting options', status: 'pending'},
          ])
          pushNode({
            id: 'scene-breakdown',
            type: 'GROUP',
            name: 'scene_breakdown',
            label: 'Scene Breakdown',
            children: [],
          })
        }
      },

      // Script notes land
      {
        time: 25000, action: () => {
          updateSubtask('task-scene', 'sub-scene-notes', {status: 'done'})
          pushChild('scene-breakdown', SCENE_SCRIPT_NOTES)
        }
      },

      // Lighting variant set appears empty, then children land
      {
        time: 26000, action: () => {
          updateSubtask('task-scene', 'sub-scene-lighting', {status: 'in_progress'})
          pushChild('scene-breakdown', {
            id: 'sb-lighting',
            type: 'VARIANT_SET',
            name: 'lighting_options',
            label: 'Lighting Options',
            children: [],
          })
        }
      },

      {
        time: 27000, action: () => {
          pushChild('sb-lighting', LIGHTING_CHILDREN[0])
        }
      },

      {
        time: 28000, action: () => {
          pushChild('sb-lighting', LIGHTING_CHILDREN[1])
          updateSubtask('task-scene', 'sub-scene-lighting', {status: 'done'})
          updateTask('task-scene', {status: 'done'})

          // Final message
          setIsStreaming(true)
          streamResponse(BRAND_ANALYSIS_COMPLETE, null, () => {
            setIsStreaming(false)
          })
        }
      },

      // Loop after 15s
      {
        time: 28000 + 15000, action: () => {
          runBrandAnalysisWorkflowRef.current()
        }
      },
    ]

    // Schedule all timeline events
    timeline.forEach(({time, action}) => {
      const timeoutId = setTimeout(action, time)
      brandWorkflowRef.current.push(timeoutId)
    })
  }, [streamResponse, updateTask, updateSubtask, addSubtasks])

  runBrandAnalysisWorkflowRef.current = runBrandAnalysisWorkflow

  // Handle stop all tasks — cancels any in-progress tasks and subtasks
  // Returns a Promise so the button shows a "Stopping tasks" pending state.
  const handleStopAllTasks = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const cancelInProgress = (taskList: Task[]): Task[] =>
        taskList.map(t => ({
          ...t,
          status: (t.status === 'in_progress' || t.status === 'pending') ? 'cancelled' as const
              : t.status,
          subtasks: t.subtasks ? cancelInProgress(t.subtasks) : undefined,
        }))
    setTasks(cancelInProgress)
  }, [])

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

    // Remove any pending artifact nodes
    setArtifactNodes(prev => prev.filter(n => !n.artifact?.isPending))

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
          let artifactNode: ArtifactNode | null = null
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
            artifactNode = SECOND_ARTIFACT_NODE
          } else {
            const additionalIndex = (responseIndexRef.current - 2) % ADDITIONAL_RESPONSES.length
            const additional = ADDITIONAL_RESPONSES[additionalIndex]
            response = additional.content
            artifactNode = additional.artifactNode
          }

          responseIndexRef.current++

          streamResponse(response, artifactNode, () => {
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
    setArtifactNodes([])
    setTasks([])
    responseIndexRef.current = 0
    setActiveConversationId(newId)

    const newChat: Conversation = {
      id: newId,
      title: 'New Chat',
      project: 'Aurelius Playground',
      timestamp: new Date(),
      isActive: true,
    }

    setConversations((prev) =>
        [newChat, ...prev.map((c) => ({...c, isActive: false}))].slice(0, 6)
    )
  }, [])

  // Handle conversation rename
  const handleRenameConversation = useCallback((id: string, newTitle: string) => {
    setConversations((prev) =>
        prev.map((c) => (c.id === id ? {...c, title: newTitle} : c))
    )
  }, [])

  // Handle conversation selection
  const handleSelectConversation = useCallback((id: string) => {
    if (id === activeConversationId) {
      return
    }

    // Stop any ongoing workflows
    handleStop()

    setActiveConversationId(id)
    responseIndexRef.current = 0
    setArtifactNodes([])
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
  }, [activeConversationId, handleStop, runBrandAnalysisWorkflow])

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
            className="shrink-0 h-14 px-4 flex items-center justify-between border-b border-ash/40 bg-charcoal/50">
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
            <h1 className="text-sm font-semibold text-white">Chat Interface Demo</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-silver hidden md:block">
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
              onRenameConversation={handleRenameConversation}
              isStreaming={isStreaming}
              isThinking={isThinking}
              attachments={attachments}
              onAttachmentsChange={handleAttachmentsChange}
              artifactNodes={artifactNodes}
              tasks={tasks}
              tasksTitle="Workflow Progress"
              onStopAllTasks={handleStopAllTasks}
              placeholder="Send a message..."
              emptyStateHelper={getEmptyStateHelper()}
              showAttachmentButton={true}
              enableMessageActions={true}
          />
        </div>
      </div>
  )
}
