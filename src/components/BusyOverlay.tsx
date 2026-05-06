import React from 'react'
import {cx} from '../utils'
import {Spinner} from './Spinner'

export type BusyOverlayTone = 'dim' | 'frost'
export type BusyOverlayBlurStrength = 'sm' | 'md' | 'lg'

export interface BusyOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional content rendered next to the spinner — typically a short label
   * like "Loading session…". Pass any ReactNode so callers can compose icons,
   * countdowns, or even nested links if needed.
   */
  label?: React.ReactNode
  /**
   * Backdrop blur strength. `sm` is the default and reads as "this region is
   * busy, the scene behind is still legible". Use `md` or `lg` only when you
   * deliberately want to discourage the user from interacting with the
   * region behind — e.g. a destructive retry-in-flight.
   * @default 'sm'
   */
  blurStrength?: BusyOverlayBlurStrength
  /**
   * Visual weight of the overlay tint.
   *
   * - `dim` (default) — translucent dark wash, lighter on the eyes,
   *   communicates "this area is temporarily busy".
   * - `frost` — heavier wash + blur, communicates "blocking-modal feel"
   *   suitable for in-flight retries where the user shouldn't keep
   *   reading the dimmed content.
   *
   * @default 'dim'
   */
  tone?: BusyOverlayTone
}

const blurClass: Record<BusyOverlayBlurStrength, string> = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
}

const toneClass: Record<BusyOverlayTone, string> = {
  dim: 'bg-obsidian/40',
  frost: 'bg-obsidian/80',
}

/**
 * Centered busy indicator that mounts `position: absolute inset-0` over its
 * positioned parent. Use it when a known region is *temporarily unavailable
 * but its surrounding chrome still matters* — chat tree mid-load, retry
 * in-flight, "reconnecting" hops. Prefer `Skeleton` for data-shaped regions
 * where the layout is known and you can preview content shape; prefer the
 * `ChatInputNotice` slot when the unavailability is on a control rather
 * than a region.
 *
 * The host must establish a positioning context (`relative`, `absolute`, or
 * `fixed`) — `BusyOverlay` does not create its own.
 */
export function BusyOverlay({
                              label,
                              blurStrength = 'sm',
                              tone = 'dim',
                              className,
                              ...rest
                            }: BusyOverlayProps) {
  return (
      <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className={cx(
              'absolute inset-0 z-10 flex items-center justify-center',
              toneClass[tone],
              blurClass[blurStrength],
              className,
          )}
          {...rest}
      >
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          <Spinner size="sm"/>
          {label && <span>{label}</span>}
        </div>
      </div>
  )
}

BusyOverlay.displayName = 'BusyOverlay'

export default BusyOverlay
