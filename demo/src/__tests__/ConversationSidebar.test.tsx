import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {ConversationSidebar} from '@lukeashford/aurelius'

describe('ConversationSidebar', () => {
  const mockConversations = [
    {
      id: '1',
      title: 'First Conversation',
      preview: 'Hello, how can I help?',
      timestamp: '2 hours ago',
      isActive: true,
    },
    {
      id: '2',
      title: 'Second Conversation',
      preview: 'Let me explain...',
      timestamp: 'Yesterday',
      isActive: false,
    },
  ]

  it('renders without crashing', () => {
    render(<ConversationSidebar conversations={[]}/>)
    expect(document.body).toBeInTheDocument()
  })

  it('renders expanded by default', () => {
    render(<ConversationSidebar conversations={mockConversations}/>)
    expect(screen.getByText('First Conversation')).toBeInTheDocument()
  })

  it('renders collapsed when isCollapsed is true', () => {
    render(
        <ConversationSidebar conversations={mockConversations} isCollapsed={true}/>
    )
    expect(screen.queryByText('First Conversation')).not.toBeInTheDocument()
    expect(screen.getByRole('button', {name: /expand sidebar/i})).toBeInTheDocument()
  })

  it('renders New Chat button when expanded', () => {
    render(<ConversationSidebar conversations={mockConversations}/>)
    expect(screen.getByText('New Chat')).toBeInTheDocument()
  })

  it('calls onNewChat when New Chat button is clicked', () => {
    const onNewChat = jest.fn()
    render(
        <ConversationSidebar
            conversations={mockConversations}
            onNewChat={onNewChat}
        />
    )

    fireEvent.click(screen.getByText('New Chat'))
    expect(onNewChat).toHaveBeenCalled()
  })

  it('renders conversation titles', () => {
    render(<ConversationSidebar conversations={mockConversations}/>)
    expect(screen.getByText('First Conversation')).toBeInTheDocument()
    expect(screen.getByText('Second Conversation')).toBeInTheDocument()
  })

  it('renders conversation previews', () => {
    render(<ConversationSidebar conversations={mockConversations}/>)
    expect(screen.getByText('Hello, how can I help?')).toBeInTheDocument()
    expect(screen.getByText('Let me explain...')).toBeInTheDocument()
  })

  it('renders conversation timestamps', () => {
    render(<ConversationSidebar conversations={mockConversations}/>)
    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
  })

  it('calls onSelectConversation when a conversation is clicked', () => {
    const onSelectConversation = jest.fn()
    render(
        <ConversationSidebar
            conversations={mockConversations}
            onSelectConversation={onSelectConversation}
        />
    )

    fireEvent.click(screen.getByText('Second Conversation'))
    expect(onSelectConversation).toHaveBeenCalledWith('2')
  })

  it('highlights the active conversation', () => {
    render(<ConversationSidebar conversations={mockConversations}/>)
    const activeButton = screen.getByText('First Conversation').closest('button')
    expect(activeButton).toHaveClass('bg-ash/40')
  })

  it('calls onToggleCollapse when collapse button is clicked', () => {
    const onToggleCollapse = jest.fn()
    render(
        <ConversationSidebar
            conversations={mockConversations}
            onToggleCollapse={onToggleCollapse}
        />
    )

    const collapseButton = screen.getByRole('button', {name: /collapse sidebar/i})
    fireEvent.click(collapseButton)
    expect(onToggleCollapse).toHaveBeenCalled()
  })

  it('calls onToggleCollapse when expand button is clicked in collapsed state', () => {
    const onToggleCollapse = jest.fn()
    render(
        <ConversationSidebar
            conversations={mockConversations}
            isCollapsed={true}
            onToggleCollapse={onToggleCollapse}
        />
    )

    const expandButton = screen.getByRole('button', {name: /expand sidebar/i})
    fireEvent.click(expandButton)
    expect(onToggleCollapse).toHaveBeenCalled()
  })

  it('shows empty state message when no conversations', () => {
    render(<ConversationSidebar conversations={[]}/>)
    expect(screen.getByText('No conversations yet')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const {container} = render(
        <ConversationSidebar
            conversations={mockConversations}
            className="gap-4"
        />
    )
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('matches snapshot when expanded', () => {
    const {container} = render(
        <ConversationSidebar conversations={mockConversations}/>
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot when collapsed', () => {
    const {container} = render(
        <ConversationSidebar conversations={mockConversations} isCollapsed={true}/>
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot with empty conversations', () => {
    const {container} = render(<ConversationSidebar conversations={[]}/>)
    expect(container).toMatchSnapshot()
  })
})
