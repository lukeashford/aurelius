import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@lukeashford/aurelius'

describe('Accordion', () => {
  const renderAccordion = (props = {}) => {
    return render(
      <Accordion type="single" {...props}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  it('renders accordion items', () => {
    renderAccordion()
    expect(screen.getByText('Trigger 1')).toBeInTheDocument()
    expect(screen.getByText('Trigger 2')).toBeInTheDocument()
  })

  it('hides content by default', () => {
    renderAccordion()
    // Content is in DOM with hidden attribute when collapsed
    const content1 = screen.getByText('Content 1')
    const content2 = screen.getByText('Content 2')
    expect(content1.closest('[hidden]')).toBeTruthy()
    expect(content2.closest('[hidden]')).toBeTruthy()
  })

  it('shows content when defaultValue is set', () => {
    renderAccordion({ defaultValue: 'item-1' })
    const content1 = screen.getByText('Content 1')
    const content2 = screen.getByText('Content 2')
    expect(content1.closest('[hidden]')).toBeFalsy()
    expect(content2.closest('[hidden]')).toBeTruthy()
  })

  it('toggles content on click (single mode)', () => {
    renderAccordion()

    // Open first item
    fireEvent.click(screen.getByText('Trigger 1'))
    const content1 = screen.getByText('Content 1')
    expect(content1.closest('[hidden]')).toBeFalsy()

    // Open second item (should close first)
    fireEvent.click(screen.getByText('Trigger 2'))
    expect(screen.getByText('Content 1').closest('[hidden]')).toBeTruthy()
    expect(screen.getByText('Content 2').closest('[hidden]')).toBeFalsy()
  })

  it('allows multiple items open in multiple mode', () => {
    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Trigger 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    fireEvent.click(screen.getByText('Trigger 1'))
    fireEvent.click(screen.getByText('Trigger 2'))

    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('applies button role to triggers', () => {
    renderAccordion()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('sets aria-expanded correctly', () => {
    renderAccordion({ defaultValue: 'item-1' })
    expect(screen.getByText('Trigger 1').closest('button')?.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('Trigger 2').closest('button')?.getAttribute('aria-expanded')).toBe('false')
  })

  it('calls onValueChange when item is toggled', () => {
    const onValueChange = jest.fn()
    render(
      <Accordion type="single" onValueChange={onValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    fireEvent.click(screen.getByText('Trigger 1'))
    expect(onValueChange).toHaveBeenCalledWith('item-1')
  })
})
