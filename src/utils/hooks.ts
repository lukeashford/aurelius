import {useCallback, useEffect, useRef, useState} from 'react'
import type {Ref} from 'react'
import {copyToClipboard} from './clipboard'

/**
 * Compose multiple refs (callback or object) into a single callback ref.
 *
 * Useful when a component needs to attach an internal ref while still
 * forwarding a ref provided by its consumer.
 *
 * The return type is a plain function so it stays assignable across
 * duplicate @types/react resolutions (e.g. tests vs. source).
 */
export function composeRefs<T>(
    ...refs: Array<Ref<T> | undefined>
): (node: T | null) => void {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue
      }
      if (typeof ref === 'function') {
        ref(node)
      } else {
        // React's MutableRefObject — `current` is writable
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    }
  }
}

/**
 * Lock document scroll while `isLocked` is true. Multiple components can lock
 * concurrently — the lock is released only when every locker has released.
 *
 * Preserves and restores the original `body.overflow` and `body.paddingRight`
 * values so we don't clobber consumer styles.
 */
let scrollLockCount = 0
let scrollLockOriginalOverflow: string | null = null
let scrollLockOriginalPaddingRight: string | null = null

export function useScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') {
      return
    }

    if (scrollLockCount === 0) {
      scrollLockOriginalOverflow = document.body.style.overflow
      scrollLockOriginalPaddingRight = document.body.style.paddingRight
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }
    }
    scrollLockCount++

    return () => {
      scrollLockCount--
      if (scrollLockCount === 0) {
        document.body.style.overflow = scrollLockOriginalOverflow ?? ''
        document.body.style.paddingRight = scrollLockOriginalPaddingRight ?? ''
        scrollLockOriginalOverflow = null
        scrollLockOriginalPaddingRight = null
      }
    }
  }, [isLocked])
}

/**
 * Call `onEscape` whenever the user presses the Escape key while `isActive`
 * is true. Listens on `window`.
 */
export function useEscapeKey(onEscape: () => void, isActive = true): void {
  useEffect(() => {
    if (!isActive || typeof window === 'undefined') {
      return
    }
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEscape, isActive])
}

/**
 * Call `handler` when a `mousedown` event occurs outside of `ref`'s element.
 * Disabled when `isActive` is false.
 */
export function useClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    handler: (event: MouseEvent) => void,
    isActive = true,
): void {
  useEffect(() => {
    if (!isActive || typeof document === 'undefined') {
      return
    }
    const listener = (event: MouseEvent) => {
      const node = ref.current
      if (node && !node.contains(event.target as Node)) {
        handler(event)
      }
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler, isActive])
}

/**
 * Provides a `copy(text)` function and a transient `copied` flag that flips
 * back to false after `resetMs` (default 2000). Cleans up the timer on unmount
 * and on subsequent copies.
 */
export interface UseCopyToClipboardReturn {
  copied: boolean
  copy: (text: string) => Promise<boolean>
}

export function useCopyToClipboard(resetMs = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const copy = useCallback(async (text: string) => {
    const ok = await copyToClipboard(text)
    if (!mountedRef.current) {
      return ok
    }
    if (ok) {
      setCopied(true)
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        if (mountedRef.current) {
          setCopied(false)
        }
      }, resetMs)
    }
    return ok
  }, [resetMs])

  return {copied, copy}
}
