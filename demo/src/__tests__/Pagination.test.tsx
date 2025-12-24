import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@lukeashford/aurelius'

describe('Pagination', () => {
  const defaultProps = {
    page: 1,
    totalPages: 10,
    onPageChange: jest.fn(),
  }

  beforeEach(() => {
    defaultProps.onPageChange.mockClear()
  })

  it('renders pagination controls', () => {
    render(<Pagination {...defaultProps} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders page buttons', () => {
    render(<Pagination {...defaultProps} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls onPageChange when page is clicked', () => {
    render(<Pagination {...defaultProps} />)
    fireEvent.click(screen.getByText('2'))
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2)
  })

  it('disables previous button on first page', () => {
    render(<Pagination {...defaultProps} page={1} />)
    const buttons = screen.getAllByRole('button')
    // First button should be the "previous" button
    expect(buttons[0]).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination {...defaultProps} page={10} />)
    const buttons = screen.getAllByRole('button')
    // Last button should be the "next" button
    expect(buttons[buttons.length - 1]).toBeDisabled()
  })

  it('navigates to previous page', () => {
    render(<Pagination {...defaultProps} page={5} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0]) // Previous button
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(4)
  })

  it('navigates to next page', () => {
    render(<Pagination {...defaultProps} page={5} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1]) // Next button
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(6)
  })

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} page={3} />)
    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })

  it('renders with single page', () => {
    render(<Pagination {...defaultProps} totalPages={1} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    // Both prev and next should be disabled
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
    expect(buttons[buttons.length - 1]).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Pagination {...defaultProps} className="custom-pagination" />
    )
    expect(container.querySelector('.custom-pagination')).toBeInTheDocument()
  })
})
