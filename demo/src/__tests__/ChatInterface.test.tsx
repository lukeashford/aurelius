import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {
  addNodeToTree,
  ChatInterface,
  type ChatInterfaceHandle,
  createEmptyTree,
  type MessageNode,
} from '@lukeashford/aurelius'

describe('ChatInterface', () => {
  const mockConversations = [
    {id: '1', title: 'Conversation 1', project: 'Alpha', isActive: true},
    {id: '2', title: 'Conversation 2', project: 'Beta', isActive: false},
  ]

  const createTreeWithMessages = () => {
    let tree = createEmptyTree<MessageNode>()
    tree = addNodeToTree(
        tree,
        {
          kind: 'message' as const,id: 'msg-1', role: 'user', content: 'Hello!', parentId: null},
        null
    )
    tree = addNodeToTree(
        tree,
        {
          kind: 'message' as const,id: 'msg-2', role: 'assistant', content: 'Hi there!', parentId: 'msg-1'},
        'msg-1'
    )
    return tree
  }

  it('renders without crashing', () => {
    render(<ChatInterface/>)
    expect(document.body).toBeInTheDocument()
  })

  it('renders empty state with input centered', () => {
    render(<ChatInterface/>)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('Welcome!')).toBeInTheDocument()
    expect(screen.getByText("Let's talk.")).toBeInTheDocument()
  })

  it('renders helper text in empty state', () => {
    render(<ChatInterface emptyStateHelper="Start a conversation"/>)
    expect(screen.getByText('Start a conversation')).toBeInTheDocument()
  })

  it('renders history tool button in left sidebar', () => {
    render(<ChatInterface conversations={mockConversations}/>)
    expect(screen.getByRole('button', {name: /history/i})).toBeInTheDocument()
  })

  it('renders messages when conversationTree is provided', () => {
    const tree = createTreeWithMessages()
    render(<ChatInterface conversationTree={tree}/>)
    expect(screen.getByText('Hello!')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })

  it('renders messages when messages array is provided (flat mode)', () => {
    const messages = [
      {
        id: '1',
        kind: 'message' as const,
        role: 'user' as const,
        content: 'User message',
        parentId: null,
        children: [],
      },
      {
        id: '2',
        kind: 'message' as const,
        role: 'assistant' as const,
        content: 'Assistant response',
        parentId: '1',
        children: [],
      },
    ]
    render(<ChatInterface messages={messages}/>)
    expect(screen.getByText('User message')).toBeInTheDocument()
    expect(screen.getByText('Assistant response')).toBeInTheDocument()
  })

  it('calls onMessageSubmit when a message is submitted', () => {
    const onMessageSubmit = jest.fn()
    render(<ChatInterface onMessageSubmit={onMessageSubmit}/>)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, {target: {value: 'Test message'}})
    fireEvent.keyDown(textarea, {key: 'Enter', code: 'Enter'})

    expect(onMessageSubmit).toHaveBeenCalledWith('Test message', undefined)
  })

  it('calls onNewChat when New Chat is clicked in history panel', () => {
    const onNewChat = jest.fn()
    render(<ChatInterface conversations={mockConversations} onNewChat={onNewChat}/>)

    // History panel is open by default
    fireEvent.click(screen.getByText('New Chat'))
    expect(onNewChat).toHaveBeenCalled()
  })

  it('calls onSelectConversation when a conversation is selected in history panel', () => {
    const onSelectConversation = jest.fn()
    render(
        <ChatInterface
            conversations={mockConversations}
            onSelectConversation={onSelectConversation}
        />
    )

    // History panel is open by default
    fireEvent.click(screen.getByText('Conversation 2'))
    expect(onSelectConversation).toHaveBeenCalledWith('2')
  })

  it('shows stop button when isStreaming is true', () => {
    const tree = createTreeWithMessages()
    render(
        <ChatInterface
            conversationTree={tree}
            isStreaming={true}
            onStop={() => {
            }}
        />
    )
    expect(screen.getByRole('button', {name: /stop generation/i})).toBeInTheDocument()
  })

  it('renders TodosList when tasks are provided and artifacts tool is open', () => {
    const tasks = [
      {id: '1', label: 'Task 1', status: 'in_progress' as const},
    ]
    // Tasks auto-open the todos tool when tasks data arrives
    render(<ChatInterface tasks={tasks}/>)
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('Task 1')).toBeInTheDocument()
  })

  it('calls onStop when stop button is clicked', () => {
    const onStop = jest.fn()
    const tree = createTreeWithMessages()
    render(
        <ChatInterface
            conversationTree={tree}
            isStreaming={true}
            onStop={onStop}
        />
    )

    fireEvent.click(screen.getByRole('button', {name: /stop generation/i}))
    expect(onStop).toHaveBeenCalled()
  })

  it('shows thinking indicator when isThinking is true', () => {
    const messagesWithUserLast = [
      {
        id: '1',
        kind: 'message' as const,
        role: 'user' as const,
        content: 'Hello',
        parentId: null,
        children: [],
      },
    ]
    render(
        <ChatInterface
            messages={messagesWithUserLast}
            isThinking={true}
        />
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders attachment button when showAttachmentButton is true', () => {
    render(<ChatInterface showAttachmentButton={true}/>)
    expect(screen.getByRole('button', {name: /attach file/i})).toBeInTheDocument()
  })

  it('does not render attachment button when showAttachmentButton is false', () => {
    render(<ChatInterface showAttachmentButton={false}/>)
    expect(screen.queryByRole('button', {name: /attach file/i})).not.toBeInTheDocument()
  })

  it('disables input when streaming and no onStop provided', () => {
    const tree = createTreeWithMessages()
    render(
        <ChatInterface
            conversationTree={tree}
            isStreaming={true}
        />
    )
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('shows conversations by default in open history tool', () => {
    render(<ChatInterface conversations={mockConversations}/>)

    // History panel is open by default
    expect(screen.getByText('Conversation 1')).toBeInTheDocument()
    expect(screen.getByText('Conversation 2')).toBeInTheDocument()

    // Can be closed
    fireEvent.click(screen.getByRole('button', {name: /history/i}))
    expect(screen.queryByText('Conversation 1')).not.toBeInTheDocument()
  })

  it('renders custom placeholder', () => {
    render(<ChatInterface placeholder="Ask me anything..."/>)
    expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument()
  })

  it('renders custom empty state', () => {
    render(
        <ChatInterface
            emptyState={<div data-testid="custom-empty">Custom Empty State</div>}
        />
    )
    expect(screen.getByTestId('custom-empty')).toBeInTheDocument()
  })

  it('initializes with initialInputValue', () => {
    render(<ChatInterface initialInputValue="Pre-filled interface text"/>)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toBe('Pre-filled interface text')
  })

  it('renders input even when custom empty state is provided', () => {
    render(
        <ChatInterface
            emptyState={<div data-testid="custom-empty">Custom Empty State</div>}
        />
    )
    expect(screen.getByTestId('custom-empty')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const {container} = render(<ChatInterface className="gap-4"/>)
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('shows artifacts panel when artifacts tool is toggled via isArtifactsPanelOpen', () => {
    const mockNodes = [
      {
        id: 'node-1',
        type: 'ARTIFACT' as const,
        name: 'test_artifact',
        label: 'Test Artifact',
        artifact: {
          id: '1',
          type: 'IMAGE' as const,
          url: 'https://example.com/image.jpg',
          title: 'Test Artifact',
        },
        children: [],
      },
    ]
    render(
        <ChatInterface
            artifactNodes={mockNodes}
            isArtifactsPanelOpen={true}
        />
    )
    expect(screen.getByText('Test Artifact')).toBeInTheDocument()
  })

  it('shows artifacts panel header when open', () => {
    const mockNodes = [
      {
        id: 'node-1',
        type: 'ARTIFACT' as const,
        name: 'artifact_title',
        label: 'Artifact Title',
        artifact: {
          id: '1',
          type: 'IMAGE' as const,
          url: 'https://example.com/image.jpg',
          title: 'Artifact Title',
        },
        children: [],
      },
    ]
    render(
        <ChatInterface
            artifactNodes={mockNodes}
            isArtifactsPanelOpen={true}
        />
    )
    expect(screen.getByText('Artifacts')).toBeInTheDocument()
  })

  it('renders tool sidebar with tool buttons', () => {
    render(<ChatInterface/>)
    expect(screen.getByRole('button', {name: /artifacts/i})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: /tasks/i})).toBeInTheDocument()
  })

  it('enables message actions when enableMessageActions is true', () => {
    const tree = createTreeWithMessages()

    render(
        <ChatInterface
            conversationTree={tree}
            enableMessageActions={true}
            onEditMessage={() => {
            }}
            onRetryMessage={() => {
            }}
        />
    )

    expect(screen.getByText('Hello!')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })

  it('disables message actions when enableMessageActions is false', () => {
    const tree = createTreeWithMessages()

    render(
        <ChatInterface
            conversationTree={tree}
            enableMessageActions={false}
        />
    )

    expect(screen.queryByRole('button', {name: /edit message/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /regenerate response/i})).not.toBeInTheDocument()
  })

  describe('openArtifact imperative handle', () => {
    const mockNodes = [
      {
        id: 'node-1',
        type: 'ARTIFACT' as const,
        name: 'sunset',
        label: 'Sunset',
        artifact: {
          id: 'sunset',
          type: 'IMAGE' as const,
          url: 'https://example.com/sunset.jpg',
          title: 'Sunset',
        },
        children: [],
      },
    ]

    it('surfaces the lightbox for a known artifact', () => {
      const ref = React.createRef<ChatInterfaceHandle>()
      render(<ChatInterface ref={ref} artifactNodes={mockNodes}/>)

      // Panel auto-opens because nodes arrive on mount; no lightbox yet.
      expect(screen.queryByRole('button', {name: /close/i})).not.toBeInTheDocument()

      React.act(() => {
        ref.current!.openArtifact('sunset')
      })

      // Lightbox close affordance proves the lightbox opened.
      expect(screen.getByRole('button', {name: /close/i})).toBeInTheDocument()
    })

    it('is a no-op for unknown names — panel still mounted, no lightbox', () => {
      const ref = React.createRef<ChatInterfaceHandle>()
      render(<ChatInterface ref={ref} artifactNodes={mockNodes}/>)

      React.act(() => {
        ref.current!.openArtifact('ghost')
      })

      expect(screen.getByTestId('artifacts-panel')).toBeInTheDocument()
      expect(screen.queryByRole('button', {name: /close/i})).not.toBeInTheDocument()
    })

    it('reopens the panel after the user dismissed it', () => {
      const ref = React.createRef<ChatInterfaceHandle>()
      render(<ChatInterface ref={ref} artifactNodes={mockNodes}/>)

      // User dismisses the auto-opened panel.
      fireEvent.click(screen.getByRole('button', {name: /artifacts/i}))
      expect(screen.queryByTestId('artifacts-panel')).not.toBeInTheDocument()

      // Imperative call overrides the dismissal.
      React.act(() => {
        ref.current!.openArtifact('sunset')
      })

      expect(screen.getByTestId('artifacts-panel')).toBeInTheDocument()
      expect(screen.getByRole('button', {name: /close/i})).toBeInTheDocument()
    })
  })

  it('matches snapshot in empty state', () => {
    const {container} = render(
        <ChatInterface
            conversations={mockConversations}
            placeholder="Send a message..."
            emptyStateHelper="Type to begin"
        />
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot with messages', () => {
    const tree = createTreeWithMessages()
    const {container} = render(
        <ChatInterface
            conversationTree={tree}
            conversations={mockConversations}
        />
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot while streaming', () => {
    const tree = createTreeWithMessages()
    // Per-node isStreaming drives the cursor; the global flag only gates input.
    const streamingTree = {
      ...tree,
      nodes: {
        ...tree.nodes,
        'msg-2': {...tree.nodes['msg-2'], isStreaming: true},
      },
    }
    const {container} = render(
        <ChatInterface
            conversationTree={streamingTree}
            isStreaming={true}
            onStop={() => {
            }}
        />
    )
    expect(container).toMatchSnapshot()
  })
})
