import React, {useState} from 'react'
import {ChatInput, Input} from '@lukeashford/aurelius'
import Section from './Section'

export default function InputsSection() {
  const [warningVisible, setWarningVisible] = useState(true)
  const [inputValue, setInputValue] = useState('')

  return (
      <Section
          title="Inputs"
          subtitle="Text field states: default, invalid, disabled. Icons supported."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm text-silver">Default</label>
            <Input placeholder="Enter your email"/>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-silver">With Icons</label>
            <Input
                placeholder="Search..."
                leadingIcon={<span>🔎</span>}
                trailingIcon={<span className="text-silver">⌘K</span>}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-silver">Invalid</label>
            <Input placeholder="Invalid value" error/>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-silver">Disabled</label>
            <Input placeholder="Disabled input" disabled/>
          </div>
        </div>

        <div className="mt-10 space-y-8">
          <div className="space-y-2">
            <label className="block text-sm text-silver">Warning notice (dismissible)</label>
            <ChatInput
                notice={warningVisible ? {
                  variant: 'warning',
                  content: "You've used 70% of your credits.",
                  dismissible: true,
                  onDismiss: () => setWarningVisible(false),
                } : undefined}
                onInputChange={setInputValue}
                placeholder="Send a message..."
            />
            {!warningVisible && (
                <button
                    className="text-xs text-silver/50 hover:text-silver transition-colors"
                    onClick={() => setWarningVisible(true)}
                >
                  Reset warning
                </button>
            )}
            {inputValue && (
                <p className="text-xs text-silver/50">onChange: "{inputValue}"</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-silver">Error notice (credits exhausted, input disabled)</label>
            <ChatInput
                disabled
                notice={{
                  variant: 'error',
                  content: (
                      <span className="flex items-center gap-3">
                        You've run out of credits.
                        <button
                            className="underline underline-offset-2 font-medium hover:no-underline transition-all"
                            onClick={() => alert('Upgrade clicked')}
                        >
                          Upgrade plan
                        </button>
                      </span>
                  ),
                }}
                placeholder="Send a message..."
            />
          </div>
        </div>
      </Section>
  )
}
