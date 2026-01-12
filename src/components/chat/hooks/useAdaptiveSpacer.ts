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
  /**
   * Ref to the anchor element (e.g., latest user message).
   * When provided, spacer is calculated to allow anchor to scroll to top.
   */
  anchorRef?: React.RefObject<HTMLDivElement | null>
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
 * Hook that calculates the exact spacer height needed to fill remaining viewport space
 * while allowing the anchor element to scroll to the top.
 *
 * The spacer height is calculated as:
 * spacerHeight = containerHeight - padding - heightFromAnchorToBottom
 *
 * This ensures:
 * - The anchor message can scroll to the top of the viewport
 * - Below the anchor, content + spacer fills exactly the remaining space
 * - As content below anchor grows, spacer shrinks
 * - When content exceeds available space, spacer becomes 0
 */
export function useAdaptiveSpacer(
  options: UseAdaptiveSpacerOptions = {}
): UseAdaptiveSpacerReturn {
  const {minHeight = 0, containerRef: externalContainerRef, anchorRef} = options

  const internalContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = externalContainerRef ?? internalContainerRef
  const contentRef = useRef<HTMLDivElement>(null)
  const [spacerHeight, setSpacerHeight] = useState(0)

  const recalculate = useCallback(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    // Get container's computed padding
    const style = getComputedStyle(container)
    const paddingTop = parseFloat(style.paddingTop) || 0
    const paddingBottom = parseFloat(style.paddingBottom) || 0
    const availableHeight = container.clientHeight - paddingTop - paddingBottom

    // Calculate height from anchor to bottom of content
    // Using offsetTop for stable measurement from "zero" (content top)
    let heightFromAnchorToBottom: number
    const anchor = anchorRef?.current

    if (anchor && content.contains(anchor)) {
      // Anchor's position from the top of content (the "zero" point)
      // Subtract content's offsetTop to get position relative to content
      const anchorTop = anchor.offsetTop - content.offsetTop
      heightFromAnchorToBottom = content.scrollHeight - anchorTop
    } else {
      // No anchor, use total content height
      heightFromAnchorToBottom = content.scrollHeight
    }

    const newSpacerHeight = Math.max(minHeight, availableHeight - heightFromAnchorToBottom)
    setSpacerHeight(newSpacerHeight)
  }, [minHeight, anchorRef])

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
