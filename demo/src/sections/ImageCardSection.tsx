import React from 'react'
import {type AspectRatio, ImageCard} from '@lukeashford/aurelius'
import Section from './Section'

const presetRatios: AspectRatio[] = ['landscape', 'portrait', 'square']
const customRatios: { ratio: AspectRatio; seed: string }[] = [
  {ratio: '16/9', seed: '16x9'},
  {ratio: '4/3', seed: '4x3'},
  {ratio: '21/9', seed: '21x9'},
]

export default function ImageCardSection() {
  return (
      <Section
          title="Image Cards"
          subtitle="Cards with images and optional overlays. Supports preset and custom aspect ratios."
      >
        <div className="space-y-12">
          {/* Natural sizing (no aspect ratio) */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Natural Sizing</h3>
            <p className="text-silver text-sm mb-4">
              Without an aspectRatio prop, the card wraps the image's natural dimensions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <ImageCard
                  src="https://picsum.photos/seed/natural/600/400"
                  alt="Natural aspect ratio"
                  title="Natural Dimensions"
                  subtitle="Image dictates the card shape"
              />
              <ImageCard
                  src="https://picsum.photos/seed/tall/400/600"
                  alt="Tall natural aspect ratio"
                  title="Tall Image"
                  subtitle="Container adapts to content"
              />
            </div>
          </div>

          {/* Preset aspect ratios */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Preset Ratios</h3>
            <p className="text-silver text-sm mb-4">
              Industry-standard presets: landscape (3/2), portrait (2/3), square (1/1).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {presetRatios.map((ratio) => (
                  <ImageCard
                      key={ratio}
                      src={`https://picsum.photos/seed/${ratio}/800/800`}
                      alt={`${ratio} aspect ratio`}
                      aspectRatio={ratio}
                      title={ratio.charAt(0).toUpperCase() + ratio.slice(1)}
                  />
              ))}
            </div>
          </div>

          {/* Custom aspect ratios */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Custom Ratios</h3>
            <p className="text-silver text-sm mb-4">
              Any ratio as a string: "16/9", "4/3", "21/9", "4/5", etc.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {customRatios.map(({ratio, seed}) => (
                  <ImageCard
                      key={ratio}
                      src={`https://picsum.photos/seed/${seed}/800/600`}
                      alt={`${ratio} aspect ratio`}
                      aspectRatio={ratio}
                      title={ratio}
                  />
              ))}
            </div>
          </div>

          {/* Object fit comparison */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Object Fit</h3>
            <p className="text-silver text-sm mb-4">
              Controls how the image fills its container: "cover" crops to fill, "contain" shows the
              entire image.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <ImageCard
                  src="https://picsum.photos/seed/cover/800/400"
                  alt="Cover fit example"
                  aspectRatio="square"
                  objectFit="cover"
                  title="Cover (default)"
                  subtitle="Image fills container, overflow is cropped"
              />
              <ImageCard
                  src="https://picsum.photos/seed/cover/800/400"
                  alt="Contain fit example"
                  aspectRatio="square"
                  objectFit="contain"
                  title="Contain"
                  subtitle="Entire image visible, with letterboxing"
              />
            </div>
          </div>

          {/* With overlay */}
          <div>
            <h3 className="text-lg font-semibold mb-2">With Overlay</h3>
            <p className="text-silver text-sm mb-4">
              Add interactive overlays that appear on hover.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <ImageCard
                  src="https://picsum.photos/seed/overlay1/800/800"
                  alt="Image with gradient overlay"
                  aspectRatio="square"
                  overlay={
                    <div
                        className="absolute inset-0 bg-linear-to-t from-obsidian/90 to-transparent flex items-end p-4">
                      <div>
                        <h4 className="text-white font-semibold text-lg">Gradient Overlay</h4>
                        <p className="text-silver text-sm">Content anchored to bottom</p>
                      </div>
                    </div>
                  }
              />
              <ImageCard
                  src="https://picsum.photos/seed/overlay2/800/450"
                  alt="Image with centered overlay"
                  aspectRatio="landscape"
                  overlay={
                    <p className="text-white font-semibold">Centered Hover Content</p>
                  }
              />
            </div>
          </div>
        </div>
      </Section>
  )
}