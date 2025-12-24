import React from 'react'
import { render, screen } from '@testing-library/react'
import { Col } from '@lukeashford/aurelius'

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

  it('applies responsive span classes using responsive object', () => {
    const { container } = render(
      <Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>Content</Col>
    )
    expect(container.firstChild).toHaveClass(
      'col-span-12',
      'sm:col-span-6',
      'md:col-span-4',
      'lg:col-span-3'
    )
  })

  it('applies xl and 2xl breakpoints', () => {
    const { container } = render(
      <Col span={{ base: 12, xl: 4, '2xl': 3 }}>Content</Col>
    )
    expect(container.firstChild).toHaveClass('col-span-12', 'xl:col-span-4', '2xl:col-span-3')
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
    const { container } = render(<Col span={6} offset={{ md: 3 }}>Content</Col>)
    expect(container.firstChild).toHaveClass('md:col-start-4')
  })

  it('does not apply class for offset 0', () => {
    const { container } = render(<Col span={6} offset={0}>Content</Col>)
    expect(container.firstChild).not.toHaveClass('col-start-1')
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

  it('applies order-none', () => {
    const { container } = render(<Col order="none">Content</Col>)
    expect(container.firstChild).toHaveClass('order-none')
  })

  it('applies responsive order classes', () => {
    const { container } = render(<Col order={{ md: 2, lg: 'first' }}>Content</Col>)
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

  it('combines all props correctly', () => {
    const { container } = render(
      <Col
        span={{ base: 12, md: 6 }}
        offset={{ md: 3 }}
        order={{ base: 2, lg: 'first' }}
        className="my-col"
      >
        Content
      </Col>
    )
    expect(container.firstChild).toHaveClass(
      'col-span-12',
      'md:col-span-6',
      'md:col-start-4',
      'order-2',
      'lg:order-first',
      'my-col'
    )
  })
})
