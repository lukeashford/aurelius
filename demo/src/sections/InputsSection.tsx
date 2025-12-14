import React from 'react'
import {Input} from '@lukeashford/aurelius'

export default function InputsSection() {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Inputs</h2>
          <p className="text-silver">Text field states: default, invalid, disabled. Icons
            supported.</p>
        </header>

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
      </div>
  )
}
