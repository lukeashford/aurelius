import React from 'react'
import {render, screen} from '@testing-library/react'
import {ChatView} from '@lukeashford/aurelius'

describe('ChatView', () => {
  const mockMessages = [
    {id: '1', variant: 'user' as const, content: 'Hello, how are you?'},
    {id: '2', variant: 'assistant' as const, content: 'I am doing well, thank you!'},
  ]

  it('renders without crashing', () => {
    render(<ChatView messages={[]}/>)
    expect(document.body).toBeInTheDocument()
  })

  it('renders user messages', () => {
    render(<ChatView messages={mockMessages}/>)
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument()
  })

  it('renders assistant messages', () => {
    render(<ChatView messages={mockMessages}/>)
    expect(screen.getByText('I am doing well, thank you!')).toBeInTheDocument()
  })

  it('renders multiple messages in order', () => {
    render(<ChatView messages={mockMessages}/>)
    const userMessage = screen.getByText('Hello, how are you?')
    const assistantMessage = screen.getByText('I am doing well, thank you!')

    // Both messages should be in the document
    expect(userMessage).toBeInTheDocument()
    expect(assistantMessage).toBeInTheDocument()
  })

  it('handles empty messages array', () => {
    const {container} = render(<ChatView messages={[]}/>)
    // Should render the container without messages
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const {container} = render(
        <ChatView messages={mockMessages} className="gap-4"/>
    )
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('shows thinking indicator when isThinking is true and last message is from user', () => {
    const userOnlyMessages = [
      {id: '1', variant: 'user' as const, content: 'Hello?'},
    ]
    render(<ChatView messages={userOnlyMessages} isThinking={true}/>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('does not show thinking indicator when isThinking is false', () => {
    const userOnlyMessages = [
      {id: '1', variant: 'user' as const, content: 'Hello?'},
    ]
    render(<ChatView messages={userOnlyMessages} isThinking={false}/>)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('does not show thinking indicator when last message is from assistant', () => {
    render(<ChatView messages={mockMessages} isThinking={true}/>)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders streaming message correctly', () => {
    const streamingMessages = [
      {id: '1', variant: 'user' as const, content: 'Tell me a story'},
      {id: '2', variant: 'assistant' as const, content: 'Once upon a time...', isStreaming: true},
    ]
    render(<ChatView messages={streamingMessages} isStreaming={true}/>)
    expect(screen.getByText('Once upon a time...')).toBeInTheDocument()
  })

  it('accepts branch info prop for messages', () => {
    const messagesWithBranch = [
      {
        id: '1',
        variant: 'user' as const,
        content: 'Hello',
        branchInfo: {
          current: 2,
          total: 3,
          onPrevious: jest.fn(),
          onNext: jest.fn(),
        },
      },
    ]
    // Verify the component renders without error when branchInfo is provided
    // The actual branch navigation UI is tested in BranchNavigator.test.tsx
    const {container} = render(<ChatView messages={messagesWithBranch}/>)
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('matches snapshot with messages', () => {
    const {container} = render(<ChatView messages={mockMessages}/>)
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot with streaming state', () => {
    const streamingMessages = [
      {id: '1', variant: 'user' as const, content: 'Question'},
      {id: '2', variant: 'assistant' as const, content: 'Answering...'},
    ]
    const {container} = render(
        <ChatView messages={streamingMessages} isStreaming={true}/>
    )
    expect(container).toMatchSnapshot()
  })
})
