import React, { useState } from 'react'
import { Button, Card, Modal } from '@lukeashford/aurelius-design'

export default function ModalSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-8">
      <header className="section-header">
        <h2 className="text-2xl">Overlays</h2>
        <p className="text-silver">Components that overlay the main content.</p>
      </header>

      <Card className="p-8 flex flex-col items-center justify-center gap-4">
        <h3 className="text-gold font-medium">Modal Dialog</h3>
        <p className="text-silver text-center max-w-md">
          Modals are used for critical information or focused tasks that require user attention.
        </p>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example Modal">
          <div className="space-y-4">
            <p className="text-silver">
              This is an example of the modal component. It overlays the page content and focuses the user's attention.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setIsOpen(false)}>Confirm</Button>
            </div>
          </div>
        </Modal>
      </Card>
    </div>
  )
}
