import React from 'react'
import { render, screen } from '@testing-library/react'
import { Container, Row, Col } from '@lukeashford/aurelius'

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
    const { container } = render(<Row gutter="6">Content</Row>)
    expect(container.firstChild).toHaveClass('gap-6')
  })

  it('applies directional gutters', () => {
    const { container } = render(<Row gutterX="4" gutterY="2">Content</Row>)
    expect(container.firstChild).toHaveClass('gap-x-4', 'gap-y-2')
    expect(container.firstChild).not.toHaveClass('gap-4')
  })

  it('applies justify alignment', () => {
    const { container } = render(<Row justify="center">Content</Row>)
    expect(container.firstChild).toHaveClass('justify-center')
  })

  it('applies align alignment', () => {
    const { container } = render(<Row align="center">Content</Row>)
    expect(container.firstChild).toHaveClass('items-center')
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

describe('Col', () => {
  it('renders children', () => {
    render(<Col>Test content</Col>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies col-span-12 by default when no span specified', () => {
    const { container } = render(<Col>Content</Col>)
    expect(container.firstChild).toHaveClass('col-span-12')
  })

  it('applies span class', () => {
    const { container } = render(<Col span={6}>Content</Col>)
    expect(container.firstChild).toHaveClass('col-span-6')
  })

  it('applies responsive span classes', () => {
    const { container } = render(<Col span={12} sm={6} md={4} lg={3}>Content</Col>)
    expect(container.firstChild).toHaveClass(
      'col-span-12',
      'sm:col-span-6',
      'md:col-span-4',
      'lg:col-span-3'
    )
  })

  it('applies xs as base span', () => {
    const { container } = render(<Col xs={6} md={4}>Content</Col>)
    expect(container.firstChild).toHaveClass('col-span-6', 'md:col-span-4')
  })

  it('applies xxl breakpoint', () => {
    const { container } = render(<Col xxl={3}>Content</Col>)
    expect(container.firstChild).toHaveClass('2xl:col-span-3')
  })

  it('applies auto span', () => {
    const { container } = render(<Col span="auto">Content</Col>)
    expect(container.firstChild).toHaveClass('col-auto')
  })

  it('applies full span', () => {
    const { container } = render(<Col span="full">Content</Col>)
    expect(container.firstChild).toHaveClass('col-span-full')
  })

  it('applies offset class', () => {
    const { container } = render(<Col span={6} offset={3}>Content</Col>)
    expect(container.firstChild).toHaveClass('col-span-6', 'col-start-4')
  })

  it('applies responsive offset classes', () => {
    const { container } = render(<Col span={6} mdOffset={3}>Content</Col>)
    expect(container.firstChild).toHaveClass('md:col-start-4')
  })

  it('applies order class', () => {
    const { container } = render(<Col order={2}>Content</Col>)
    expect(container.firstChild).toHaveClass('order-2')
  })

  it('applies order-first and order-last', () => {
    const { rerender, container } = render(<Col order="first">Content</Col>)
    expect(container.firstChild).toHaveClass('order-first')

    rerender(<Col order="last">Content</Col>)
    expect(container.firstChild).toHaveClass('order-last')
  })

  it('applies responsive order classes', () => {
    const { container } = render(<Col mdOrder={2} lgOrder="first">Content</Col>)
    expect(container.firstChild).toHaveClass('md:order-2', 'lg:order-first')
  })

  it('merges custom className', () => {
    const { container } = render(<Col span={6} className="custom-class">Content</Col>)
    expect(container.firstChild).toHaveClass('col-span-6', 'custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Col ref={ref}>Content</Col>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
