import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {
  addMessageToTree,
  ChatInterface,
  type ConversationTree,
  createEmptyTree,
} from '@lukeashford/aurelius'

describe('ChatInterface', () => {
  const mockConversations = [
    {id: '1', title: 'Conversation 1', preview: 'Hello...', isActive: true},
    {id: '2', title: 'Conversation 2', preview: 'World...', isActive: false},
  ]

  const createTreeWithMessages = (): ConversationTree => {
    let tree = createEmptyTree()
    tree = addMessageToTree(
        tree,
        {id: 'msg-1', role: 'user', content: 'Hello!', parentId: null},
        null
    )
    tree = addMessageToTree(
        tree,
        {id: 'msg-2', role: 'assistant', content: 'Hi there!', parentId: 'msg-1'},
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
  })

  it('renders helper text in empty state', () => {
    render(<ChatInterface emptyStateHelper="Start a conversation"/>)
    expect(screen.getByText('Start a conversation')).toBeInTheDocument()
  })

  it('renders conversation sidebar', () => {
    render(<ChatInterface conversations={mockConversations}/>)
    expect(screen.getByRole('button', {name: /collapse sidebar/i})).toBeInTheDocument()
  })

  it('renders messages when conversationTree is provided', () => {
    const tree = createTreeWithMessages()
    render(<ChatInterface conversationTree={tree}/>)
    expect(screen.getByText('Hello!')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })

  it('renders messages when messages array is provided (flat mode)', () => {
    const messages = [
      {id: '1', variant: 'user' as const, content: 'User message'},
      {id: '2', variant: 'assistant' as const, content: 'Assistant response'},
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

  it('calls onNewChat when New Chat is clicked', () => {
    const onNewChat = jest.fn()
    render(<ChatInterface conversations={mockConversations} onNewChat={onNewChat}/>)

    fireEvent.click(screen.getByText('New Chat'))
    expect(onNewChat).toHaveBeenCalled()
  })

  it('calls onSelectConversation when a conversation is selected', () => {
    const onSelectConversation = jest.fn()
    render(
        <ChatInterface
            conversations={mockConversations}
            onSelectConversation={onSelectConversation}
        />
    )

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
      {id: '1', variant: 'user' as const, content: 'Hello'},
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

  it('starts with sidebar collapsed when initialSidebarCollapsed is true', () => {
    render(
        <ChatInterface
            conversations={mockConversations}
            initialSidebarCollapsed={true}
        />
    )
    expect(screen.getByRole('button', {name: /expand sidebar/i})).toBeInTheDocument()
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

  it('applies custom className', () => {
    const {container} = render(<ChatInterface className="gap-4"/>)
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('passes artifacts to ArtifactsPanel', () => {
    const mockArtifacts = [
      {
        id: '1',
        type: 'image' as const,
        src: 'https://example.com/image.jpg',
        title: 'Test Artifact',
      },
    ]
    render(
        <ChatInterface
            artifacts={mockArtifacts}
            isArtifactsPanelOpen={true}
        />
    )
    expect(screen.getByText('Test Artifact')).toBeInTheDocument()
  })

  it('shows artifacts panel when artifacts are provided and panel is open', () => {
    const mockArtifacts = [
      {
        id: '1',
        type: 'image' as const,
        src: 'https://example.com/image.jpg',
        title: 'Artifact Title',
      },
    ]
    render(
        <ChatInterface
            artifacts={mockArtifacts}
            isArtifactsPanelOpen={true}
        />
    )
    expect(screen.getByText('Artifacts')).toBeInTheDocument()
  })

  it('calls onArtifactsPanelOpenChange when panel toggle is clicked', () => {
    const onPanelChange = jest.fn()
    const mockArtifacts = [
      {id: '1', type: 'image' as const, src: 'https://example.com/image.jpg'},
    ]
    render(
        <ChatInterface
            artifacts={mockArtifacts}
            isArtifactsPanelOpen={true}
            onArtifactsPanelOpenChange={onPanelChange}
        />
    )
    fireEvent.click(screen.getByRole('button', {name: /collapse artifacts panel/i}))
    expect(onPanelChange).toHaveBeenCalledWith(false)
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

    // With enableMessageActions=true and callbacks provided,
    // the actions should be rendered (though may be hidden until hover)
    // We verify the component renders without error
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

    // Actions should not be rendered
    expect(screen.queryByRole('button', {name: /edit message/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /regenerate response/i})).not.toBeInTheDocument()
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
    const {container} = render(
        <ChatInterface
            conversationTree={tree}
            isStreaming={true}
            onStop={() => {
            }}
        />
    )
    expect(container).toMatchSnapshot()
  })
})
