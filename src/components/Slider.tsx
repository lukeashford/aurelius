import React, { useState, useRef, useCallback } from 'react'
import { cx } from '../utils/cx'

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current value */
  value?: number
  /** Default value for uncontrolled mode */
  defaultValue?: number
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Callback when value changes */
  onChange?: (value: number) => void
  /** Callback when dragging ends */
  onChangeEnd?: (value: number) => void
  /** Whether the slider is disabled */
  disabled?: boolean
  /** Show value tooltip while dragging */
  showTooltip?: boolean
  /** Format the displayed value */
  formatValue?: (value: number) => string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_TRACK: Record<string, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

const SIZE_THUMB: Record<string, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      onChangeEnd,
      disabled = false,
      showTooltip = false,
      formatValue = (v) => String(v),
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue)
    const [isDragging, setIsDragging] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const percentage = ((value - min) / (max - min)) * 100

    const updateValue = useCallback(
      (clientX: number) => {
        if (!trackRef.current || disabled) return

        const rect = trackRef.current.getBoundingClientRect()
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const rawValue = min + percent * (max - min)
        const steppedValue = Math.round(rawValue / step) * step
        const clampedValue = Math.max(min, Math.min(max, steppedValue))

        if (!isControlled) {
          setInternalValue(clampedValue)
        }
        onChange?.(clampedValue)
      },
      [min, max, step, disabled, isControlled, onChange]
    )

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return
      setIsDragging(true)
      updateValue(e.clientX)

      const handleMouseMove = (e: MouseEvent) => {
        updateValue(e.clientX)
      }

      const handleMouseUp = (e: MouseEvent) => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)

        if (trackRef.current) {
          const rect = trackRef.current.getBoundingClientRect()
          const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
          const rawValue = min + percent * (max - min)
          const steppedValue = Math.round(rawValue / step) * step
          const clampedValue = Math.max(min, Math.min(max, steppedValue))
          onChangeEnd?.(clampedValue)
        }
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return

      let newValue = value
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(max, value + step)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(min, value - step)
          break
        case 'Home':
          newValue = min
          break
        case 'End':
          newValue = max
          break
        default:
          return
      }

      e.preventDefault()
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
      onChangeEnd?.(newValue)
    }

    return (
      <div
        ref={ref}
        className={cx('relative w-full py-2', disabled && 'opacity-50', className)}
        {...props}
      >
        <div
          ref={trackRef}
          className={cx(
            'relative w-full bg-charcoal border border-ash cursor-pointer',
            SIZE_TRACK[size]
          )}
          onMouseDown={handleMouseDown}
        >
          {/* Filled track */}
          <div
            className={cx('absolute inset-y-0 left-0 bg-gold', SIZE_TRACK[size])}
            style={{ width: `${percentage}%` }}
          />

          {/* Thumb */}
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-disabled={disabled}
            onKeyDown={handleKeyDown}
            className={cx(
              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
              'bg-gold border-2 border-gold-light rounded-full',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian',
              'transition-transform duration-fast',
              isDragging && 'scale-110',
              !disabled && 'cursor-grab active:cursor-grabbing',
              SIZE_THUMB[size]
            )}
            style={{ left: `${percentage}%` }}
          >
            {/* Tooltip */}
            {showTooltip && isDragging && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-graphite border border-ash text-xs text-white whitespace-nowrap">
                {formatValue(value)}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'
