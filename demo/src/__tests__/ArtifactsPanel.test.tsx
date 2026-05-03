import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import type {ArtifactNode} from '@lukeashford/aurelius'
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

// ── Modal rendering: shares the card's render path so no divergence ──
//
// Pre-fix the modal had its own type-switch with an unguarded
// `<img src={artifact.url}>`. When `url` was undefined the browser drew the
// broken-image glyph captioned with the literal "Artifact image" alt
// fallback — the exact failure mode that motivated unifying renderers.
//
// Each test below opens an artifact and reads the modal subtree directly,
// so a regression that re-introduces a divergent path would fail here.

describe('ArtifactsPanel — modal renders through ArtifactCard', () => {
  function openModal(nodes: ArtifactNode[]) {
    const {container} = render(<ArtifactsPanel nodes={nodes}/>)
    // ArtifactCard is the clickable surface for IMAGE / PDF / SCRIPT / TEXT.
    // First clickable card opens the modal; backdrop is `inset-0 z-50`.
    const cards = container.querySelectorAll<HTMLElement>('.cursor-pointer')
    expect(cards.length).toBeGreaterThan(0)
    fireEvent.click(cards[0])
    const modal = container.querySelector<HTMLElement>('.fixed.inset-0.z-50')
    expect(modal).toBeTruthy()
    return modal!
  }

  it('regression: opens an IMAGE artifact missing a url without rendering a broken <img>', () => {
    // Simulates the placeholder-fabrication race: a node arrived without its
    // DTO, so it's marked pending with no url. The pre-fix modal would
    // unconditionally render `<img src={undefined}>` here.
    const modal = openModal([
      {
        id: 'art-empty',
        type: 'ARTIFACT' as const,
        name: 'still_pending',
        label: 'Still Pending',
        artifact: {
          id: 'a-empty',
          type: 'IMAGE' as const,
          title: 'Still Pending',
          isPending: true,
        },
        children: [],
      },
    ])
    // The card path uses ImageCard, which guards `{src && <img/>}`. With no
    // url, the modal therefore contains no <img> at all — instead of one
    // with src=undefined that would draw the broken-image glyph.
    const imgs = modal.querySelectorAll('img')
    expect(imgs.length).toBe(0)
    // And the title we DO know about renders — the user sees a real label.
    expect(modal.textContent).toContain('Still Pending')
  })

  it('opens an IMAGE artifact with a url and renders a single <img> with the right src/alt', () => {
    const modal = openModal([
      {
        id: 'art-img',
        type: 'ARTIFACT' as const,
        name: 'real_image',
        label: 'Real Image',
        artifact: {
          id: 'a-img',
          type: 'IMAGE' as const,
          url: 'https://example.com/img.jpg',
          alt: 'A real picture',
          title: 'Real Image',
        },
        children: [],
      },
    ])
    const imgs = modal.querySelectorAll('img')
    expect(imgs.length).toBe(1)
    expect(imgs[0].getAttribute('src')).toBe('https://example.com/img.jpg')
    // The alt is the artifact's actual alt — never the hardcoded
    // "Artifact image" string the pre-fix modal used as a fallback.
    expect(imgs[0].getAttribute('alt')).toBe('A real picture')
  })

  it('opens a TEXT artifact (the DELIVERABLE mapping target) and shows its inline content', () => {
    // Mirrors how mapArtifact in atrium handles ArtifactKind.DELIVERABLE:
    // type=TEXT, mimeType=application/json, inlineContent=the JSON body.
    const json = '{"title":"LAST LIGHT","sections":[]}'
    const modal = openModal([
      {
        id: 'art-deliv',
        type: 'ARTIFACT' as const,
        name: 'pitch_deck',
        label: 'Pitch Deck',
        artifact: {
          id: 'a-deliv',
          type: 'TEXT' as const,
          title: 'Pitch Deck',
          inlineContent: json,
          mimeType: 'application/json',
        },
        children: [],
      },
    ])
    expect(modal.textContent).toContain('LAST LIGHT')
    // No phantom broken image for a non-image artifact.
    expect(modal.querySelectorAll('img').length).toBe(0)
  })

  it('the literal "Artifact image" fallback string is gone from the modal', () => {
    // Belt-and-braces: the hardcoded alt-text fallback that the user saw
    // captioning the broken-image glyph is no longer anywhere in the modal,
    // for any artifact shape.
    const modal = openModal([
      {
        id: 'art-empty',
        type: 'ARTIFACT' as const,
        name: 'still_pending',
        label: 'Still Pending',
        artifact: {
          id: 'a-empty',
          type: 'IMAGE' as const,
          title: 'Still Pending',
          isPending: true,
        },
        children: [],
      },
    ])
    expect(modal.textContent).not.toContain('Artifact image')
  })
})
