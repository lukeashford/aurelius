import React, {useCallback, useEffect, useRef, useState} from 'react'
import {cx} from '../../utils'

export interface ToolPanelContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Content for the top tool slot (from the top group).
   * When null, the bottom slot takes full height.
   */
  topContent: React.ReactNode | null
  /**
   * Content for the bottom tool slot (from the bottom group).
   * When null, the top slot takes full height.
   */
  bottomContent: React.ReactNode | null
  /**
   * Panel width as CSS value (e.g., "50vw")
   */
  width?: string
  /**
   * Default top panel height percentage (0-100).
   * @default 60
   */
  initialTopPercent?: number
  /**
   * Callback to start horizontal resizing (width dragger)
   */
  onResizeStart?: (e: React.MouseEvent) => void
  /**
   * Which side this panel is on — controls border and resize handle position
   */
  side?: 'left' | 'right'
}

/**
 * ToolPanelContainer manages the layout of one or two tool panels
 * stacked vertically. When both top and bottom slots are filled, a
 * height-adjustable divider appears between them.
 *
 * It also renders the width-resize handle on its left edge, identical
 * to the previous ArtifactsPanel resize behavior.
 */
export const ToolPanelContainer = React.forwardRef<HTMLDivElement, ToolPanelContainerProps>(
    ({
          topContent,
          bottomContent,
          width,
          onResizeStart,
          side = 'right',
          className,
          initialTopPercent = 60,
          ...rest
        },
        ref) => {
      const [topPercent, setTopPercent] = useState(initialTopPercent)
      const [isResizingHeight, setIsResizingHeight] = useState(false)
      const containerRef = useRef<HTMLDivElement>(null)
      const lastY = useRef<number | null>(null)

      const hasBoth = topContent !== null && bottomContent !== null

      // Height dragger handlers
      const startHeightResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizingHeight(true)
        lastY.current = e.clientY
      }, [])

      const stopHeightResize = useCallback(() => {
        setIsResizingHeight(false)
        lastY.current = null
      }, [])

      const resizeHeight = useCallback(
          (e: MouseEvent) => {
            if (!isResizingHeight || lastY.current === null || !containerRef.current) {
              return
            }

            const containerHeight = containerRef.current.getBoundingClientRect().height
            if (containerHeight === 0) {
              return
            }

            const deltaY = e.clientY - lastY.current
            const deltaPercent = (deltaY / containerHeight) * 100

            setTopPercent(prev => {
              const next = prev + deltaPercent
              return Math.min(Math.max(next, 20), 80)
            })

            lastY.current = e.clientY
          },
          [isResizingHeight]
      )

      useEffect(() => {
        if (isResizingHeight) {
          window.addEventListener('mousemove', resizeHeight)
          window.addEventListener('mouseup', stopHeightResize)
          document.body.style.cursor = 'row-resize'
          document.body.style.userSelect = 'none'
        } else {
          window.removeEventListener('mousemove', resizeHeight)
          window.removeEventListener('mouseup', stopHeightResize)
          document.body.style.cursor = ''
          document.body.style.userSelect = ''
        }

        return () => {
          window.removeEventListener('mousemove', resizeHeight)
          window.removeEventListener('mouseup', stopHeightResize)
          document.body.style.cursor = ''
          document.body.style.userSelect = ''
        }
      }, [isResizingHeight, resizeHeight, stopHeightResize])

      return (
          <div
              ref={(node) => {
                // Merge forwarded ref and internal ref
                (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
                if (typeof ref === 'function') {
                  ref(node)
                } else if (ref) {
                  (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
                }
              }}
              className={cx(
                  'h-full bg-charcoal/50 flex flex-col relative shrink-0',
                  side === 'left' ? 'border-r border-ash/40' : 'border-l border-ash/40',
                  className
              )}
              style={width ? {width} : undefined}
              {...rest}
          >
            {/* Width resize handle */}
            <div
                onMouseDown={onResizeStart}
                className={cx(
                    'absolute top-0 w-1 h-full cursor-col-resize z-30',
                    'hover:bg-gold/50 transition-colors',
                    side === 'left'
                        ? 'right-0 after:absolute after:inset-y-0 after:-right-1 after:w-2'
                        : 'left-0 after:absolute after:inset-y-0 after:-left-1 after:w-2'
                )}
            />

            {/* Top slot */}
            {topContent !== null && (
                <div
                    className="min-h-0 overflow-hidden flex flex-col"
                    style={hasBoth ? {height: `${topPercent}%`} : {flex: '1 1 0%'}}
                >
                  {topContent}
                </div>
            )}

            {/* Height dragger — only when both slots are filled */}
            {hasBoth && (
                <div
                    onMouseDown={startHeightResize}
                    className={cx(
                        'h-1 cursor-row-resize z-30 shrink-0',
                        'bg-ash/40 hover:bg-gold/50 transition-colors',
                        'relative',
                        'after:absolute after:-top-1 after:left-0 after:right-0 after:h-3'
                    )}
                />
            )}

            {/* Bottom slot */}
            {bottomContent !== null && (
                <div
                    className="min-h-0 overflow-hidden flex flex-col"
                    style={hasBoth ? {height: `${100 - topPercent}%`} : {flex: '1 1 0%'}}
                >
                  {bottomContent}
                </div>
            )}
          </div>
      )
    }
)

ToolPanelContainer.displayName = 'ToolPanelContainer'
