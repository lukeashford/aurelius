import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {BranchNavigator} from '@lukeashford/aurelius'

describe('BranchNavigator', () => {
  it('renders without crashing', () => {
    render(<BranchNavigator current={1} total={3}/>)
    expect(document.body).toBeInTheDocument()
  })

  it('does not render when total is 1', () => {
    const {container} = render(<BranchNavigator current={1} total={1}/>)
    expect(container.firstChild).toBeNull()
  })

  it('renders when total is greater than 1', () => {
    render(<BranchNavigator current={1} total={2}/>)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('displays current and total branch count', () => {
    render(<BranchNavigator current={2} total={5}/>)
    expect(screen.getByText('2/5')).toBeInTheDocument()
  })

  it('renders previous button', () => {
    render(<BranchNavigator current={2} total={3}/>)
    expect(screen.getByRole('button', {name: /previous branch/i})).toBeInTheDocument()
  })

  it('renders next button', () => {
    render(<BranchNavigator current={2} total={3}/>)
    expect(screen.getByRole('button', {name: /next branch/i})).toBeInTheDocument()
  })

  it('disables previous button on first branch', () => {
    render(<BranchNavigator current={1} total={3}/>)
    expect(screen.getByRole('button', {name: /previous branch/i})).toBeDisabled()
  })

  it('enables previous button when not on first branch', () => {
    render(<BranchNavigator current={2} total={3}/>)
    expect(screen.getByRole('button', {name: /previous branch/i})).not.toBeDisabled()
  })

  it('disables next button on last branch', () => {
    render(<BranchNavigator current={3} total={3}/>)
    expect(screen.getByRole('button', {name: /next branch/i})).toBeDisabled()
  })

  it('enables next button when not on last branch', () => {
    render(<BranchNavigator current={2} total={3}/>)
    expect(screen.getByRole('button', {name: /next branch/i})).not.toBeDisabled()
  })

  it('calls onPrevious when previous button is clicked', () => {
    const onPrevious = jest.fn()
    render(<BranchNavigator current={2} total={3} onPrevious={onPrevious}/>)

    fireEvent.click(screen.getByRole('button', {name: /previous branch/i}))
    expect(onPrevious).toHaveBeenCalled()
  })

  it('calls onNext when next button is clicked', () => {
    const onNext = jest.fn()
    render(<BranchNavigator current={2} total={3} onNext={onNext}/>)

    fireEvent.click(screen.getByRole('button', {name: /next branch/i}))
    expect(onNext).toHaveBeenCalled()
  })

  it('shows branch icon by default', () => {
    const {container} = render(<BranchNavigator current={1} total={2} showIcon={true}/>)
    // GitBranch icon is rendered with aria-hidden before the buttons
    const nav = container.querySelector('[role="navigation"]')
    // First child should be the GitBranch icon
    const firstChild = nav?.firstElementChild
    expect(firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('hides branch icon when showIcon is false', () => {
    const {container} = render(<BranchNavigator current={1} total={2} showIcon={false}/>)
    // First child of navigation should be a button (previous), not the branch icon
    const nav = container.querySelector('[role="navigation"]')
    const firstChild = nav?.firstElementChild
    expect(firstChild?.tagName).toBe('BUTTON')
  })

  it('has accessible navigation role', () => {
    render(<BranchNavigator current={1} total={2}/>)
    expect(screen.getByRole('navigation', {name: /branch navigation/i})).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<BranchNavigator current={1} total={2} className="custom-nav"/>)
    expect(screen.getByRole('navigation')).toHaveClass('custom-nav')
  })

  it('renders in small size by default', () => {
    const {container} = render(<BranchNavigator current={1} total={2}/>)
    expect(container.querySelector('.text-xs')).toBeInTheDocument()
  })

  it('renders in medium size when specified', () => {
    const {container} = render(<BranchNavigator current={1} total={2} size="md"/>)
    expect(container.querySelector('.text-sm')).toBeInTheDocument()
  })

  it('matches snapshot', () => {
    const {container} = render(
        <BranchNavigator
            current={2}
            total={4}
            onPrevious={() => {
            }}
            onNext={() => {
            }}
        />
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot when on first branch', () => {
    const {container} = render(
        <BranchNavigator current={1} total={3} onPrevious={() => {
        }} onNext={() => {
        }}/>
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot when on last branch', () => {
    const {container} = render(
        <BranchNavigator current={3} total={3} onPrevious={() => {
        }} onNext={() => {
        }}/>
    )
    expect(container).toMatchSnapshot()
  })
})
