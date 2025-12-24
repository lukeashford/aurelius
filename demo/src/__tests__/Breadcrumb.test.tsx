import React from 'react'
import { render, screen } from '@testing-library/react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@lukeashford/aurelius'

describe('Breadcrumb', () => {
  it('renders navigation element', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('sets aria-label', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb')
  })

  it('renders breadcrumb items', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Products</BreadcrumbItem>
        <BreadcrumbItem>Category</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
  })

  it('renders separators between items', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Products</BreadcrumbItem>
      </Breadcrumb>
    )
    // Should have at least one separator
    expect(container.querySelectorAll('li').length).toBe(2)
  })

  it('applies custom separator', () => {
    render(
      <Breadcrumb separator=">">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Products</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByText('>')).toBeInTheDocument()
  })

  it('renders BreadcrumbLink as links', () => {
    render(
      <Breadcrumb>
        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        <BreadcrumbLink href="/products">Products</BreadcrumbLink>
      </Breadcrumb>
    )
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home')
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products')
  })

  it('marks current item with aria-current', () => {
    render(
      <Breadcrumb>
        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        <BreadcrumbItem current>Current Page</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(screen.getByText('Current Page')).toHaveAttribute('aria-current', 'page')
  })

  it('applies custom className', () => {
    const { container } = render(
      <Breadcrumb className="custom-breadcrumb">
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>
    )
    expect(container.querySelector('.custom-breadcrumb')).toBeInTheDocument()
  })
})
