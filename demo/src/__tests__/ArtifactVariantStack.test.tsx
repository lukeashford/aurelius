import React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import {ArtifactVariantStack, type ArtifactNode} from '@lukeashford/aurelius'

const makeVariantSet = (overrides: Partial<ArtifactNode> = {}): ArtifactNode => ({
  id: 'vs-1',
  type: 'VARIANT_SET',
  name: 'color_options',
  label: 'Color Options',
  children: [
    {
      id: 'var-a',
      type: 'ARTIFACT',
      name: 'neon',
      label: 'Neon Noir',
      artifact: {
        id: 'a-neon',
        type: 'IMAGE',
        url: 'https://example.com/neon.jpg',
        alt: 'Neon noir',
        title: 'Neon Noir',
      },
      children: [],
    },
    {
      id: 'var-b',
      type: 'ARTIFACT',
      name: 'warm',
      label: 'Warm Analog',
      artifact: {
        id: 'a-warm',
        type: 'IMAGE',
        url: 'https://example.com/warm.jpg',
        alt: 'Warm analog',
        title: 'Warm Analog',
      },
      children: [],
    },
  ],
  ...overrides,
})

describe('ArtifactVariantStack', () => {
  it('renders the label', () => {
    render(<ArtifactVariantStack node={makeVariantSet()}/>)
    expect(screen.getByText('Color Options')).toBeInTheDocument()
  })

  it('does not render a variant count', () => {
    const {container} = render(<ArtifactVariantStack node={makeVariantSet()}/>)
    expect(container.textContent).not.toContain('2 variants')
  })

  it('renders all children', () => {
    render(<ArtifactVariantStack node={makeVariantSet()}/>)
    // Children render via ArtifactCard which shows the title
    expect(screen.getAllByText('Neon Noir').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Warm Analog').length).toBeGreaterThanOrEqual(1)
  })

  it('does not render duplicate child labels below cards', () => {
    const {container} = render(<ArtifactVariantStack node={makeVariantSet()}/>)
    // There should be no .truncate label divs below the cards
    const labelDivs = container.querySelectorAll('.mt-1.text-xs.text-silver.truncate')
    expect(labelDivs.length).toBe(0)
  })

  it('shows all children equally (no dimming)', () => {
    const {container} = render(<ArtifactVariantStack node={makeVariantSet()}/>)
    const children = container.querySelectorAll('.flex-1')
    children.forEach(child => {
      expect(child).not.toHaveClass('opacity-50')
      expect(child).not.toHaveClass('ring-1')
    })
  })

  it('does not render choose buttons', () => {
    render(<ArtifactVariantStack node={makeVariantSet()}/>)
    const buttons = screen.queryAllByRole('button', {name: /Choose/i})
    expect(buttons.length).toBe(0)
  })

  it('passes onExpandArtifact through to ArtifactCard children', () => {
    const onExpand = jest.fn()
    const {container} = render(
        <ArtifactVariantStack node={makeVariantSet()} onExpandArtifact={onExpand}/>
    )
    // ArtifactCard renders an expand button when onExpand is provided
    const expandButtons = container.querySelectorAll('[aria-label="Expand artifact"]')
    expect(expandButtons.length).toBe(2)
  })

  it('passes onGroupClick through to ArtifactGroup children', () => {
    const onGroupClick = jest.fn()
    const node: ArtifactNode = {
      id: 'vs-groups',
      type: 'VARIANT_SET',
      name: 'approaches',
      label: 'Approaches',
      children: [
        {
          id: 'g-1',
          type: 'GROUP',
          name: 'approach_a',
          label: 'Approach A',
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
    render(<ArtifactVariantStack node={node} onGroupClick={onGroupClick}/>)

    // The ArtifactGroup renders a button with the group's aria-label
    const groupButton = screen.getByRole('button', {name: /Approach A/})
    fireEvent.click(groupButton)
    expect(onGroupClick).toHaveBeenCalledTimes(1)
    expect(onGroupClick).toHaveBeenCalledWith(expect.objectContaining({id: 'g-1'}))
  })

  it('renders nested variant set placeholder', () => {
    const node: ArtifactNode = {
      id: 'vs-nested',
      type: 'VARIANT_SET',
      name: 'nested',
      label: 'Nested Set',
      children: [
        {
          id: 'inner-vs',
          type: 'VARIANT_SET',
          name: 'inner',
          label: 'Inner Variants',
          children: [],
        },
      ],
    }
    render(<ArtifactVariantStack node={node}/>)
    expect(screen.getAllByText('Inner Variants').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Variants')).toBeInTheDocument()
  })
})
