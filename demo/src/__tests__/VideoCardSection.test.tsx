import React from 'react'
import {render, screen} from '@testing-library/react'
import VideoCardSection from '../sections/VideoCardSection'

describe('VideoCardSection', () => {
  it('renders the section with video cards', () => {
    render(<VideoCardSection/>)

    expect(screen.getByText('Video Cards')).toBeInTheDocument()
    expect(screen.getByText('Standalone Video Card')).toBeInTheDocument()

    // Check for mock players
    const mockPlayers = screen.getAllByTestId('mock-react-player')
    expect(mockPlayers.length).toBeGreaterThan(0)

    // Check for specific video source
    expect(mockPlayers[0])
    .toHaveAttribute('data-src', 'https://youtu.be/Oe6I6fAhNDw')
  })

  it('matches snapshot', () => {
    const {asFragment} = render(<VideoCardSection/>)
    expect(asFragment()).toMatchSnapshot()
  })
})
