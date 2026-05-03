import React from 'react'
import {render, screen} from '@testing-library/react'
import {ChatView, type ChatViewItem} from '@lukeashford/aurelius'

describe('ChatView', () => {
  const mockItems: ChatViewItem[] = [
    {kind: 'message', id: '1', variant: 'user', content: 'Hello, how are you?'},
    {kind: 'message', id: '2', variant: 'assistant', content: 'I am doing well, thank you!'},
  ]

  it('renders without crashing', () => {
    render(<ChatView items={[]}/>)
    expect(document.body).toBeInTheDocument()
  })

  it('renders user messages', () => {
    render(<ChatView items={mockItems}/>)
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
  })

  it('renders assistant messages', () => {
    render(<ChatView items={mockItems}/>)
    expect(screen.getByText('I am doing well, thank you!')).toBeInTheDocument()
  })

  it('renders multiple messages in order', () => {
    render(<ChatView items={mockItems}/>)
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
    expect(screen.getByText('I am doing well, thank you!')).toBeInTheDocument()
  })

  it('handles empty items array', () => {
    const {container} = render(<ChatView items={[]}/>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const {container} = render(<ChatView items={mockItems} className="gap-4"/>)
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('shows thinking indicator when isThinking is true and last message is from user', () => {
    const userOnly: ChatViewItem[] = [
      {kind: 'message', id: '1', variant: 'user', content: 'Hello?'},
    ]
    render(<ChatView items={userOnly} isThinking={true}/>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('does not show thinking indicator when isThinking is false', () => {
    const userOnly: ChatViewItem[] = [
      {kind: 'message', id: '1', variant: 'user', content: 'Hello?'},
    ]
    render(<ChatView items={userOnly} isThinking={false}/>)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('does not show thinking indicator when last message is from assistant', () => {
    render(<ChatView items={mockItems} isThinking={true}/>)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders streaming message correctly', () => {
    const streaming: ChatViewItem[] = [
      {kind: 'message', id: '1', variant: 'user', content: 'Tell me a story'},
      {
        kind: 'message',
        id: '2',
        variant: 'assistant',
        content: 'Once upon a time...',
        isStreaming: true,
      },
    ]
    render(<ChatView items={streaming}/>)
    expect(screen.getByText('Once upon a time...')).toBeInTheDocument()
  })

  it('accepts branch info on a message', () => {
    const withBranch: ChatViewItem[] = [
      {
        kind: 'message',
        id: '1',
        variant: 'user',
        content: 'Hello',
        branchInfo: {
          current: 2,
          total: 3,
          onPrevious: jest.fn(),
          onNext: jest.fn(),
        },
      },
    ]
    const {container} = render(<ChatView items={withBranch}/>)
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders a checkpoint row', () => {
    const items: ChatViewItem[] = [
      {kind: 'message', id: '1', variant: 'user', content: 'Push the hero closer'},
      {
        kind: 'checkpoint',
        id: '2',
        name: 'hero_closer_pass',
        executionKind: 'task',
        status: 'completed',
      },
    ]
    render(<ChatView items={items}/>)
    expect(screen.getByText('hero_closer_pass')).toBeInTheDocument()
  })

  it('renders the greyed-future divider with summary text', () => {
    const items: ChatViewItem[] = [
      {kind: 'message', id: '1', variant: 'user', content: 'First'},
      {
        kind: 'divider',
        id: 'd',
        messageCount: 2,
        checkpointCount: 1,
        onJumpToLatest: jest.fn(),
      },
      {kind: 'message', id: '2', variant: 'assistant', content: 'Greyed', muted: true},
    ]
    render(<ChatView items={items}/>)
    expect(screen.getByText(/Later in this conversation/)).toBeInTheDocument()
    expect(screen.getByText(/Jump to latest/)).toBeInTheDocument()
  })

  it('matches snapshot with messages', () => {
    const {container} = render(<ChatView items={mockItems}/>)
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot with streaming state', () => {
    const streaming: ChatViewItem[] = [
      {kind: 'message', id: '1', variant: 'user', content: 'Question'},
      {kind: 'message', id: '2', variant: 'assistant', content: 'Answering...', isStreaming: true},
    ]
    const {container} = render(<ChatView items={streaming}/>)
    expect(container).toMatchSnapshot()
  })
})
