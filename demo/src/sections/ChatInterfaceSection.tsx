import React, {useState} from 'react'
import {
  ChatView,
  ChatInput,
  ConversationSidebar,
  ArtifactsPanel,
  type ChatViewItem,
  type Conversation,
  type Artifact,
} from '@lukeashford/aurelius'
import Section from './Section'

const sampleConversations: Conversation[] = [
  {id: '1', title: 'Project Planning', preview: 'Discussing Q4 roadmap...', timestamp: 'Today', isActive: true},
  {id: '2', title: 'Code Review Help', preview: 'Looking at the PR...', timestamp: 'Yesterday'},
  {id: '3', title: 'Design Feedback', preview: 'The new dashboard...', timestamp: '2 days ago'},
]

const sampleMessages: ChatViewItem[] = [
  {
    id: 'user-1',
    variant: 'user',
    content: 'Can you help me understand how to structure a React component library?',
  },
  {
    id: 'assistant-1',
    variant: 'assistant',
    content: `<p>I'd be happy to help you structure a React component library. Here are the key considerations:</p>
<ul>
<li><strong>Directory Structure</strong>: Organize components by category (layout, forms, feedback, etc.)</li>
<li><strong>Exports</strong>: Use a central index.ts to re-export all components</li>
<li><strong>TypeScript</strong>: Define clear prop interfaces for each component</li>
<li><strong>Styling</strong>: Use a consistent approach like Tailwind CSS or CSS-in-JS</li>
</ul>
<p>Would you like me to go into more detail on any of these points?</p>`,
  },
  {
    id: 'user-2',
    variant: 'user',
    content: 'Yes, tell me more about the directory structure.',
  },
  {
    id: 'assistant-2',
    variant: 'assistant',
    content: `<p>A well-organized directory structure makes your library maintainable. Here's a recommended approach:</p>
<pre><code>src/components/
├── layout/
│   ├── Container.tsx
│   ├── Row.tsx
│   └── index.ts
├── forms/
│   ├── Input.tsx
│   ├── Select.tsx
│   └── index.ts
├── feedback/
│   ├── Alert.tsx
│   ├── Toast.tsx
│   └── index.ts
└── index.ts</code></pre>
<p>Each category folder has its own index.ts for local exports, and the root index.ts re-exports everything.</p>`,
  },
]

const sampleArtifacts: Artifact[] = [
  {
    id: 'artifact-1',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    alt: 'Code on screen',
    title: 'Component Architecture',
    subtitle: 'Visual representation of the structure',
  },
]

export default function ChatInterfaceSection() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [panelOpen, setPanelOpen] = useState(true)

  return (
    <Section
      title="Chat Interface"
      subtitle="A production-grade chat experience with smart scrolling, artifacts panel, and conversation sidebar."
    >
      <div className="space-y-8">
        {/* Link to full demo */}
        <div className="p-4 bg-gold/10 border border-gold/30 rounded-lg">
          <p className="text-white mb-2">
            <strong>Experience the full interactive demo:</strong>
          </p>
          <a
            href="#chat-demo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-medium rounded-md hover:bg-gold-bright transition-colors"
          >
            <span>Launch Chat Demo</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        {/* ChatView demo */}
        <div>
          <h3 className="text-lg font-semibold mb-4">ChatView</h3>
          <p className="text-silver text-sm mb-4">
            The main conversation thread with smart scroll anchoring. User messages anchor to the top when sent.
          </p>
          <div className="h-96 border border-ash/40 rounded-lg overflow-hidden bg-obsidian">
            <ChatView messages={sampleMessages} />
          </div>
        </div>

        {/* ChatInput demo */}
        <div>
          <h3 className="text-lg font-semibold mb-4">ChatInput</h3>
          <p className="text-silver text-sm mb-4">
            Position-aware input component. Centers in empty state, sticks to bottom in conversation mode.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-silver mb-2">Bottom Position (default)</label>
              <ChatInput
                position="bottom"
                placeholder="Type a message..."
                onSubmit={(msg) => console.log('Submitted:', msg)}
              />
            </div>
            <div>
              <label className="block text-sm text-silver mb-2">Centered Position (empty state)</label>
              <div className="h-48 border border-ash/40 rounded-lg bg-obsidian flex items-center justify-center">
                <ChatInput
                  position="centered"
                  placeholder="Start a conversation..."
                  helperText="Type anything to see a sample response"
                  onSubmit={(msg) => console.log('Submitted:', msg)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ConversationSidebar demo */}
        <div>
          <h3 className="text-lg font-semibold mb-4">ConversationSidebar</h3>
          <p className="text-silver text-sm mb-4">
            Collapsible sidebar showing past conversations with new chat button.
          </p>
          <div className="flex h-80 border border-ash/40 rounded-lg overflow-hidden">
            <ConversationSidebar
              conversations={sampleConversations}
              isCollapsed={sidebarCollapsed}
              onSelectConversation={(id) => console.log('Selected:', id)}
              onNewChat={() => console.log('New chat')}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div className="flex-1 flex items-center justify-center text-silver bg-obsidian">
              {sidebarCollapsed ? 'Sidebar collapsed — click hamburger to expand' : 'Main content area'}
            </div>
          </div>
        </div>

        {/* ArtifactsPanel demo */}
        <div>
          <h3 className="text-lg font-semibold mb-4">ArtifactsPanel</h3>
          <p className="text-silver text-sm mb-4">
            Slide-in panel for rich content artifacts. Supports images, videos, and text content.
          </p>
          <div className="flex h-96 border border-ash/40 rounded-lg overflow-hidden">
            <div className="flex-1 flex items-center justify-center text-silver bg-obsidian">
              <button
                onClick={() => setPanelOpen(!panelOpen)}
                className="px-4 py-2 bg-ash/30 hover:bg-ash/50 rounded-md transition-colors"
              >
                {panelOpen ? 'Close Panel' : 'Open Panel'}
              </button>
            </div>
            <ArtifactsPanel
              artifacts={sampleArtifacts}
              isOpen={panelOpen}
              onClose={() => setPanelOpen(false)}
            />
          </div>
        </div>
      </div>
    </Section>
  )
}
