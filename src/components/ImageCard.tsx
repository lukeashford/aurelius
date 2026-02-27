import React from 'react'
import {Card, type CardProps, type CardSlotLoading} from './Card'
import {cx} from '../utils'

export type AspectRatioPreset = 'landscape' | 'portrait' | 'square'
export type AspectRatio = AspectRatioPreset | `${number}/${number}`

export interface ImageCardProps extends Omit<CardProps, 'title'> {
  src?: string
  alt?: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  aspectRatio?: AspectRatio
  objectFit?: 'cover' | 'contain'
  overlay?: React.ReactNode
  mediaClassName?: string
  contentClassName?: string
  loading?: CardSlotLoading
}

const ASPECT_RATIO_PRESETS: Record<AspectRatioPreset, string> = {
  landscape: '3 / 2',
  portrait: '2 / 3',
  square: '1 / 1',
}

function resolveAspectRatio(ratio: AspectRatio): string {
  if (ratio in ASPECT_RATIO_PRESETS) {
    return ASPECT_RATIO_PRESETS[ratio as AspectRatioPreset]
  }
  return ratio.replace('/', ' / ')
}

export const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
    (
        {
          src,
          alt = '',
          title,
          subtitle,
          aspectRatio = 'landscape',
          objectFit = 'cover',
          overlay,
          mediaClassName,
          contentClassName,
          className,
          children,
          loading,
          ...props
        },
        ref
    ) => {
      return (
          <Card
              ref={ref}
              className={cx('p-0 overflow-hidden w-full', className)}
              loading={loading}
              {...props}
          >
            <Card.Media
                className={mediaClassName}
                style={{aspectRatio: resolveAspectRatio(aspectRatio)}}
            >
              <>
                {src && (
                    <img
                        src={src}
                        alt={alt}
                        className={cx(
                            'w-full h-full',
                            objectFit === 'cover' ? 'object-cover' : 'object-contain'
                        )}
                    />
                )}
                {overlay && (
                    <div
                        className="absolute inset-0 bg-obsidian/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      {overlay}
                    </div>
                )}
              </>
            </Card.Media>
            <Card.Header
                title={title}
                subtitle={subtitle}
                className={contentClassName}
            />
            {children && <Card.Body className={contentClassName}>{children}</Card.Body>}
          </Card>
      )
    }
)

ImageCard.displayName = 'ImageCard'