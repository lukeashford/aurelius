import React from 'react'
import {Card, type CardProps} from './Card'

export type ImageAspectRatio = 'square' | 'video'

export interface ImageCardProps extends Omit<CardProps, 'children'> {
  src: string
  alt: string
  aspectRatio?: ImageAspectRatio
  overlay?: React.ReactNode
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

const aspectRatioMap: Record<ImageAspectRatio, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
}

export const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
    ({src, alt, aspectRatio = 'square', overlay, className, ...rest}, ref) => {
      return (
          <Card
              ref={ref}
              className={cx('p-0 overflow-hidden group', className)}
              {...rest}
          >
            <div className="relative">
              <img
                  src={src}
                  alt={alt}
                  className={cx(
                      'w-full h-full object-cover',
                      aspectRatioMap[aspectRatio]
                  )}
              />
              {overlay && (
                  <div
                      className="absolute inset-0 bg-obsidian/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    {overlay}
                  </div>
              )}
            </div>
          </Card>
      )
    }
)

ImageCard.displayName = 'ImageCard'

export default ImageCard
