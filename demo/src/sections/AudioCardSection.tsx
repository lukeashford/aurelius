import React from 'react'
import {AudioCard} from '@lukeashford/aurelius'
import Section from './Section'

export default function AudioCardSection() {
  const sampleAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  return (
      <Section
          title="Audio Cards"
          subtitle="Cards with embedded audio players using ReactPlayer. Supports MP3, SoundCloud, and more."
      >
        <div className="space-y-12">
          {/* Basic AudioCard */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Standalone Audio Card</h3>
            <p className="text-silver text-sm mb-4">
              A dedicated component for audio content with built-in layout and typography.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <AudioCard
                  src={sampleAudioUrl}
                  title="Aurelius Audio Showcase"
                  subtitle="Demonstrating audio support in cards"
              />
            </div>
          </div>
        </div>
      </Section>
  )
}
