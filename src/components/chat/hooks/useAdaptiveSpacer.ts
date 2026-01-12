import {useCallback, useEffect, useRef, useState} from 'react'

export interface UseAdaptiveSpacerOptions {
  /**
   * Minimum spacer height. Defaults to 0.
   */
  minHeight?: number
  /**
   * External container ref to use instead of creating one internally.
   * Useful when sharing the container ref with other hooks (e.g., useScrollAnchor).
   */
  containerRef?: React.RefObject<HTMLDivElement | null>
}

export interface UseAdaptiveSpacerReturn {
  /**
   * Ref to attach to the scrollable container (only use if not providing external ref)
   */
  containerRef: React.RefObject<HTMLDivElement | null>
  /**
   * Ref to attach to the content wrapper (excludes spacer)
   */
  contentRef: React.RefObject<HTMLDivElement | null>
  /**
   * Calculated spacer height in pixels
   */
  spacerHeight: number
  /**
   * Force recalculation of spacer height
   */
  recalculate: () => void
}

/**
 * Hook that calculates the exact spacer height needed to fill remaining viewport space.
 *
 * The spacer height is calculated as:
 * spacerHeight = max(minHeight, containerHeight - contentHeight)
 *
 * This ensures:
 * - When content is small, spacer fills the remaining space (no scrollbar)
 * - As content grows, spacer shrinks
 * - When content exceeds container, spacer becomes minHeight (usually 0)
 */
export function useAdaptiveSpacer(
  options: UseAdaptiveSpacerOptions = {}
): UseAdaptiveSpacerReturn {
  const {minHeight = 0, containerRef: externalContainerRef} = options

  const internalContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = externalContainerRef ?? internalContainerRef
  const contentRef = useRef<HTMLDivElement>(null)
  const [spacerHeight, setSpacerHeight] = useState(0)

  const recalculate = useCallback(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const containerHeight = container.clientHeight
    const contentHeight = content.scrollHeight

    const newSpacerHeight = Math.max(minHeight, containerHeight - contentHeight)
    setSpacerHeight(newSpacerHeight)
  }, [minHeight])

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    // Initial calculation
    recalculate()

    // Observe both container and content for size changes
    const resizeObserver = new ResizeObserver(() => {
      recalculate()
    })

    resizeObserver.observe(container)
    resizeObserver.observe(content)

    // Also observe mutations in content (for DOM changes that don't trigger resize)
    const mutationObserver = new MutationObserver(() => {
      // Use requestAnimationFrame to batch with render
      requestAnimationFrame(recalculate)
    })

    mutationObserver.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [recalculate])

  return {
    containerRef,
    contentRef,
    spacerHeight,
    recalculate,
  }
}

export default useAdaptiveSpacer
