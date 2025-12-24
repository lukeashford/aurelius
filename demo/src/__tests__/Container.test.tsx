import React from 'react'
import { render, screen } from '@testing-library/react'
import { Container } from '@lukeashford/aurelius'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Test content</Container>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies responsive container class by default', () => {
    const { container } = render(<Container>Content</Container>)
    expect(container.firstChild).toHaveClass('container')
  })

  it('applies size variant classes', () => {
    const { rerender, container } = render(<Container size="sm">Content</Container>)
    expect(container.firstChild).toHaveClass('container-sm')

    rerender(<Container size="lg">Content</Container>)
    expect(container.firstChild).toHaveClass('container-lg')

    rerender(<Container size="fluid">Content</Container>)
    expect(container.firstChild).toHaveClass('container-fluid')
  })

  it('merges custom className', () => {
    const { container } = render(<Container className="custom-class">Content</Container>)
    expect(container.firstChild).toHaveClass('container', 'custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Container ref={ref}>Content</Container>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
