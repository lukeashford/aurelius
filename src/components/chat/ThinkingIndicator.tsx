import React, {useEffect, useState} from 'react'
import {cx} from '../../utils/cx'

const THINKING_PHRASES = [
  'Consulting the ancient tomes...',
  'Parsing the ineffable...',
  'Traversing the manifold of possibilities...',
  'Genuflecting before the oracle...',
  'Distilling quintessence...',
  'Communing with the machine spirits...',
  'Unfolding higher dimensions...',
  'Perturbing the probability matrix...',
  'Invoking the categorical imperative...',
  'Reticulating splines...',
  'Brewing a fresh batch of tokens...',
  'Consulting my inner monologue...',
  'Summoning the muse...',
]

export interface ThinkingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the indicator is visible/active
   */
  isVisible?: boolean
  /**
   * Interval between phrase changes in ms
   * @default 2500
   */
  phraseInterval?: number
  /**
   * Custom phrases to cycle through (defaults to built-in phrases)
   */
  phrases?: string[]
}

/**
 * ThinkingIndicator shows an animated state when the assistant is processing a request
 * but has not yet started streaming tokens. It cycles through flavorful "thinking" phrases.
 */
export const ThinkingIndicator = React.forwardRef<HTMLDivElement, ThinkingIndicatorProps>(
    (
        {
          isVisible = true,
          phraseInterval = 2500,
          phrases = THINKING_PHRASES,
          className,
          ...rest
        },
        ref
    ) => {
      // Start at a random phrase each time
      const [currentIndex, setCurrentIndex] = useState(
          () => Math.floor(Math.random() * phrases.length))
      const [isTransitioning, setIsTransitioning] = useState(false)

      useEffect(() => {
        if (!isVisible || phrases.length <= 1) {
          return
        }

        const interval = setInterval(() => {
          setIsTransitioning(true)

          // Wait for fade out, then change phrase
          setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % phrases.length)
            setIsTransitioning(false)
          }, 200)
        }, phraseInterval)

        return () => clearInterval(interval)
      }, [isVisible, phrases.length, phraseInterval])

      if (!isVisible) {
        return null
      }

      return (
          <div
              ref={ref}
              className={cx(
                  'flex items-center gap-2 px-3 py-2 w-fit',
                  'bg-charcoal border border-ash text-silver',
                  'mr-auto',
                  className
              )}
              role="status"
              aria-live="polite"
              {...rest}
          >
            {/* Animated dots */}
            <div className="flex gap-1" aria-hidden="true">
              <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-pulse"
                    style={{animationDelay: '0ms'}}/>
              <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-pulse"
                    style={{animationDelay: '150ms'}}/>
              <span className="w-1.5 h-1.5 bg-gold/60 rounded-full animate-pulse"
                    style={{animationDelay: '300ms'}}/>
            </div>

            {/* Phrase with fade transition */}
            <span
                className={cx(
                    'text-sm italic transition-opacity duration-200',
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                )}
            >
          {phrases[currentIndex]}
        </span>
          </div>
      )
    }
)

ThinkingIndicator.displayName = 'ThinkingIndicator'

export default ThinkingIndicator
