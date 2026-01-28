import React from 'react'
import {render, screen} from '@testing-library/react'
import {ScriptCard, ScriptElement} from '@lukeashford/aurelius'

describe('ScriptCard', () => {
  const mockElements: ScriptElement[] = [
    {type: 'scene-heading', content: 'INT. COFFEE SHOP - DAY'},
    {type: 'action', content: 'The shop is empty. A single barista cleans the counter.'},
    {type: 'character', content: 'BARISTA'},
    {type: 'dialogue', content: 'Another day, another dollar.'},
    {type: 'parenthetical', content: 'sighing'},
    {type: 'transition', content: 'FADE OUT.'},
  ]

  it('renders elements correctly', () => {
    render(<ScriptCard elements={mockElements}/>)

    expect(screen.getByText('INT. COFFEE SHOP - DAY')).toBeInTheDocument()
    expect(screen.getByText('The shop is empty. A single barista cleans the counter.'))
    .toBeInTheDocument()
    expect(screen.getByText('BARISTA')).toBeInTheDocument()
    expect(screen.getByText('Another day, another dollar.')).toBeInTheDocument()
    expect(screen.getByText('(sighing)')).toBeInTheDocument()
    expect(screen.getByText('FADE OUT.')).toBeInTheDocument()
  })

  it('renders title and subtitle when provided', () => {
    render(
        <ScriptCard
            elements={mockElements}
            title="Morning Routine"
            subtitle="A short film"
        />
    )

    expect(screen.getByText('Morning Routine')).toBeInTheDocument()
    expect(screen.getByText('A short film')).toBeInTheDocument()
  })

  it('does not render header when title and subtitle are missing', () => {
    const {container} = render(<ScriptCard elements={mockElements}/>)
    // The header div is only rendered if title or subtitle exists
    expect(container.querySelector('.border-b')).toBeNull()
  })

  it('applies correct formatting classes to elements', () => {
    render(<ScriptCard elements={mockElements}/>)

    expect(screen.getByText('INT. COFFEE SHOP - DAY')).toHaveClass('uppercase', 'text-gold')
    expect(screen.getByText('BARISTA')).toHaveClass('uppercase', 'text-white')
    expect(screen.getByText('(sighing)')).toHaveClass('italic')
    expect(screen.getByText('FADE OUT.')).toHaveClass('text-right')
  })

  it('renders title and subtitle elements', () => {
    const titleElements: ScriptElement[] = [
      {type: 'title', content: 'THE GREAT ESCAPE'},
      {type: 'subtitle', content: 'Based on a true story'},
    ]
    render(<ScriptCard elements={titleElements}/>)

    expect(screen.getByText('THE GREAT ESCAPE')).toHaveClass('text-center', 'text-gold')
    expect(screen.getByText('Based on a true story')).toHaveClass('text-center', 'italic')
  })

  it('respects maxHeight prop', () => {
    render(<ScriptCard elements={mockElements} maxHeight="500px"/>)
    const contentDiv = screen.getByText('INT. COFFEE SHOP - DAY').parentElement
    expect(contentDiv).toHaveStyle({maxHeight: '500px'})
  })
})
