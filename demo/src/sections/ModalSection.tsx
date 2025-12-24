import React, { useState } from 'react'
import {
  Button,
  Card,
  Modal,
  Drawer,
  Popover,
  ConfirmDialog,
  AlertDialog,
  PromptDialog,
  Input,
} from '@lukeashford/aurelius'
import { Info, HelpCircle } from 'lucide-react'
import Section from './Section'

export default function ModalSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerPosition, setDrawerPosition] = useState<'left' | 'right'>('right')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [promptValue, setPromptValue] = useState('')

  const openDrawer = (position: 'left' | 'right') => {
    setDrawerPosition(position)
    setIsDrawerOpen(true)
  }

  return (
    <Section
      className="space-y-8"
      title="Overlays"
      subtitle="Components that overlay the main content."
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Modal */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Modal</h3>
          <p className="text-sm text-silver">
            Modals are used for critical information or focused tasks.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
          >
            <div className="space-y-4">
              <p className="text-silver">
                This modal overlays the page content and focuses the user's
                attention.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  Confirm
                </Button>
              </div>
            </div>
          </Modal>
        </Card>

        {/* Drawer */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Drawer</h3>
          <p className="text-sm text-silver">
            Slide-out panels from edges of the screen.
          </p>
          <div className="flex gap-3">
            <Button size="sm" onClick={() => openDrawer('left')}>
              Open Left
            </Button>
            <Button size="sm" onClick={() => openDrawer('right')}>
              Open Right
            </Button>
          </div>
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            position={drawerPosition}
            title="Drawer Panel"
          >
            <div className="space-y-4">
              <p className="text-silver">
                Drawers slide in from the edge of the screen. Great for
                navigation, filters, or settings.
              </p>
              <div className="space-y-3">
                <Input placeholder="Search..." />
                <div className="h-32 bg-graphite flex items-center justify-center text-sm text-zinc">
                  Drawer content area
                </div>
              </div>
            </div>
          </Drawer>
        </Card>

        {/* Popover */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Popover</h3>
          <p className="text-sm text-silver">
            Rich content tooltips with click trigger.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Popover
              trigger={
                <Button size="sm" variant="outlined">
                  <Info className="h-4 w-4 mr-2" />
                  More Info
                </Button>
              }
            >
              <div className="space-y-2">
                <h4 className="font-medium text-gold">Information</h4>
                <p className="text-sm text-silver">
                  This is a popover with rich content. It can contain any React
                  elements.
                </p>
              </div>
            </Popover>
            <Popover
              trigger={
                <Button size="sm" variant="ghost">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              }
              position="top"
            >
              <p className="text-sm text-silver">
                Hover over elements for more help.
              </p>
            </Popover>
          </div>
        </Card>

        {/* Dialog Variants */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Dialog Variants</h3>
          <p className="text-sm text-silver">
            Pre-built dialog patterns for common use cases.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" onClick={() => setIsConfirmOpen(true)}>
              Confirm
            </Button>
            <Button size="sm" onClick={() => setIsAlertOpen(true)}>
              Alert
            </Button>
            <Button size="sm" onClick={() => setIsPromptOpen(true)}>
              Prompt
            </Button>
          </div>

          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => {
              setIsConfirmOpen(false)
            }}
            title="Confirm Action"
            description="Are you sure you want to proceed? This action cannot be undone."
            confirmText="Yes, Proceed"
            cancelText="Cancel"
          />

          <AlertDialog
            isOpen={isAlertOpen}
            onClose={() => setIsAlertOpen(false)}
            title="Notice"
            description="Your session will expire in 5 minutes. Please save your work."
          />

          <PromptDialog
            isOpen={isPromptOpen}
            onClose={() => setIsPromptOpen(false)}
            onSubmit={(value) => {
              setPromptValue(value)
              setIsPromptOpen(false)
            }}
            title="Enter Name"
            description="Please enter a name for the new item."
            placeholder="Item name..."
          />
          {promptValue && (
            <p className="text-sm text-silver mt-2">
              Last entered: <span className="text-gold">{promptValue}</span>
            </p>
          )}
        </Card>
      </div>
    </Section>
  )
}
