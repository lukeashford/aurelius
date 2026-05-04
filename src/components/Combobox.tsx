import React, {useCallback, useEffect, useRef, useState} from 'react'
import {cx} from '../utils'

export interface ComboboxProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Items to display in the panel. The caller is responsible for filtering before passing.
   */
  items: T[]
  /**
   * Index of the currently highlighted (focused, not yet picked) item. Drive this from
   * `useComboboxNav` for the standard arrow-key behaviour, or manage it yourself.
   */
  selectedIndex: number
  /**
   * Render one row. `isSelected` reflects the keyboard highlight; click and hover styling
   * are applied by the panel.
   */
  renderItem: (item: T, isSelected: boolean) => React.ReactNode
  /**
   * Called when the user clicks a row. Use the same handler you call from the keyboard's
   * Enter key to keep mouse and keyboard paths consistent.
   */
  onSelectItem: (item: T) => void
  /**
   * Stable key per item. Required because the panel re-mounts rows when `items` changes.
   */
  getItemKey: (item: T) => string
  /**
   * Optional node rendered when `items` is empty. Skip the panel entirely if you'd rather
   * hide it on no-match.
   */
  emptyState?: React.ReactNode
  /**
   * Maximum pixel height of the scrollable list. The panel itself sizes to its content
   * up to this cap; rows beyond it scroll within the panel.
   * @default 256
   */
  maxHeight?: number
}

/**
 * Floating panel for inline autocompletes — `@`-mention pickers, slash-command menus, and
 * the like. The panel is unstyled-positioned (`absolute`) so the caller controls placement
 * via wrapper, `style`, or by mounting it inside their own positioned container; this keeps
 * the component agnostic to how the trigger position is computed (caret coordinates, ref
 * rect, popover anchor).
 *
 * Pair with `useComboboxNav` for the standard arrow-key + Enter/Escape behaviour.
 */
export function Combobox<T>(
    {items, selectedIndex, renderItem, onSelectItem, getItemKey, emptyState,
      maxHeight = 256, className, ...rest}:
        ComboboxProps<T>,
) {
  const listRef = useRef<HTMLUListElement>(null)

  // Keep the highlighted row scrolled into view when the user navigates past
  // the visible range with the keyboard.
  useEffect(() => {
    const list = listRef.current
    if (!list) {
      return
    }
    const selectedNode = list.children.item(selectedIndex) as HTMLElement | null
    selectedNode?.scrollIntoView({block: 'nearest'})
  }, [selectedIndex])

  if (items.length === 0 && !emptyState) {
    return null
  }

  return (
      <div
          {...rest}
          role="listbox"
          className={cx(
              'absolute z-50 min-w-48 max-w-sm',
              'bg-charcoal border border-ash shadow-lg',
              'animate-fade-in',
              className
          )}
      >
        {items.length === 0 ? (
            <div className="px-3 py-2 text-sm text-silver/60">{emptyState}</div>
        ) : (
            <ul ref={listRef}
                style={{maxHeight}}
                className="list-none m-0 p-0 overflow-y-auto">
              {items.map((item, i) => {
                const isSelected = i === selectedIndex
                return (
                    <li
                        key={getItemKey(item)}
                        role="option"
                        aria-selected={isSelected}
                        onMouseDown={(e) => {
                          // Prevent the input from losing focus on mouse-down so the
                          // pick-and-insert flow keeps the textarea active.
                          e.preventDefault()
                          onSelectItem(item)
                        }}
                        className={cx(
                            'cursor-pointer',
                            isSelected ? 'bg-gold/10' : 'hover:bg-graphite'
                        )}
                    >
                      {renderItem(item, isSelected)}
                    </li>
                )
              })}
            </ul>
        )}
      </div>
  )
}

/**
 * Result of `useComboboxNav`. Forward `handleKeyDown` from the input element that owns focus
 * (typically a textarea); it returns true when it consumed the event so the caller knows to
 * skip its own handling.
 */
export interface ComboboxNav {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  /**
   * Standard handler for ArrowUp / ArrowDown / Enter / Escape. Returns true when a key was
   * consumed — the caller should skip its own handling for those events.
   */
  handleKeyDown: (e: React.KeyboardEvent) => boolean
}

export interface UseComboboxNavOptions<T> {
  items: T[]
  /**
   * Called when the user presses Enter on the highlighted item.
   */
  onSelect: (item: T) => void
  /**
   * Called when the user presses Escape.
   */
  onDismiss: () => void
}

/**
 * Standard keyboard nav for an inline autocomplete: ArrowUp / ArrowDown wrap through items,
 * Enter selects the highlighted item, Escape dismisses. Resets the highlight to 0 whenever
 * the items array changes (reference equality), so a fresh filter result starts at the top.
 */
export function useComboboxNav<T>(
    {items, onSelect, onDismiss}: UseComboboxNavOptions<T>): ComboboxNav {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Reset on length change rather than reference change — consumers commonly produce a
  // fresh `items` array each render (e.g. an inline filter), and resetting on every render
  // would clobber arrow-key navigation. Length is the load-bearing signal: a typed
  // character changes the filter length and the user expects to start from the top.
  useEffect(() => {
    setSelectedIndex(0)
  }, [items.length])

  const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (items.length === 0) {
          if (e.key === 'Escape') {
            e.preventDefault()
            onDismiss()
            return true
          }
          return false
        }

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setSelectedIndex((i) => (i + 1) % items.length)
            return true
          case 'ArrowUp':
            e.preventDefault()
            setSelectedIndex((i) => (i - 1 + items.length) % items.length)
            return true
          case 'Enter':
          case 'Tab':
            e.preventDefault()
            onSelect(items[selectedIndex])
            return true
          case 'Escape':
            e.preventDefault()
            onDismiss()
            return true
          default:
            return false
        }
      },
      [items, onSelect, onDismiss, selectedIndex]
  )

  return {selectedIndex, setSelectedIndex, handleKeyDown}
}
