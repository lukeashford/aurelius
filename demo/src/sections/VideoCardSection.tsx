import React from 'react'
import {VideoCard} from '@lukeashford/aurelius'
import Section from './Section'

export default function VideoCardSection() {
  const youtubeUrl = 'https://youtu.be/Oe6I6fAhNDw'

  return (
      <Section
          title="Video Cards"
          subtitle="Cards with embedded video players using ReactPlayer. Supports YouTube, Vimeo, and more."
      >
        <div className="space-y-12">
          {/* Basic VideoCard */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Standalone Video Card</h3>
            <p className="text-silver text-sm mb-4">
              A dedicated component for video content with built-in layout and typography.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <VideoCard
                  src={youtubeUrl}
                  title="Aurelius Video Showcase"
                  subtitle="Demonstrating video support in cards"
              />
              <VideoCard
                  src={youtubeUrl}
                  title="With Custom Aspect Ratio and Thumbnail"
                  subtitle="Cinema 21:9 aspect ratio"
                  aspectRatio="cinema"
                  light="https://picsum.photos/seed/video-thumb/800/450"
              />
            </div>
          </div>
        </div>
      </Section>
  )
}
