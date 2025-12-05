import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
  }, [isOpen])

  useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
          if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!mounted) return null

  // Don't render anything if closed, unless we want exit animations. 
  // My CSS relies on data-state, but if I unmount immediately, exit animation won't play.
  // To support exit animations, I'd need a transition manager (like framer-motion or headlessui).
  // For this simple implementation, I'll render conditionally. 
  // If I want animation, I need to keep it mounted until animation ends.
  // Given the prompt "add all suggestions" and "premium", a simple unmount is acceptable for v1 without heavy deps.
  // However, the CSS I wrote has `data-state=closed`. 
  // Without a transition library, handling exit animation is tricky. 
  // I'll just conditional render for now. The entry animation `animate-fade-in` will play.
  
  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm" aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(
          'bg-charcoal border border-gold/30 shadow-2xl z-50 w-full max-w-lg p-6 rounded-none relative',
          className
        )}
        data-state="open"
        onClick={(e) => e.stopPropagation()}
      >
         <div className="flex items-center justify-between mb-2">
             {title ? <h3 className="text-xl font-semibold text-white m-0">{title}</h3> : <div />}
             <button onClick={onClose} className="text-silver hover:text-white transition-colors ml-auto">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
             </button>
         </div>
        <div>{children}</div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

Modal.displayName = 'Modal'

export default Modal
