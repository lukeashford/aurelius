import React from 'react'
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react'
import {ArtifactVariantStack, type ArtifactNode} from '@lukeashford/aurelius'

const makeVariantSet = (overrides: Partial<ArtifactNode> = {}): ArtifactNode => ({
  id: 'vs-1',
  type: 'VARIANT_SET',
  name: 'color_options',
  label: 'Color Options',
  chosenVariantId: null,
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
  it('renders the label and variant count', () => {
    render(<ArtifactVariantStack node={makeVariantSet()}/>)
    expect(screen.getByText('Color Options')).toBeInTheDocument()
    expect(screen.getByText('2 variants')).toBeInTheDocument()
  })

  it('renders all children labels', () => {
    render(<ArtifactVariantStack node={makeVariantSet()}/>)
    // Labels appear both in ArtifactCard title and the label div below
    expect(screen.getAllByText('Neon Noir').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Warm Analog').length).toBeGreaterThanOrEqual(1)
  })

  it('shows all children equally when no variant is chosen', () => {
    const {container} = render(<ArtifactVariantStack node={makeVariantSet()}/>)
    const children = container.querySelectorAll('.flex-1')
    children.forEach(child => {
      expect(child).not.toHaveClass('opacity-50')
      expect(child).not.toHaveClass('ring-1')
    })
  })

  it('highlights chosen variant and dims others', () => {
    const node = makeVariantSet({chosenVariantId: 'var-a'})
    const {container} = render(<ArtifactVariantStack node={node}/>)
    // Direct children of the flex row container
    const flexRow = container.querySelector('.flex.gap-3')!
    const children = flexRow.children
    // First child (var-a) should have ring
    expect(children[0]).toHaveClass('ring-1', 'ring-gold')
    expect(children[0]).not.toHaveClass('opacity-50')
    // Second child (var-b) should be dimmed
    expect(children[1]).toHaveClass('opacity-50')
    expect(children[1]).not.toHaveClass('ring-1')
  })

  it('renders choose buttons when onChoose is provided', () => {
    const onChoose = jest.fn().mockResolvedValue(undefined)
    render(<ArtifactVariantStack node={makeVariantSet()} onChoose={onChoose}/>)
    const buttons = screen.getAllByRole('button', {name: /Choose/i})
    expect(buttons.length).toBe(2)
  })

  it('does not render choose buttons when onChoose is not provided', () => {
    render(<ArtifactVariantStack node={makeVariantSet()}/>)
    const buttons = screen.queryAllByRole('button', {name: /Choose/i})
    expect(buttons.length).toBe(0)
  })

  it('calls onChoose with the child node when the checkbox is clicked', async () => {
    const onChoose = jest.fn().mockResolvedValue(undefined)
    render(<ArtifactVariantStack node={makeVariantSet()} onChoose={onChoose}/>)
    const buttons = screen.getAllByRole('button', {name: /Choose/i})
    await act(async () => {
      fireEvent.click(buttons[0])
    })
    expect(onChoose).toHaveBeenCalledTimes(1)
    expect(onChoose).toHaveBeenCalledWith(expect.objectContaining({id: 'var-a'}))
  })

  it('shows the chosen variant label in the button aria-label', () => {
    const node = makeVariantSet({chosenVariantId: 'var-a'})
    const onChoose = jest.fn().mockResolvedValue(undefined)
    render(<ArtifactVariantStack node={node} onChoose={onChoose}/>)
    expect(screen.getByLabelText('Neon Noir (chosen)')).toBeInTheDocument()
    expect(screen.getByLabelText('Choose Warm Analog')).toBeInTheDocument()
  })

  it('shows a loading spinner while onChoose is pending', async () => {
    let resolveChoose: () => void
    const onChoose = jest.fn().mockImplementation(
        () => new Promise<void>((resolve) => {
          resolveChoose = resolve
        })
    )
    const {container} = render(
        <ArtifactVariantStack node={makeVariantSet()} onChoose={onChoose}/>
    )

    const buttons = screen.getAllByRole('button', {name: /Choose/i})
    await act(async () => {
      fireEvent.click(buttons[0])
    })

    // SquareLoaderIcon has animate-snake-spin class
    expect(container.querySelector('.animate-snake-spin')).toBeInTheDocument()

    // All choose buttons should be disabled while loading
    screen.getAllByRole('button', {name: /Choose|chosen/i}).forEach(btn => {
      expect(btn).toBeDisabled()
    })

    // Resolve the promise
    await act(async () => {
      resolveChoose!()
    })

    // Spinner should be gone
    await waitFor(() => {
      expect(container.querySelector('.animate-snake-spin')).not.toBeInTheDocument()
    })
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
      chosenVariantId: null,
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
      chosenVariantId: null,
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
    // "Inner Variants" appears in both the placeholder and the label below
    expect(screen.getAllByText('Inner Variants').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Variants')).toBeInTheDocument()
  })
})
