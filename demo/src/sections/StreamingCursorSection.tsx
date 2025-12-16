import React from 'react'
import {StreamingCursor} from '@lukeashford/aurelius'

export default function StreamingCursorSection() {
  const [text, setText] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)
  const fullText = 'This is an example of streaming text with a cursor animation...'

  const startStreaming = () => {
    setText('')
    setIsStreaming(true)
    let index = 0

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1))
        index++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 50)
  }

  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Streaming Cursor</h2>
          <p className="text-silver">Animated cursor for streaming text and real-time content.</p>
        </header>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Usage</h3>
            <div className="bg-charcoal border border-ash p-4 rounded-none">
              <p className="text-white">
                Typing text<StreamingCursor/>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
            <div className="space-y-4">
              <div className="bg-charcoal border border-ash p-4 rounded-none min-h-[100px]">
                <p className="text-white">
                  {text}
                  {isStreaming && <StreamingCursor/>}
                </p>
              </div>
              <button
                  onClick={startStreaming}
                  disabled={isStreaming}
                  className="px-4 py-2 bg-gold text-obsidian rounded-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-bright transition-colors"
              >
                {isStreaming ? 'Streaming...' : 'Start Streaming'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">In Context</h3>
            <div className="bg-charcoal border border-ash p-4 rounded-none space-y-3">
              <p className="text-silver text-sm">Assistant is typing...</p>
              <p className="text-white">
                The streaming cursor is perfect for AI chat interfaces where responses are generated
                in real-time. It provides visual feedback that content is being actively
                generated<StreamingCursor/>
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}
