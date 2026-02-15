import React from 'react'
import ReactPlayer from 'react-player'
import {Music} from 'lucide-react'
import {Card, type CardProps} from './Card'
import {cx} from '../utils'

export interface AudioCardProps extends Omit<CardProps, 'title'> {
  src: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  playing?: boolean
  controls?: boolean
  volume?: number
  muted?: boolean
  loop?: boolean
  mediaClassName?: string
  contentClassName?: string
  playerProps?: any
  height?: string | number
}

export const AudioCard = React.forwardRef<HTMLDivElement, AudioCardProps>(
    (
        {
          src,
          title,
          subtitle,
          playing = false,
          controls = true,
          volume,
          muted = false,
          loop = false,
          mediaClassName,
          contentClassName,
          className,
          children,
          playerProps,
          height = '40px',
          ...props
        },
        ref
    ) => {
      return (
          <Card ref={ref} className={cx('p-0 overflow-hidden group w-full', className)} {...props}>
            {/* Media container */}
            <div
                className={cx(
                    'relative bg-obsidian py-8 flex flex-col items-center justify-center border-b border-ash',
                    mediaClassName
                )}
            >
              <div className="mb-4 text-gold">
                <Music size={48}/>
              </div>

              <div className="w-full px-4">
                <ReactPlayer
                    src={src}
                    playing={playing}
                    controls={controls}
                    volume={volume}
                    muted={muted}
                    loop={loop}
                    width="100%"
                    height={height}
                    style={{backgroundColor: 'transparent'}}
                    config={{
                      file: {
                        forceAudio: true,
                        attributes: {
                          style: {width: '100%', height: height}
                        }
                      }
                    }}
                    {...playerProps}
                />
              </div>
            </div>

            {/* Content section */}
            {(title || subtitle || children) && (
                <div className={cx('px-4 py-4', contentClassName)}>
                  {title && <h4
                      className="text-lg font-semibold leading-tight">{title}</h4>}
                  {subtitle && <p
                      className="text-sm text-silver leading-normal mt-1">{subtitle}</p>}
                  {children}
                </div>
            )}
          </Card>
      )
    }
)

AudioCard.displayName = 'AudioCard'
