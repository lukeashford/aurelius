import React from 'react'
import {StreamingCursor} from '@lukeashford/aurelius'
import Section from './Section'

const variants = ['line', 'block', 'underscore'] as const
const fullText = 'The streaming cursor provides visual feedback during real-time text generation...'

export default function StreamingCursorSection() {
  const [text, setText] = React.useState('')
  const [variantIndex, setVariantIndex] = React.useState(0)

  React.useEffect(() => {
    let charIndex = 0
    let timeout: ReturnType<typeof setTimeout>

    const typeNextChar = () => {
      if (charIndex < fullText.length) {
        setText(fullText.slice(0, charIndex + 1))
        charIndex++
        timeout = setTimeout(typeNextChar, 40)
      } else {
        // Pause at end, then reset with next variant
        timeout = setTimeout(() => {
          setText('')
          charIndex = 0
          setVariantIndex((i) => (i + 1) % variants.length)
          timeout = setTimeout(typeNextChar, 500)
        }, 2000)
      }
    }

    timeout = setTimeout(typeNextChar, 500)
    return () => clearTimeout(timeout)
  }, [variantIndex])

  const currentVariant = variants[variantIndex]

  return (
      <Section
          title="Streaming Cursor"
          subtitle="Animated cursor for streaming text and real-time content."
      >
        <div className="bg-charcoal border border-ash p-6 rounded-none">
          <p className="text-silver text-sm mb-3">
            variant="{currentVariant}"
          </p>
          <p className="text-white text-lg">
            {text}
            <StreamingCursor variant={currentVariant}/>
          </p>
        </div>
      </Section>
  )
}