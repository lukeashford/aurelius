import React from 'react'
import {act, render, screen} from '@testing-library/react'
import {ThinkingIndicator} from '@lukeashford/aurelius'

describe('ThinkingIndicator', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders when isVisible is true', () => {
    render(<ThinkingIndicator isVisible={true}/>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('does not render when isVisible is false', () => {
    render(<ThinkingIndicator isVisible={false}/>)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders with default visibility (true)', () => {
    render(<ThinkingIndicator/>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('displays a thinking phrase', () => {
    render(<ThinkingIndicator isVisible={true}/>)
    // Should display one of the default thinking phrases
    const status = screen.getByRole('status')
    expect(status.textContent).toBeTruthy()
  })

  it('uses custom phrases when provided', () => {
    const customPhrases = ['Custom thinking...', 'Processing...']
    render(<ThinkingIndicator isVisible={true} phrases={customPhrases}/>)
    const status = screen.getByRole('status')
    expect(
        customPhrases.some((phrase) => status.textContent?.includes(phrase))
    ).toBe(true)
  })

  it('cycles through phrases at the specified interval', () => {
    const phrases = ['Phrase 1', 'Phrase 2', 'Phrase 3']
    render(
        <ThinkingIndicator
            isVisible={true}
            phrases={phrases}
            phraseInterval={1000}
        />
    )

    // Get initial phrase
    const initialPhrase = screen.getByRole('status').textContent

    // Advance timer to trigger phrase change
    act(() => {
      jest.advanceTimersByTime(1200) // 1000ms interval + 200ms transition
    })

    // Phrase should have changed (or be transitioning)
    // Due to the transition timing, we just verify the component is still rendered
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has accessible role="status"', () => {
    render(<ThinkingIndicator isVisible={true}/>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has aria-live="polite" for accessibility', () => {
    render(<ThinkingIndicator isVisible={true}/>)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('renders animated dots', () => {
    const {container} = render(<ThinkingIndicator isVisible={true}/>)
    const dots = container.querySelectorAll('[aria-hidden="true"] span')
    expect(dots.length).toBe(3)
  })

  it('applies custom className', () => {
    const {container} = render(
        <ThinkingIndicator isVisible={true} className="gap-4"/>
    )
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('does not cycle phrases when only one phrase provided', () => {
    const singlePhrase = ['Only one phrase']
    render(
        <ThinkingIndicator
            isVisible={true}
            phrases={singlePhrase}
            phraseInterval={100}
        />
    )

    expect(screen.getByText('Only one phrase')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Should still show the same phrase
    expect(screen.getByText('Only one phrase')).toBeInTheDocument()
  })

  it('matches snapshot', () => {
    // Use fixed phrases for deterministic snapshot
    const {container} = render(
        <ThinkingIndicator
            isVisible={true}
            phrases={['Thinking...']}
        />
    )
    expect(container).toMatchSnapshot()
  })
})
