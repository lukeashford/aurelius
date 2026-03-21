import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {ArtifactGroup, type ArtifactNode} from '@lukeashford/aurelius'

const makeGroupNode = (overrides: Partial<ArtifactNode> = {}): ArtifactNode => ({
  id: 'group-1',
  type: 'GROUP',
  name: 'storyboard',
  label: 'Storyboard',
  children: [
    {
      id: 'child-1',
      type: 'ARTIFACT',
      name: 'panel_1',
      label: 'Panel 1',
      artifact: {
        id: 'a-1',
        type: 'IMAGE',
        url: 'https://example.com/img.jpg',
        alt: 'Panel 1',
        title: 'Panel 1',
      },
      children: [],
    },
    {
      id: 'child-2',
      type: 'ARTIFACT',
      name: 'panel_2',
      label: 'Panel 2',
      artifact: {
        id: 'a-2',
        type: 'IMAGE',
        url: 'https://example.com/img2.jpg',
        alt: 'Panel 2',
        title: 'Panel 2',
      },
      children: [],
    },
    {
      id: 'child-3',
      type: 'ARTIFACT',
      name: 'panel_3',
      label: 'Panel 3',
      artifact: {
        id: 'a-3',
        type: 'IMAGE',
        url: 'https://example.com/img3.jpg',
        alt: 'Panel 3',
        title: 'Panel 3',
      },
      children: [],
    },
  ],
  ...overrides,
})

describe('ArtifactGroup', () => {
  it('renders the label above the stack', () => {
    render(<ArtifactGroup node={makeGroupNode()}/>)
    expect(screen.getByText('Storyboard')).toBeInTheDocument()
  })

  it('renders the count badge as a square', () => {
    const {container} = render(<ArtifactGroup node={makeGroupNode()}/>)
    const badge = container.querySelector('.bg-gold')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('3')
    // Should NOT have rounded-full (it's a square)
    expect(badge).not.toHaveClass('rounded-full')
  })

  it('always renders two back layers regardless of child count', () => {
    // Even with 1 child, the group symbol always shows 3 stacked cards
    const node = makeGroupNode({
      children: [makeGroupNode().children[0]],
    })
    const {container} = render(<ArtifactGroup node={node}/>)
    const layers = container.querySelectorAll('[aria-hidden="true"]')
    expect(layers.length).toBe(2)
  })

  it('renders two back layers for many children', () => {
    const {container} = render(<ArtifactGroup node={makeGroupNode()}/>)
    const layers = container.querySelectorAll('[aria-hidden="true"]')
    expect(layers.length).toBe(2)
  })

  it('calls onClick with the node when clicked', () => {
    const onClick = jest.fn()
    render(<ArtifactGroup node={makeGroupNode()} onClick={onClick}/>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({id: 'group-1'}))
  })

  it('calls onClick on Enter key', () => {
    const onClick = jest.fn()
    render(<ArtifactGroup node={makeGroupNode()} onClick={onClick}/>)
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'})
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick on Space key', () => {
    const onClick = jest.fn()
    render(<ArtifactGroup node={makeGroupNode()} onClick={onClick}/>)
    fireEvent.keyDown(screen.getByRole('button'), {key: ' '})
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders an empty state when there are no children', () => {
    const node = makeGroupNode({children: []})
    render(<ArtifactGroup node={node}/>)
    expect(screen.getByText('Empty group')).toBeInTheDocument()
  })

  it('has an accessible label with the group name and count', () => {
    render(<ArtifactGroup node={makeGroupNode()}/>)
    expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Storyboard — 3 items'
    )
  })

  it('renders a nested group placeholder for GROUP children', () => {
    const node: ArtifactNode = {
      id: 'outer',
      type: 'GROUP',
      name: 'outer',
      label: 'Outer Group',
      children: [
        {
          id: 'inner',
          type: 'GROUP',
          name: 'inner',
          label: 'Inner Group',
          children: [
            {
              id: 'leaf',
              type: 'ARTIFACT',
              name: 'leaf',
              label: 'Leaf',
              artifact: {id: 'a-leaf', type: 'TEXT', inlineContent: 'hi', title: 'Leaf'},
              children: [],
            },
          ],
        },
      ],
    }
    render(<ArtifactGroup node={node}/>)
    expect(screen.getByText('Inner Group')).toBeInTheDocument()
    expect(screen.getByText('Group')).toBeInTheDocument()
  })
})
