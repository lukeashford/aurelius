import React from 'react'
import { render, screen } from '@testing-library/react'
import { Stack } from '@lukeashford/aurelius'

describe('Stack', () => {
  it('renders children', () => {
    render(<Stack>Test content</Stack>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies flex class', () => {
    const { container } = render(<Stack>Content</Stack>)
    expect(container.firstChild).toHaveClass('flex')
  })

  it('applies vertical direction by default (flex-col)', () => {
    const { container } = render(<Stack>Content</Stack>)
    expect(container.firstChild).toHaveClass('flex-col')
  })

  it('applies horizontal direction', () => {
    const { container } = render(<Stack direction="horizontal">Content</Stack>)
    expect(container.firstChild).toHaveClass('flex-row')
  })

  it('applies default gap-4', () => {
    const { container } = render(<Stack>Content</Stack>)
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('applies custom gap', () => {
    const { container } = render(<Stack gap={8}>Content</Stack>)
    expect(container.firstChild).toHaveClass('gap-8')
  })

  it('applies zero gap', () => {
    const { container } = render(<Stack gap={0}>Content</Stack>)
    expect(container.firstChild).toHaveClass('gap-0')
  })

  it('applies alignment classes', () => {
    const alignments = ['start', 'center', 'end', 'stretch', 'baseline'] as const
    const alignMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    }

    alignments.forEach((align) => {
      const { container } = render(<Stack align={align}>Content</Stack>)
      expect(container.firstChild).toHaveClass(alignMap[align])
    })
  })

  it('applies justify classes', () => {
    const justifyOptions = ['start', 'center', 'end', 'between', 'around', 'evenly'] as const

    justifyOptions.forEach((justify) => {
      const { container } = render(<Stack justify={justify}>Content</Stack>)
      expect(container.firstChild).toHaveClass(`justify-${justify}`)
    })
  })

  it('applies flex-wrap when wrap is true', () => {
    const { container } = render(<Stack wrap>Content</Stack>)
    expect(container.firstChild).toHaveClass('flex-wrap')
  })

  it('renders as different elements', () => {
    const { rerender, container } = render(<Stack as="section">Content</Stack>)
    expect(container.querySelector('section')).toBeInTheDocument()

    rerender(<Stack as="nav">Content</Stack>)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<Stack className="custom-class">Content</Stack>)
    expect(container.firstChild).toHaveClass('flex', 'custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Stack ref={ref}>Content</Stack>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
