import React from 'react'
import { render, screen } from '@testing-library/react'
import { Divider } from '@lukeashford/aurelius'

describe('Divider', () => {
  it('renders horizontal divider by default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('renders vertical divider', () => {
    render(<Divider orientation="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('applies separator role', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Divider label="OR" />)
    expect(screen.getByText('OR')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    const { container, rerender } = render(<Divider variant="solid" />)
    expect(screen.getByRole('separator')).toBeInTheDocument()

    rerender(<Divider variant="dashed" />)
    expect(screen.getByRole('separator')).toBeInTheDocument()

    rerender(<Divider variant="dotted" />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('applies color classes', () => {
    const { rerender } = render(<Divider color="default" />)
    expect(screen.getByRole('separator')).toBeInTheDocument()

    rerender(<Divider color="gold" />)
    expect(screen.getByRole('separator')).toBeInTheDocument()

    rerender(<Divider color="muted" />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<Divider className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLHRElement>()
    render(<Divider ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLHRElement)
  })
})
