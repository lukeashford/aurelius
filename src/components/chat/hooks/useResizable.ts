import {useCallback, useEffect, useRef, useState} from 'react'

interface UseResizableProps {
  initialWidth: number
  minWidth: number
  maxWidth: number
  direction: 'left' | 'right'
}

export function useResizable({
  initialWidth,
  minWidth,
  maxWidth,
  direction,
}: UseResizableProps) {
  const [width, setWidth] = useState(initialWidth)
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

        setWidth((prevWidth) => {
          const newWidth = prevWidth + deltaX * factor
          return Math.min(Math.max(newWidth, minWidth), maxWidth)
        })

        lastX.current = e.clientX
      },
      [isResizing, direction, minWidth, maxWidth]
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

  return {width, isResizing, startResizing}
}
