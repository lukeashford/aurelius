import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {ArtifactGroup, type ArtifactNode} from '@lukeashford/aurelius'

const makeArtifactNode = (overrides: Partial<ArtifactNode> = {}): ArtifactNode => ({
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
  it('renders the label and item count', () => {
    render(<ArtifactGroup node={makeArtifactNode()}/>)
    expect(screen.getByText('Storyboard')).toBeInTheDocument()
    expect(screen.getByText('3 items')).toBeInTheDocument()
  })

  it('renders the count badge when there are multiple children', () => {
    const {container} = render(<ArtifactGroup node={makeArtifactNode()}/>)
    const badge = container.querySelector('.bg-gold')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('3')
  })

  it('does not render the count badge for a single child', () => {
    const node = makeArtifactNode({
      children: [makeArtifactNode().children[0]],
    })
    const {container} = render(<ArtifactGroup node={node}/>)
    // The badge with bg-gold in the rounded-full position should not exist
    const badges = container.querySelectorAll('.rounded-full.bg-gold')
    expect(badges.length).toBe(0)
  })

  it('renders back layers for 3+ children', () => {
    const {container} = render(<ArtifactGroup node={makeArtifactNode()}/>)
    const layers = container.querySelectorAll('[aria-hidden="true"]')
    expect(layers.length).toBe(2) // middle + back layer
  })

  it('renders only middle layer for 2 children', () => {
    const node = makeArtifactNode({
      children: makeArtifactNode().children.slice(0, 2),
    })
    const {container} = render(<ArtifactGroup node={node}/>)
    const layers = container.querySelectorAll('[aria-hidden="true"]')
    expect(layers.length).toBe(1) // middle layer only
  })

  it('renders no layers for 1 child', () => {
    const node = makeArtifactNode({
      children: [makeArtifactNode().children[0]],
    })
    const {container} = render(<ArtifactGroup node={node}/>)
    const layers = container.querySelectorAll('[aria-hidden="true"]')
    expect(layers.length).toBe(0)
  })

  it('calls onClick with the node when clicked', () => {
    const onClick = jest.fn()
    render(<ArtifactGroup node={makeArtifactNode()} onClick={onClick}/>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({id: 'group-1'}))
  })

  it('calls onClick on Enter key', () => {
    const onClick = jest.fn()
    render(<ArtifactGroup node={makeArtifactNode()} onClick={onClick}/>)
    fireEvent.keyDown(screen.getByRole('button'), {key: 'Enter'})
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick on Space key', () => {
    const onClick = jest.fn()
    render(<ArtifactGroup node={makeArtifactNode()} onClick={onClick}/>)
    fireEvent.keyDown(screen.getByRole('button'), {key: ' '})
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders an empty state when there are no children', () => {
    const node = makeArtifactNode({children: []})
    render(<ArtifactGroup node={node}/>)
    expect(screen.getByText('Empty group')).toBeInTheDocument()
    expect(screen.getByText('0 items')).toBeInTheDocument()
  })

  it('has an accessible label with the group name and count', () => {
    render(<ArtifactGroup node={makeArtifactNode()}/>)
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
