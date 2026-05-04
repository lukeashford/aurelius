import React from 'react'
import ReactPlayer from 'react-player'
import {Music} from 'lucide-react'
import {Card, type CardProps, type CardSlotLoading} from './Card'
import {cx} from '../utils'

type ReactPlayerProps = React.ComponentProps<typeof ReactPlayer>

export interface AudioCardProps extends Omit<CardProps, 'title'> {
  src?: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  /** The artifact's `@-handle` — see `Card.Header.handle`. */
  handle?: string
  playing?: boolean
  controls?: boolean
  volume?: number
  muted?: boolean
  loop?: boolean
  mediaClassName?: string
  contentClassName?: string
  /** Forwarded to the underlying ReactPlayer. */
  playerProps?: Partial<ReactPlayerProps>
  height?: string | number
  loading?: CardSlotLoading
}

export const AudioCard = React.forwardRef<HTMLDivElement, AudioCardProps>(
    (
        {
          src,
          title,
          subtitle,
          handle,
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
            <Card.Media className={cx('bg-obsidian py-8 flex flex-col items-center justify-center',
                mediaClassName)}>
              <div className="mb-4 text-gold">
                <Music size={48}/>
              </div>

              {src && (
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
                        style={{backgroundColor: 'transparent', width: '100%', height}}
                        {...playerProps}
                    />
                  </div>
              )}
            </Card.Media>
            <Card.Header
                title={title}
                subtitle={subtitle}
                handle={handle}
                className={contentClassName}
            />
            {children && <Card.Body className={contentClassName}>{children}</Card.Body>}
          </Card>
      )
    }
)

AudioCard.displayName = 'AudioCard'
