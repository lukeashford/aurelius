import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from '@lukeashford/aurelius'

describe('Menu', () => {
  const renderMenu = () => {
    return render(
      <Menu>
        <MenuTrigger>Open Menu</MenuTrigger>
        <MenuContent>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuSeparator />
          <MenuItem destructive>Delete</MenuItem>
        </MenuContent>
      </Menu>
    )
  }

  it('renders trigger button', () => {
    renderMenu()
    expect(screen.getByText('Open Menu')).toBeInTheDocument()
  })

  it('hides menu content by default', () => {
    renderMenu()
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
  })

  it('shows menu content on trigger click', () => {
    renderMenu()
    fireEvent.click(screen.getByText('Open Menu'))
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('hides menu when clicking an item', () => {
    renderMenu()
    fireEvent.click(screen.getByText('Open Menu'))
    fireEvent.click(screen.getByText('Item 1'))
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
  })

  it('sets aria-haspopup on trigger', () => {
    renderMenu()
    expect(screen.getByText('Open Menu')).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('sets aria-expanded when menu is open', () => {
    renderMenu()
    const trigger = screen.getByText('Open Menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('applies menu role to content', () => {
    renderMenu()
    fireEvent.click(screen.getByText('Open Menu'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('applies menuitem role to items', () => {
    renderMenu()
    fireEvent.click(screen.getByText('Open Menu'))
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
  })

  it('applies separator role', () => {
    renderMenu()
    fireEvent.click(screen.getByText('Open Menu'))
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('renders destructive item with error styling', () => {
    renderMenu()
    fireEvent.click(screen.getByText('Open Menu'))
    expect(screen.getByText('Delete')).toHaveClass('text-error')
  })

  it('toggles menu on repeated clicks', () => {
    renderMenu()
    const trigger = screen.getByText('Open Menu')

    fireEvent.click(trigger)
    expect(screen.getByText('Item 1')).toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
  })
})
