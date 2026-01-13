import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MessageActions} from '@lukeashford/aurelius'

// Mock clipboard API
const mockWriteText = jest.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
})

describe('MessageActions', () => {
  beforeEach(() => {
    mockWriteText.mockClear()
    mockWriteText.mockResolvedValue(undefined)
  })

  it('renders without crashing', () => {
    render(<MessageActions variant="user" content="Test message"/>)
    expect(document.body).toBeInTheDocument()
  })

  it('renders copy button for user messages', () => {
    render(<MessageActions variant="user" content="Test message"/>)
    expect(screen.getByRole('button', {name: /copy message/i})).toBeInTheDocument()
  })

  it('renders copy button for assistant messages', () => {
    render(<MessageActions variant="assistant" content="Test response"/>)
    expect(screen.getByRole('button', {name: /copy message/i})).toBeInTheDocument()
  })

  it('copies content to clipboard when copy button is clicked', async () => {
    render(<MessageActions variant="user" content="Test message to copy"/>)

    const copyButton = screen.getByRole('button', {name: /copy message/i})
    await userEvent.click(copyButton)

    expect(mockWriteText).toHaveBeenCalledWith('Test message to copy')
  })

  it('shows check icon after copying', async () => {
    render(<MessageActions variant="user" content="Test message"/>)

    const copyButton = screen.getByRole('button', {name: /copy message/i})
    await userEvent.click(copyButton)

    await waitFor(() => {
      expect(screen.getByRole('button', {name: /copied!/i})).toBeInTheDocument()
    })
  })

  it('renders edit button for user messages when onEdit is provided', () => {
    render(
        <MessageActions
            variant="user"
            content="Test message"
            onEdit={() => {
            }}
        />
    )
    expect(screen.getByRole('button', {name: /edit message/i})).toBeInTheDocument()
  })

  it('does not render edit button for assistant messages', () => {
    render(
        <MessageActions
            variant="assistant"
            content="Test response"
            onEdit={() => {
            }}
        />
    )
    expect(screen.queryByRole('button', {name: /edit message/i})).not.toBeInTheDocument()
  })

  it('renders retry button for assistant messages when onRetry is provided', () => {
    render(
        <MessageActions
            variant="assistant"
            content="Test response"
            onRetry={() => {
            }}
        />
    )
    expect(screen.getByRole('button', {name: /regenerate response/i})).toBeInTheDocument()
  })

  it('does not render retry button for user messages', () => {
    render(
        <MessageActions
            variant="user"
            content="Test message"
            onRetry={() => {
            }}
        />
    )
    expect(screen.queryByRole('button', {name: /regenerate response/i})).not.toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const onRetry = jest.fn()
    render(
        <MessageActions
            variant="assistant"
            content="Test response"
            onRetry={onRetry}
        />
    )

    await userEvent.click(screen.getByRole('button', {name: /regenerate response/i}))
    expect(onRetry).toHaveBeenCalled()
  })

  it('shows edit input when edit button is clicked', async () => {
    render(
        <MessageActions
            variant="user"
            content="Original message"
            onEdit={() => {
            }}
        />
    )

    await userEvent.click(screen.getByRole('button', {name: /edit message/i}))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('Original message')
  })

  it('calls onEdit with new content when edit is submitted', async () => {
    const onEdit = jest.fn()
    render(
        <MessageActions
            variant="user"
            content="Original message"
            onEdit={onEdit}
        />
    )

    await userEvent.click(screen.getByRole('button', {name: /edit message/i}))

    const textarea = screen.getByRole('textbox')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Edited message')

    await userEvent.click(screen.getByRole('button', {name: /submit edit/i}))
    expect(onEdit).toHaveBeenCalledWith('Edited message')
  })

  it('cancels edit when cancel button is clicked', async () => {
    render(
        <MessageActions
            variant="user"
            content="Original message"
            onEdit={() => {
            }}
        />
    )

    await userEvent.click(screen.getByRole('button', {name: /edit message/i}))
    expect(screen.getByRole('textbox')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', {name: /cancel edit/i}))
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('cancels edit when Escape key is pressed', async () => {
    render(
        <MessageActions
            variant="user"
            content="Original message"
            onEdit={() => {
            }}
        />
    )

    await userEvent.click(screen.getByRole('button', {name: /edit message/i}))
    const textarea = screen.getByRole('textbox')

    fireEvent.keyDown(textarea, {key: 'Escape'})
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('submits edit when Enter key is pressed', async () => {
    const onEdit = jest.fn()
    render(
        <MessageActions
            variant="user"
            content="Original message"
            onEdit={onEdit}
        />
    )

    await userEvent.click(screen.getByRole('button', {name: /edit message/i}))

    const textarea = screen.getByRole('textbox')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'New message{enter}')

    expect(onEdit).toHaveBeenCalledWith('New message')
  })

  it('does not submit edit when content is unchanged', async () => {
    const onEdit = jest.fn()
    render(
        <MessageActions
            variant="user"
            content="Original message"
            onEdit={onEdit}
        />
    )

    await userEvent.click(screen.getByRole('button', {name: /edit message/i}))
    await userEvent.click(screen.getByRole('button', {name: /submit edit/i}))

    expect(onEdit).not.toHaveBeenCalled()
  })

  it('disables submit button when edit content is empty', async () => {
    render(
        <MessageActions
            variant="user"
            content="Original message"
            onEdit={() => {
            }}
        />
    )

    await userEvent.click(screen.getByRole('button', {name: /edit message/i}))

    const textarea = screen.getByRole('textbox')
    await userEvent.clear(textarea)

    expect(screen.getByRole('button', {name: /submit edit/i})).toBeDisabled()
  })

  it('applies custom className', () => {
    const {container} = render(
        <MessageActions
            variant="user"
            content="Test message"
            className="custom-actions"
        />
    )
    expect(container.firstChild).toHaveClass('custom-actions')
  })

  it('matches snapshot for user message', () => {
    const {container} = render(
        <MessageActions
            variant="user"
            content="Test message"
            onEdit={() => {
            }}
        />
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot for assistant message', () => {
    const {container} = render(
        <MessageActions
            variant="assistant"
            content="Test response"
            onRetry={() => {
            }}
        />
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot in edit mode', () => {
    const {container} = render(
        <MessageActions
            variant="user"
            content="Test message"
            onEdit={() => {
            }}
            isEditing={true}
        />
    )
    expect(container).toMatchSnapshot()
  })
})
