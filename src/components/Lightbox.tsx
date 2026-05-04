import React, {useCallback} from 'react'
import {cx, useEscapeKey} from '../utils'
import {CloseIcon} from './icons'

export interface LightboxProps {
  /**
   * Called when the user dismisses the lightbox (ESC, backdrop click, X button).
   * The caller owns the open/closed state — when `onClose` fires, unmount the
   * lightbox.
   */
  onClose: () => void
  /**
   * Optional kind-specific actions placed before the close button in the
   * floating top-right cluster. Typically buttons like "Share" or "Download".
   * The cluster always renders the close button; pass `undefined` if the only
   * affordance is dismiss.
   */
  actions?: React.ReactNode
  /**
   * Optional caption shown bottom-centre over the backdrop. Use for short
   * metadata like a title and subtitle. Non-interactive — clicks pass through
   * to the backdrop and dismiss.
   */
  caption?: React.ReactNode
  /**
   * The artifact body. Sits directly on the backdrop with no inner frame —
   * the body is responsible for its own layout (object-contain image, scrollable
   * deliverable, readable text column, etc.). Click events whose target is the
   * sized content wrapper (i.e. the empty area around the body) dismiss the
   * lightbox; clicks on the body itself do not.
   */
  children: React.ReactNode
  className?: string
}

/**
 * Full-bleed modal canvas for one piece of content. Premium-haptic alternative
 * to a bordered modal: deep void backdrop, scale-fade entrance, no inner frame,
 * floating glass action cluster top-right.
 *
 * The component is content-agnostic — it ships chrome, not artifact knowledge.
 * Compose it with kind-aware bodies and action sets to build the artifact
 * viewer; reach for it directly any time a single piece of content needs the
 * full screen.
 *
 * Dismiss surfaces: ESC, backdrop click (outside the sized content area),
 * close button in the action cluster.
 */
export function Lightbox({
  onClose,
  actions,
  caption,
  children,
  className,
}: LightboxProps) {
  useEscapeKey(onClose)

  // Two close-zones: the backdrop itself and the empty area around the body
  // inside the sized content wrapper. Children that should not dismiss (the
  // body, the action cluster) are descendants — their click targets aren't
  // the wrapper, so the guard skips them.
  const handleSurfaceClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
      <div
          className={cx(
              'fixed inset-0 z-50 flex items-center justify-center',
              'bg-void/95 backdrop-blur-md animate-fade-in',
              className,
          )}
          onClick={handleSurfaceClick}
          role="dialog"
          aria-modal="true"
      >
        {/* Floating action cluster — stays put as content scrolls */}
        <div
            className={cx(
                'absolute top-3 right-3 z-10 flex items-center',
                'bg-charcoal/70 backdrop-blur border border-ash/40',
                'group/actions hover:border-gold/40 transition-colors',
            )}
        >
          {actions && (
              <>
                <div className="flex items-center gap-1 px-1 py-1">
                  {actions}
                </div>
                <div className="w-px self-stretch bg-ash/40"/>
              </>
          )}
          <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 text-silver hover:text-white hover:bg-ash/20 transition-colors"
          >
            <CloseIcon className="w-5 h-5"/>
          </button>
        </div>

        {/* Sized canvas — bare, no frame. Click on the empty area dismisses. */}
        <div
            className="relative w-11/12 h-11/12 max-w-7xl flex items-center justify-center animate-lightbox-in"
            onClick={handleSurfaceClick}
        >
          {children}
        </div>

        {caption && (
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none px-4">
              {caption}
            </div>
        )}
      </div>
  )
}
