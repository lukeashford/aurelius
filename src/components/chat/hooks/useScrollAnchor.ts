import {useCallback, useRef} from 'react'

export interface UseScrollAnchorOptions {
  /**
   * Behavior for scrolling. Defaults to 'smooth'.
   */
  behavior?: ScrollBehavior
  /**
   * Block alignment for scrollIntoView. Defaults to 'start'.
   */
  block?: ScrollLogicalPosition
}

export interface UseScrollAnchorReturn {
  /**
   * Ref to attach to the scrollable container
   */
  containerRef: React.RefObject<HTMLDivElement | null>
  /**
   * Ref to attach to the anchor element (latest user message)
   */
  anchorRef: React.RefObject<HTMLDivElement | null>
  /**
   * Scroll the anchor element into view. Call this on user message submission.
   */
  scrollToAnchor: () => void
  /**
   * Scroll to the bottom of the container.
   */
  scrollToBottom: () => void
  /**
   * Check if user has scrolled away from the bottom.
   */
  isScrolledToBottom: () => boolean
}

/**
 * Hook for smart scroll behavior in chat interfaces.
 *
 * Key behaviors:
 * - Anchors user messages to the top of the viewport when they send a message
 * - Does NOT auto-scroll during streaming to respect user's reading position
 * - Allows manual scroll detection
 */
export function useScrollAnchor(
    options: UseScrollAnchorOptions = {}
): UseScrollAnchorReturn {
  const {behavior = 'smooth', block = 'start'} = options

  const containerRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  const scrollToAnchor = useCallback(() => {
    const el = anchorRef.current
    if (!el) {
      return
    }

    // Double rAF to ensure layout updates (e.g., adaptive spacer) have been applied.
    // First frame: other rAF callbacks (like spacer recalculation) run
    // Second frame: scroll happens with correct layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollIntoView({behavior, block})
      })
    })
  }, [behavior, block])

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    if (typeof container.scrollTo === 'function') {
      container.scrollTo({top: container.scrollHeight, behavior})
    } else {
      container.scrollTop = container.scrollHeight
    }
  }, [behavior])

  const isScrolledToBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      return true
    }

    const threshold = 50 // pixels from bottom to consider "at bottom"
    const {scrollTop, scrollHeight, clientHeight} = container
    return scrollHeight - scrollTop - clientHeight < threshold
  }, [])

  return {
    containerRef,
    anchorRef,
    scrollToAnchor,
    scrollToBottom,
    isScrolledToBottom,
  }
}

export default useScrollAnchor
