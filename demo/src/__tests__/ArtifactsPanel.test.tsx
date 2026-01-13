import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {ArtifactsPanel} from '@lukeashford/aurelius'

describe('ArtifactsPanel', () => {
  const mockArtifacts = [
    {
      id: '1',
      type: 'image' as const,
      src: 'https://example.com/image.jpg',
      alt: 'Test image',
      title: 'Image Title',
      subtitle: 'Image subtitle',
    },
    {
      id: '2',
      type: 'text' as const,
      title: 'Text Artifact',
      content: 'Some markdown content',
    },
  ]

  it('renders without crashing', () => {
    render(<ArtifactsPanel artifacts={[]}/>)
    expect(document.body).toBeInTheDocument()
  })

  it('renders collapsed by default (isOpen=false)', () => {
    render(<ArtifactsPanel artifacts={mockArtifacts}/>)
    // Should show expand button, not the artifacts panel title
    expect(screen.getByRole('button', {name: /expand artifacts panel/i})).toBeInTheDocument()
    expect(screen.queryByText('Artifacts')).not.toBeInTheDocument()
  })

  it('renders expanded when isOpen is true', () => {
    render(<ArtifactsPanel artifacts={mockArtifacts} isOpen={true}/>)
    expect(screen.getByText('Artifacts')).toBeInTheDocument()
  })

  it('shows artifact count badge when collapsed with artifacts', () => {
    render(<ArtifactsPanel artifacts={mockArtifacts} isOpen={false}/>)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('calls onClose when expand button is clicked in collapsed state', () => {
    const onClose = jest.fn()
    render(
        <ArtifactsPanel artifacts={mockArtifacts} isOpen={false} onClose={onClose}/>
    )

    fireEvent.click(screen.getByRole('button', {name: /expand artifacts panel/i}))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when collapse button is clicked in expanded state', () => {
    const onClose = jest.fn()
    render(
        <ArtifactsPanel artifacts={mockArtifacts} isOpen={true} onClose={onClose}/>
    )

    fireEvent.click(screen.getByRole('button', {name: /collapse artifacts panel/i}))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows empty state when no artifacts and expanded', () => {
    render(<ArtifactsPanel artifacts={[]} isOpen={true}/>)
    expect(screen.getByText('No artifacts to display')).toBeInTheDocument()
  })

  it('renders image artifact', () => {
    const imageArtifact = [
      {
        id: '1',
        type: 'image' as const,
        src: 'https://example.com/image.jpg',
        alt: 'Test image',
        title: 'My Image',
        subtitle: 'A test image',
      },
    ]
    render(<ArtifactsPanel artifacts={imageArtifact} isOpen={true}/>)
    expect(screen.getByText('My Image')).toBeInTheDocument()
  })

  it('renders text artifact with title', () => {
    const textArtifact = [
      {
        id: '1',
        type: 'text' as const,
        title: 'Documentation',
        content: 'Some documentation content',
      },
    ]
    render(<ArtifactsPanel artifacts={textArtifact} isOpen={true}/>)
    expect(screen.getByText('Documentation')).toBeInTheDocument()
  })

  it('renders video artifact', () => {
    const videoArtifact = [
      {
        id: '1',
        type: 'video' as const,
        src: 'https://example.com/video.mp4',
        title: 'Demo Video',
        subtitle: 'A demonstration',
      },
    ]
    render(<ArtifactsPanel artifacts={videoArtifact} isOpen={true}/>)
    expect(screen.getByText('Demo Video')).toBeInTheDocument()
  })

  it('shows skeleton when isLoading is true', () => {
    const artifactWithPending = [
      {
        id: '1',
        type: 'image' as const,
        src: 'https://example.com/image.jpg',
        isPending: true,
      },
    ]
    render(
        <ArtifactsPanel artifacts={artifactWithPending} isOpen={true} isLoading={true}/>
    )
    // Skeleton elements should be present
    const skeletons = document.querySelectorAll('[class*="animate"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('applies custom className', () => {
    const {container} = render(
        <ArtifactsPanel
            artifacts={mockArtifacts}
            isOpen={true}
            className="gap-4"
        />
    )
    expect(container.firstChild).toHaveClass('gap-4')
  })

  it('matches snapshot when collapsed with artifacts', () => {
    const {container} = render(
        <ArtifactsPanel artifacts={mockArtifacts} isOpen={false}/>
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot when expanded with artifacts', () => {
    const {container} = render(
        <ArtifactsPanel artifacts={mockArtifacts} isOpen={true}/>
    )
    expect(container).toMatchSnapshot()
  })

  it('matches snapshot when expanded with no artifacts', () => {
    const {container} = render(
        <ArtifactsPanel artifacts={[]} isOpen={true}/>
    )
    expect(container).toMatchSnapshot()
  })
})
