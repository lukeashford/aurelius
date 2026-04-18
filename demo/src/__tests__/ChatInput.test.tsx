import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ChatInput} from '@lukeashford/aurelius'

describe('ChatInput', () => {
  it('renders without crashing', () => {
    render(<ChatInput/>)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with placeholder text', () => {
    render(<ChatInput placeholder="Type a message..."/>)
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument()
  })

  it('renders send button', () => {
    render(<ChatInput/>)
    expect(screen.getByRole('button', {name: /send message/i})).toBeInTheDocument()
  })

  it('renders attachment button when showAttachmentButton is true', () => {
    render(<ChatInput showAttachmentButton={true}/>)
    expect(screen.getByRole('button', {name: /attach file/i})).toBeInTheDocument()
  })

  it('does not render attachment button when showAttachmentButton is false', () => {
    render(<ChatInput showAttachmentButton={false}/>)
    expect(screen.queryByRole('button', {name: /attach file/i})).not.toBeInTheDocument()
  })

  it('calls onSubmit when form is submitted with text', async () => {
    const onSubmit = jest.fn()
    render(<ChatInput onSubmit={onSubmit}/>)

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Hello world')

    const submitButton = screen.getByRole('button', {name: /send message/i})
    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith('Hello world', undefined)
  })

  it('clears input after submit', async () => {
    const onSubmit = jest.fn()
    render(<ChatInput onSubmit={onSubmit}/>)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    await userEvent.type(textarea, 'Hello world')
    expect(textarea.value).toBe('Hello world')

    const submitButton = screen.getByRole('button', {name: /send message/i})
    await userEvent.click(submitButton)

    expect(textarea.value).toBe('')
  })

  it('does not call onSubmit when input is empty', async () => {
    const onSubmit = jest.fn()
    render(<ChatInput onSubmit={onSubmit}/>)

    const submitButton = screen.getByRole('button', {name: /send message/i})
    await userEvent.click(submitButton)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not call onSubmit when input is only whitespace', async () => {
    const onSubmit = jest.fn()
    render(<ChatInput onSubmit={onSubmit}/>)

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, '   ')

    const submitButton = screen.getByRole('button', {name: /send message/i})
    await userEvent.click(submitButton)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits on Enter key press', async () => {
    const onSubmit = jest.fn()
    render(<ChatInput onSubmit={onSubmit}/>)

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Hello{enter}')

    expect(onSubmit).toHaveBeenCalledWith('Hello', undefined)
  })

  it('does not submit on Shift+Enter (allows new line)', async () => {
    const onSubmit = jest.fn()
    render(<ChatInput onSubmit={onSubmit}/>)

    const textarea = screen.getByRole('textbox')
    await userEvent.type(textarea, 'Hello{shift>}{enter}{/shift}')

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('disables input when disabled prop is true', () => {
    render(<ChatInput disabled={true}/>)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('disables input when isStreaming is true', () => {
    render(<ChatInput isStreaming={true}/>)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('shows stop button when isStreaming is true', () => {
    render(<ChatInput isStreaming={true} onStop={() => {
    }}/>)
    expect(screen.getByRole('button', {name: /stop generation/i})).toBeInTheDocument()
  })

  it('calls onStop when stop button is clicked', async () => {
    const onStop = jest.fn()
    render(<ChatInput isStreaming={true} onStop={onStop}/>)

    const stopButton = screen.getByRole('button', {name: /stop generation/i})
    await userEvent.click(stopButton)

    expect(onStop).toHaveBeenCalled()
  })

  it('renders helper text in centered position', () => {
    render(<ChatInput position="centered" helperText="Start typing to begin"/>)
    expect(screen.getByText('Start typing to begin')).toBeInTheDocument()
  })

  it('does not render helper text in bottom position', () => {
    render(<ChatInput position="bottom" helperText="Start typing to begin"/>)
    expect(screen.queryByText('Start typing to begin')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const {container} = render(<ChatInput className="gap-4"/>)
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('initializes with initialInputValue', () => {
    render(<ChatInput initialInputValue="Pre-filled text"/>)
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toBe('Pre-filled text')
  })

  it('handles drag and drop for files', () => {
    const onAttachmentsChange = jest.fn()
    render(
        <ChatInput
            showAttachmentButton={true}
            onAttachmentsChange={onAttachmentsChange}
        />
    )

    const container = screen.getByRole('textbox').closest('div')?.parentElement
    expect(container).toBeInTheDocument()

    // Simulate drag over
    if (container) {
      fireEvent.dragEnter(container)
      expect(screen.getByText('Drop files here')).toBeInTheDocument()
    }
  })

  it('matches snapshot in centered position', () => {
    const {container} = render(
        <ChatInput
            position="centered"
            placeholder="Send a message..."
            helperText="Type anything to start"
        />
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot in bottom position', () => {
    const {container} = render(
        <ChatInput position="bottom" placeholder="Send a message..."/>
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot with streaming state', () => {
    const {container} = render(
        <ChatInput isStreaming={true} onStop={() => {
        }}/>
    )
    expect(container).toMatchSnapshot()
  })
})
