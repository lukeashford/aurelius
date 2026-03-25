import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {ArtifactsPanel} from '@lukeashford/aurelius'

const IMG = 'https://example.com/image.jpg'

// --- Test data ---

const mockNodes = [
  {
    id: 'art-1',
    type: 'ARTIFACT' as const,
    name: 'image_1',
    label: 'Image One',
    artifact: {
      id: 'a-1',
      type: 'IMAGE' as const,
      url: IMG,
      alt: 'Test',
      title: 'Artifact Image',
    },
    children: [],
  },
  {
    id: 'group-1',
    type: 'GROUP' as const,
    name: 'my_group',
    label: 'My Group',
    children: [
      {
        id: 'group-child-1',
        type: 'ARTIFACT' as const,
        name: 'child_image',
        label: 'Child Image',
        artifact: {
          id: 'a-child-1',
          type: 'IMAGE' as const,
          url: IMG,
          alt: 'Child',
          title: 'Child Artifact',
        },
        children: [],
      },
      {
        id: 'subgroup-1',
        type: 'GROUP' as const,
        name: 'sub_group',
        label: 'Sub Group',
        children: [
          {
            id: 'deep-child',
            type: 'ARTIFACT' as const,
            name: 'deep_image',
            label: 'Deep Image',
            artifact: {
              id: 'a-deep',
              type: 'IMAGE' as const,
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
    type: 'VARIANT_SET' as const,
    name: 'colors',
    label: 'Color Treatments',
    children: [
      {
        id: 'var-child-1',
        type: 'ARTIFACT' as const,
        name: 'warm',
        label: 'Warm',
        artifact: {
          id: 'a-warm',
          type: 'IMAGE' as const,
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
  // ---- Content rendering ----

  it('renders with header', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    expect(screen.getByText('Artifacts')).toBeInTheDocument()
  })

  it('shows empty state when no nodes provided', () => {
    render(<ArtifactsPanel/>)
    expect(screen.getByText('No artifacts to display')).toBeInTheDocument()
  })

  it('shows empty state for empty nodes array', () => {
    render(<ArtifactsPanel nodes={[]}/>)
    expect(screen.getByText('No artifacts to display')).toBeInTheDocument()
  })

  // ---- Tree mode ----

  it('renders tree nodes when provided', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    expect(screen.getByText('Artifact Image')).toBeInTheDocument()
    expect(screen.getByText('My Group')).toBeInTheDocument()
    expect(screen.getByText('Color Treatments')).toBeInTheDocument()
  })

  it('does not show breadcrumbs at root level', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    expect(screen.queryByTestId('breadcrumb-nav')).not.toBeInTheDocument()
  })

  it('navigates into a group on click', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    const groupButton = screen.getByRole('button', {name: /My Group/})
    fireEvent.click(groupButton)
    expect(screen.getByText('Child Artifact')).toBeInTheDocument()
    expect(screen.getByTestId('breadcrumb-nav')).toBeInTheDocument()
    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('My Group')).toBeInTheDocument()
  })

  it('navigates back via breadcrumb', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    fireEvent.click(screen.getByRole('button', {name: /My Group/}))
    expect(screen.getByText('Child Artifact')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Project'))
    expect(screen.getByText('Artifact Image')).toBeInTheDocument()
    expect(screen.queryByTestId('breadcrumb-nav')).not.toBeInTheDocument()
  })

  it('supports deep navigation with breadcrumb trail', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    fireEvent.click(screen.getByRole('button', {name: /My Group/}))
    fireEvent.click(screen.getByRole('button', {name: /Sub Group/}))
    expect(screen.getByText('Deep Artifact')).toBeInTheDocument()
    const nav = screen.getByTestId('breadcrumb-nav')
    expect(nav).toHaveTextContent('Project')
    expect(nav).toHaveTextContent('My Group')
    expect(nav).toHaveTextContent('Sub Group')
  })

  it('can jump to middle of breadcrumb trail', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    fireEvent.click(screen.getByRole('button', {name: /My Group/}))
    fireEvent.click(screen.getByRole('button', {name: /Sub Group/}))
    const buttons = screen.getByTestId('breadcrumb-nav').querySelectorAll('button')
    fireEvent.click(buttons[1]) // My Group
    expect(screen.getByText('Child Artifact')).toBeInTheDocument()
  })

  // ---- Zoom controls ----

  it('shows zoom controls when nodes are provided', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    expect(screen.getByTestId('zoom-controls')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('does not show zoom controls when no nodes provided', () => {
    render(<ArtifactsPanel/>)
    expect(screen.queryByTestId('zoom-controls')).not.toBeInTheDocument()
  })

  it('zooms out on minus click', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('75%')
  })

  it('zooms in after zooming out', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('50%')
    fireEvent.click(screen.getByRole('button', {name: /zoom in/i}))
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('75%')
  })

  it('disables zoom in at max zoom', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    expect(screen.getByRole('button', {name: /zoom in/i})).toBeDisabled()
  })

  it('disables zoom out at min zoom', () => {
    render(<ArtifactsPanel nodes={mockNodes}/>)
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    fireEvent.click(screen.getByRole('button', {name: /zoom out/i}))
    expect(screen.getByTestId('zoom-level')).toHaveTextContent('25%')
    expect(screen.getByRole('button', {name: /zoom out/i})).toBeDisabled()
  })

  // ---- CSS / Layout ----

  it('applies custom className', () => {
    const {container} = render(
        <ArtifactsPanel nodes={mockNodes} className="gap-4"/>
    )
    expect(container.firstChild).toHaveClass('gap-4')
  })

  // ---- Snapshots ----

  it('matches snapshot with nodes', () => {
    const {container} = render(<ArtifactsPanel nodes={mockNodes}/>)
    expect(container).toMatchSnapshot()
  })
})
