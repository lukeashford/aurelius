import React from 'react'
import {type ImageAspectRatio, ImageCard} from '@lukeashford/aurelius'

const aspectRatios: ImageAspectRatio[] = ['square', 'video']

export default function ImageCardSection() {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Image Cards</h2>
          <p className="text-silver">Cards with images and optional overlays in different aspect
            ratios.</p>
        </header>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Aspect Ratios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aspectRatios.map(ratio => (
                  <div key={ratio}>
                    <p className="text-silver text-sm mb-2 font-mono">{ratio}</p>
                    <ImageCard
                        src={`https://picsum.photos/seed/${ratio}/800/800`}
                        alt={`${ratio} aspect ratio example`}
                        aspectRatio={ratio}
                    />
                  </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">With Overlay</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageCard
                  src="https://picsum.photos/seed/overlay1/800/800"
                  alt="Image with overlay"
                  aspectRatio="square"
                  overlay={
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-obsidian/90 to-transparent flex items-end p-4">
                      <div>
                        <h4 className="text-white font-semibold text-lg">Image Title</h4>
                        <p className="text-silver text-sm">Description text goes here</p>
                      </div>
                    </div>
                  }
              />
              <ImageCard
                  src="https://picsum.photos/seed/overlay2/800/450"
                  alt="Video aspect with overlay"
                  aspectRatio="video"
                  overlay={
                    <div
                        className="absolute inset-0 bg-obsidian/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-semibold">Hover Overlay</p>
                    </div>
                  }
              />
            </div>
          </div>
        </div>
      </div>
  )
}
