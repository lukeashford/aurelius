import React from 'react'
import ReactPlayer from 'react-player'
import {Card, type CardProps} from './Card'
import {cx} from '../utils/cx'

export type VideoAspectRatioPreset = 'video' | 'cinema' | 'square'
export type VideoAspectRatio = VideoAspectRatioPreset | `${number}/${number}`

export interface VideoCardProps extends Omit<CardProps, 'title'> {
  src: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  aspectRatio?: VideoAspectRatio
  playing?: boolean
  controls?: boolean
  light?: boolean | string
  volume?: number
  muted?: boolean
  loop?: boolean
  mediaClassName?: string
  contentClassName?: string
  playerProps?: any
}

const ASPECT_RATIO_PRESETS: Record<VideoAspectRatioPreset, string> = {
  video: '16 / 9',
  cinema: '21 / 9',
  square: '1 / 1',
}

function resolveAspectRatio(ratio: VideoAspectRatio): string {
  if (ratio in ASPECT_RATIO_PRESETS) {
    return ASPECT_RATIO_PRESETS[ratio as VideoAspectRatioPreset]
  }
  return ratio.replace('/', ' / ')
}

export const VideoCard = React.forwardRef<HTMLDivElement, VideoCardProps>(
    (
        {
          src,
          title,
          subtitle,
          aspectRatio = 'video',
          playing = false,
          controls = true,
          light = false,
          volume,
          muted = false,
          loop = false,
          mediaClassName,
          contentClassName,
          className,
          children,
          playerProps,
          ...props
        },
        ref
    ) => {
      const hasAspectRatio = aspectRatio !== undefined

      return (
          <Card ref={ref} className={cx('p-0 overflow-hidden group w-full', className)} {...props}>
            {/* Media container */}
            <div
                className={cx(
                    'relative bg-void overflow-hidden',
                    mediaClassName
                )}
                style={{aspectRatio: resolveAspectRatio(aspectRatio)}}
            >
              <ReactPlayer
                  src={src}
                  playing={playing}
                  controls={controls}
                  light={light}
                  volume={volume}
                  muted={muted}
                  loop={loop}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                  {...playerProps}
              />
            </div>

            {/* Content section */}
            {(title || subtitle || children) && (
                <div className={cx('px-4 py-4', contentClassName)}>
                  {title && <h4 className="text-lg font-semibold leading-tight">{title}</h4>}
                  {subtitle && <p
                      className="text-sm text-silver leading-normal mt-1">{subtitle}</p>}
                  {children}
                </div>
            )}
          </Card>
      )
    }
)

VideoCard.displayName = 'VideoCard'
