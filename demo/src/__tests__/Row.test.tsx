import React from 'react'
import { render, screen } from '@testing-library/react'
import { Row } from '@lukeashford/aurelius'

describe('Row', () => {
  it('renders children', () => {
    render(<Row>Test content</Row>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies row class', () => {
    const { container } = render(<Row>Content</Row>)
    expect(container.firstChild).toHaveClass('row')
  })

  it('applies default gap-4 class', () => {
    const { container } = render(<Row>Content</Row>)
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('applies custom gutter', () => {
    const { container } = render(<Row gutter={6}>Content</Row>)
    expect(container.firstChild).toHaveClass('gap-6')
  })

  it('applies directional gutters', () => {
    const { container } = render(<Row gutterX={4} gutterY={2}>Content</Row>)
    expect(container.firstChild).toHaveClass('gap-x-4', 'gap-y-2')
    expect(container.firstChild).not.toHaveClass('gap-4')
  })

  it('applies zero gutter', () => {
    const { container } = render(<Row gutter={0}>Content</Row>)
    expect(container.firstChild).toHaveClass('gap-0')
  })

  it('applies justify alignment', () => {
    const { container } = render(<Row justify="center">Content</Row>)
    expect(container.firstChild).toHaveClass('justify-center')
  })

  it('applies all justify variants', () => {
    const justifyVariants = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const
    justifyVariants.forEach((justify) => {
      const { container } = render(<Row justify={justify}>Content</Row>)
      expect(container.firstChild).toHaveClass(`justify-${justify}`)
    })
  })

  it('applies align alignment', () => {
    const { container } = render(<Row align="center">Content</Row>)
    expect(container.firstChild).toHaveClass('items-center')
  })

  it('applies all align variants', () => {
    const alignMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    } as const

    Object.entries(alignMap).forEach(([align, className]) => {
      const { container } = render(<Row align={align as keyof typeof alignMap}>Content</Row>)
      expect(container.firstChild).toHaveClass(className)
    })
  })

  it('merges custom className', () => {
    const { container } = render(<Row className="custom-class">Content</Row>)
    expect(container.firstChild).toHaveClass('row', 'custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Row ref={ref}>Content</Row>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
