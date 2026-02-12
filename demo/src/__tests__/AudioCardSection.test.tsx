import React from 'react'
import {render, screen} from '@testing-library/react'
import AudioCardSection from '../sections/AudioCardSection'

describe('AudioCardSection', () => {
  it('renders the section with audio cards', () => {
    render(<AudioCardSection/>)

    expect(screen.getByText('Audio Cards')).toBeInTheDocument()
    expect(screen.getByText('Standalone Audio Card')).toBeInTheDocument()

    // Check for mock players
    const mockPlayers = screen.getAllByTestId('mock-react-player')
    expect(mockPlayers.length).toBe(1)

    // Check for specific audio source
    expect(mockPlayers[0])
    .toHaveAttribute('data-src', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')
  })

  it('matches snapshot', () => {
    const {asFragment} = render(<AudioCardSection/>)
    expect(asFragment()).toMatchSnapshot()
  })
})
