import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {ArtifactsPanel, type ArtifactNode} from '@lukeashford/aurelius'

const IMG = 'https://example.com/image.jpg'

// --- Test data ---

const mockArtifacts = [
  {
    id: '1',
    type: 'IMAGE' as const,
    url: IMG,
    alt: 'Test image',
    title: 'Image Title',
    subtitle: 'Image subtitle',
  },
  {
    id: '2',
    type: 'TEXT' as const,
    title: 'Text Artifact',
    inlineContent: 'Some markdown content',
  },
]

const mockNodes: ArtifactNode[] = [
  {
    id: 'art-1',
    type: 'ARTIFACT',
    name: 'image_1',
    label: 'Image One',
    artifact: {
      id: 'a-1',
      type: 'IMAGE',
      url: IMG,
      alt: 'Test',
      title: 'Artifact Image',
    },
    children: [],
  },
  {
    id: 'group-1',
    type: 'GROUP',
    name: 'my_group',
    label: 'My Group',
    children: [
      {
        id: 'group-child-1',
        type: 'ARTIFACT',
        name: 'child_image',
        label: 'Child Image',
        artifact: {
          id: 'a-child-1',
          type: 'IMAGE',
          url: IMG,
          alt: 'Child',
          title: 'Child Artifact',
        },
        children: [],
      },
      {
        id: 'subgroup-1',
        type: 'GROUP',
        name: 'sub_group',
        label: 'Sub Group',
        children: [
          {
            id: 'deep-child',
            type: 'ARTIFACT',
            name: 'deep_image',
            label: 'Deep Image',
            artifact: {
              id: 'a-deep',
              type: 'IMAGE',
              url: IMG,
              alt: 'Deep',
              title: 'Deep Artifact',
            },
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'variant-1',
    type: 'VARIANT_SET',
    name: 'colors',
    label: 'Color Treatments',
    children: [
      {
        id: 'var-child-1',
        type: 'ARTIFACT',
        name: 'warm',
        label: 'Warm',
        artifact: {
          id: 'a-warm',
          type: 'IMAGE',
          url: IMG,
          alt: 'Warm',
          title: 'Warm Treatment',
        },
        children: [],
      },
    ],
  },
]

describe('ArtifactsPanel', () => {
  // ---- Collapsed state ----

  it('renders collapsed by default', () => {
    render(<ArtifactsPanel artifacts={mockArtifacts}/>)
    expect(screen.getByRole('button', {name: /expand artifacts panel/i})).toBeInTheDocument()
    expect(screen.queryByText('Artifacts')).not.toBeInTheDocument()
  })

  it('shows node count badge when collapsed in tree mode', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows artifact count badge when collapsed in flat mode', () => {
    render(<ArtifactsPanel artifacts={mockArtifacts}/>)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('calls onClose when expand button clicked in collapsed state', () => {
    const onClose = jest.fn()
    render(<ArtifactsPanel artifacts={mockArtifacts} onClose={onClose}/>)
    fireEvent.click(screen.getByRole('button', {name: /expand artifacts panel/i}))
    expect(onClose).toHaveBeenCalled()
  })

  // ---- Expanded flat mode ----

  it('renders expanded when isOpen is true', () => {
    render(<ArtifactsPanel artifacts={mockArtifacts} isOpen/>)
    expect(screen.getByText('Artifacts')).toBeInTheDocument()
  })

  it('shows empty state in flat mode', () => {
    render(<ArtifactsPanel artifacts={[]} isOpen/>)
    expect(screen.getByText('No artifacts to display')).toBeInTheDocument()
  })

  it('renders artifacts in flat mode', () => {
    render(<ArtifactsPanel artifacts={mockArtifacts} isOpen/>)
    expect(screen.getByText('Image Title')).toBeInTheDocument()
    expect(screen.getByText('Text Artifact')).toBeInTheDocument()
  })

  it('calls onClose when collapse button clicked', () => {
    const onClose = jest.fn()
    render(<ArtifactsPanel artifacts={mockArtifacts} isOpen onClose={onClose}/>)
    fireEvent.click(screen.getByRole('button', {name: /collapse artifacts panel/i}))
    expect(onClose).toHaveBeenCalled()
  })

  // ---- Tree mode ----

  it('renders tree nodes when provided', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    // Should see the artifact title, group label, variant set label
    expect(screen.getByText('Artifact Image')).toBeInTheDocument()
    expect(screen.getByText('My Group')).toBeInTheDocument()
    expect(screen.getByText('Color Treatments')).toBeInTheDocument()
  })

  it('does not show breadcrumbs at root level', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    expect(screen.queryByTestId('breadcrumb-nav')).not.toBeInTheDocument()
  })

  it('navigates into a group on click', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    // Click the group (it has role="button" and aria-label)
    const groupButton = screen.getByRole('button', {name: /My Group/})
    fireEvent.click(groupButton)
    // Now we should see the group's children
    expect(screen.getByText('Child Artifact')).toBeInTheDocument()
    // And breadcrumbs should appear
    expect(screen.getByTestId('breadcrumb-nav')).toBeInTheDocument()
    expect(screen.getByText('Root')).toBeInTheDocument()
    expect(screen.getByText('My Group')).toBeInTheDocument()
  })

  it('navigates back via breadcrumb', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    // Navigate into group
    fireEvent.click(screen.getByRole('button', {name: /My Group/}))
    expect(screen.getByText('Child Artifact')).toBeInTheDocument()
    // Click Root breadcrumb
    fireEvent.click(screen.getByText('Root'))
    // Should be back at root
    expect(screen.getByText('Artifact Image')).toBeInTheDocument()
    expect(screen.queryByTestId('breadcrumb-nav')).not.toBeInTheDocument()
  })

  it('supports deep navigation with breadcrumb trail', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    // Navigate into My Group
    fireEvent.click(screen.getByRole('button', {name: /My Group/}))
    // Navigate into Sub Group
    fireEvent.click(screen.getByRole('button', {name: /Sub Group/}))
    // Should see deep artifact
    expect(screen.getByText('Deep Artifact')).toBeInTheDocument()
    // Breadcrumb should show full trail
    expect(screen.getByText('Root')).toBeInTheDocument()
    // My Group appears in breadcrumb as a clickable button
    const nav = screen.getByTestId('breadcrumb-nav')
    expect(nav).toHaveTextContent('Root')
    expect(nav).toHaveTextContent('My Group')
    expect(nav).toHaveTextContent('Sub Group')
  })

  it('can jump to middle of breadcrumb trail', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    fireEvent.click(screen.getByRole('button', {name: /My Group/}))
    fireEvent.click(screen.getByRole('button', {name: /Sub Group/}))
    // Jump to My Group level
    const myGroupBreadcrumb = screen.getByTestId('breadcrumb-nav').querySelector('button')
    // First button is Root, second is My Group
    const buttons = screen.getByTestId('breadcrumb-nav').querySelectorAll('button')
    fireEvent.click(buttons[1]) // My Group
    // Should see My Group's children, not deep ones
    expect(screen.getByText('Child Artifact')).toBeInTheDocument()
  })

  // ---- Zoom controls ----

  it('shows zoom controls in tree mode', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    expect(screen.getByTestId('zoom-controls')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('does not show zoom controls in flat mode', () => {
    render(<ArtifactsPanel artifacts={mockArtifacts} isOpen/>)
    expect(screen.queryByTestId('zoom-controls')).not.toBeInTheDocument()
  })

  it('zooms out on minus click', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('75%')
  })

  it('zooms in after zooming out', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('50%')
    fireEvent.click(screen.getByRole('button', {name: /zoom in/i}))
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('75%')
  })

  it('disables zoom in at max zoom', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    expect(screen.getByRole('button', {name: /zoom in/i})).toBeDisabled()
  })

  it('disables zoom out at min zoom', () => {
    render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    // Click zoom out 3 times to reach 25%
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('25%')
    expect(screen.getByRole('button', {name: /zoom out/i})).toBeDisabled()
  })

  // ---- CSS / Layout ----

  it('applies custom className', () => {
    const {container} = render(
        <ArtifactsPanel artifacts={mockArtifacts} isOpen className="gap-4"/>
    )
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('applies custom width style', () => {
    const {container} = render(
        <ArtifactsPanel artifacts={mockArtifacts} isOpen width="600px"/>
    )
    const panel = container.querySelector('[data-testid="artifacts-panel"]')
    expect(panel).toHaveStyle({width: '600px'})
  })

  // ---- Snapshots ----

  it('matches snapshot when collapsed with nodes', () => {
    const {container} = render(<ArtifactsPanel nodes={mockNodes}/>)
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot when expanded with nodes', () => {
    const {container} = render(<ArtifactsPanel nodes={mockNodes} isOpen/>)
    expect(container).toMatchSnapshot()
  })
})
