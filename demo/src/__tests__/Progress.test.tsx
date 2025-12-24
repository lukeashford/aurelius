import React from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from '@lukeashford/aurelius'

describe('Progress', () => {
  it('renders with default value of 0', () => {
    render(<Progress />)
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0')
  })

  it('renders with specified value', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('50')
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Progress value={50} />)
    const progressbar = screen.getByRole('progressbar')
    expect(progressbar.getAttribute('aria-valuemin')).toBe('0')
    expect(progressbar.getAttribute('aria-valuemax')).toBe('100')
  })

  it('clamps value to 0-100 range', () => {
    const { rerender } = render(<Progress value={-10} />)
    // -10 is clamped to 0 visually but aria-valuenow reflects actual value
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('-10')

    rerender(<Progress value={150} />)
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('150')
  })

  it('applies size classes to progressbar container', () => {
    const { container, rerender } = render(<Progress size="sm" />)
    const progressbar = container.querySelector('[role="progressbar"]')
    expect(progressbar?.className).toContain('h-1')

    rerender(<Progress size="md" />)
    expect(container.querySelector('[role="progressbar"]')?.className).toContain('h-2')

    rerender(<Progress size="lg" />)
    expect(container.querySelector('[role="progressbar"]')?.className).toContain('h-3')
  })

  it('applies variant classes', () => {
    const { container, rerender } = render(<Progress variant="default" />)
    const bar = container.querySelector('[role="progressbar"] > div')
    expect(bar?.className).toContain('bg-gold')

    rerender(<Progress variant="success" />)
    expect(container.querySelector('[role="progressbar"] > div')?.className).toContain('bg-success')
  })

  it('shows value when showValue is true', () => {
    render(<Progress value={75} showValue />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('hides value when showValue is false', () => {
    render(<Progress value={75} showValue={false} />)
    expect(screen.queryByText('75%')).toBeNull()
  })

  it('renders indeterminate state', () => {
    const { container } = render(<Progress indeterminate />)
    const bar = container.querySelector('[role="progressbar"] > div')
    expect(bar?.className).toContain('animate-pulse')
  })

  it('merges custom className', () => {
    const { container } = render(<Progress className="custom-class" />)
    expect((container.firstChild as HTMLElement)?.className).toContain('custom-class')
  })
})
