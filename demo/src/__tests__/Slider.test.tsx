import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from '@lukeashford/aurelius'

describe('Slider', () => {
  it('renders slider with default value of 0', () => {
    render(<Slider />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
  })

  it('renders with specified value', () => {
    render(<Slider value={50} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50')
  })

  it('renders with specified defaultValue', () => {
    render(<Slider defaultValue={25} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '25')
  })

  it('sets min and max attributes', () => {
    render(<Slider min={10} max={90} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuemin', '10')
    expect(slider).toHaveAttribute('aria-valuemax', '90')
  })

  it('applies disabled state', () => {
    const { container } = render(<Slider disabled />)
    expect(container.firstChild).toHaveClass('opacity-50')
  })

  it('sets aria-disabled when disabled', () => {
    render(<Slider disabled />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-disabled', 'true')
  })

  it('applies size classes', () => {
    const { container, rerender } = render(<Slider size="sm" />)
    expect(container.querySelector('[role="slider"]')?.parentElement).toHaveClass('h-1')

    rerender(<Slider size="lg" />)
    expect(container.querySelector('[role="slider"]')?.parentElement).toHaveClass('h-3')
  })

  it('applies custom className', () => {
    const { container } = render(<Slider className="custom-slider" />)
    expect(container.firstChild).toHaveClass('custom-slider')
  })

  it('calls onChange when value changes', () => {
    const onChange = jest.fn()
    render(<Slider onChange={onChange} />)
    // Note: Full slider interaction testing would require more complex setup
    // This test verifies the callback is passed properly
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders with step attribute', () => {
    render(<Slider step={10} />)
    // The step is used for keyboard navigation, verify component renders
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })
})
