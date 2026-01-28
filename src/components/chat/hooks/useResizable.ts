import {useCallback, useEffect, useRef, useState} from 'react'

interface UseResizableProps {
  /**
   * Initial width as percentage of viewport (0-100)
   */
  initialWidthPercent: number
  /**
   * Minimum width as percentage of viewport (0-100)
   */
  minWidthPercent: number
  /**
   * Maximum width as percentage of viewport (0-100)
   */
  maxWidthPercent: number
  /**
   * Direction to resize from
   */
  direction: 'left' | 'right'
}

/**
 * Hook for resizable panels with percentage-based widths.
 * Returns width as a CSS percentage string (e.g., "50%").
 */
export function useResizable({
  initialWidthPercent,
  minWidthPercent,
  maxWidthPercent,
  direction,
}: UseResizableProps) {
  const [widthPercent, setWidthPercent] = useState(initialWidthPercent)
  const [isResizing, setIsResizing] = useState(false)
  const lastX = useRef<number | null>(null)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    lastX.current = e.clientX
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
    lastX.current = null
  }, [])

  const resize = useCallback(
      (e: MouseEvent) => {
        if (!isResizing || lastX.current === null) {
          return
        }

        const deltaX = e.clientX - lastX.current
        const factor = direction === 'right' ? 1 : -1
        // Convert pixel delta to percentage of viewport
        const deltaPercent = (deltaX / window.innerWidth) * 100

        setWidthPercent((prevPercent) => {
          const newPercent = prevPercent + deltaPercent * factor
          return Math.min(Math.max(newPercent, minWidthPercent), maxWidthPercent)
        })

        lastX.current = e.clientX
      },
      [isResizing, direction, minWidthPercent, maxWidthPercent]
  )

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResizing)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, resize, stopResizing])

  // Return width as CSS percentage string
  const width = `${widthPercent}vw`

  return {width, widthPercent, isResizing, startResizing}
}
