import React, {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {X} from 'lucide-react'
import {cx, useEscapeKey, useScrollLock} from '../utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export const Modal = ({isOpen, onClose, title, children, className}: ModalProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useScrollLock(isOpen)
  useEscapeKey(onClose, isOpen)

  if (!mounted || !isOpen) {
    return null
  }

  const content = (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
           onClick={onClose}>
        <div className="fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm" aria-hidden="true"/>
        <div
            role="dialog"
            aria-modal="true"
            className={cx(
                'bg-charcoal border border-gold/30 shadow-2xl z-50 w-full max-w-lg p-6 rounded-none relative flex flex-col',
                className
            )}
            data-state="open"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            {title ? <h3 className="text-xl font-semibold text-white m-0">{title}</h3> : <div/>}
            <button onClick={onClose}
                    className="text-silver hover:text-white transition-colors ml-auto">
              <X className="h-5 w-5"/>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="overflow-y-auto min-h-0">{children}</div>
        </div>
      </div>
  )

  return createPortal(content, document.body)
}

Modal.displayName = 'Modal'

export default Modal
