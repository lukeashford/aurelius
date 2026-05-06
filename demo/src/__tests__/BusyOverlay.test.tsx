import React from 'react'
import {render, screen} from '@testing-library/react'
import {BusyOverlay} from '@lukeashford/aurelius'

describe('BusyOverlay', () => {
  it('renders a status region with aria-busy', () => {
    render(<BusyOverlay/>)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })

  it('mounts absolute over its positioned parent', () => {
    render(<BusyOverlay/>)
    expect(screen.getByRole('status')).toHaveClass('absolute', 'inset-0')
  })

  it('defaults to dim tone and sm blur', () => {
    render(<BusyOverlay/>)
    const status = screen.getByRole('status')
    expect(status).toHaveClass('bg-obsidian/40')
    expect(status).toHaveClass('backdrop-blur-sm')
  })

  it('switches to frost tone and explicit blur strength', () => {
    render(<BusyOverlay tone="frost" blurStrength="lg"/>)
    const status = screen.getByRole('status')
    expect(status).toHaveClass('bg-obsidian/80')
    expect(status).toHaveClass('backdrop-blur-lg')
  })

  it('renders an optional label', () => {
    render(<BusyOverlay label="Loading session…"/>)
    expect(screen.getByText('Loading session…')).toBeInTheDocument()
  })

  it('omits the label slot when no label is given', () => {
    const {container} = render(<BusyOverlay/>)
    expect(container.querySelector('span')).toBeNull()
  })
})
