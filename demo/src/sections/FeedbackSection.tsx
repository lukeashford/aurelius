import React from 'react'
import {
  Alert,
  ArtifactsPanel,
  BusyOverlay,
  type BusyOverlayBlurStrength,
  type BusyOverlayTone,
  Button,
  Card,
  ChatInterface,
  Progress,
  Skeleton,
  Spinner,
  ToastProvider,
  useToast,
} from '@lukeashford/aurelius'
import Section from './Section'

const BUSY_OVERLAY_MATRIX: Array<{
  tone: BusyOverlayTone
  blurStrength: BusyOverlayBlurStrength
  label?: string
}> = [
  {tone: 'dim', blurStrength: 'sm'},
  {tone: 'dim', blurStrength: 'md', label: 'Loading session…'},
  {tone: 'frost', blurStrength: 'sm', label: 'Retrying'},
  {tone: 'frost', blurStrength: 'lg'},
]

function BusyOverlayDemoCard({
  tone,
  blurStrength,
  label,
}: {
  tone: BusyOverlayTone
  blurStrength: BusyOverlayBlurStrength
  label?: string
}) {
  return (
      <Card className="relative p-6 min-h-40 space-y-2">
        <h4 className="text-gold font-medium text-sm">Sample card</h4>
        <p className="text-xs text-silver leading-relaxed">
          The scene behind the overlay should remain legible at <code>tone="dim"</code>
          {' '}and recede at <code>tone="frost"</code>.
        </p>
        <p className="text-xs text-silver/70">
          tone=<span className="text-white">{tone}</span>
          {' · '}blurStrength=<span className="text-white">{blurStrength}</span>
          {label ? ' · with label' : ' · no label'}
        </p>
        <BusyOverlay tone={tone} blurStrength={blurStrength} label={label}/>
      </Card>
  )
}

function ToastDemo() {
  const {toast} = useToast()

  return (
      <div className="flex flex-wrap gap-3">
        <Button
            size="sm"
            variant="outlined"
            onClick={() => toast({variant: 'success', title: 'Changes saved successfully!'})}
        >
          Success Toast
        </Button>
        <Button
            size="sm"
            variant="outlined"
            onClick={() => toast(
                {variant: 'error', title: 'Something went wrong. Please try again.'})}
        >
          Error Toast
        </Button>
        <Button
            size="sm"
            variant="outlined"
            onClick={() => toast({variant: 'warning', title: 'Please review your settings.'})}
        >
          Warning Toast
        </Button>
        <Button
            size="sm"
            variant="outlined"
            onClick={() => toast({variant: 'info', title: 'New update available.'})}
        >
          Info Toast
        </Button>
      </div>
  )
}

export default function FeedbackSection() {
  return (
      <ToastProvider>
        <Section
            className="space-y-8"
            title="Feedback & States"
            subtitle="Visual indicators for system status and loading states."
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Alerts */}
            <Card className="p-6 space-y-4 md:col-span-2">
              <h3 className="text-gold font-medium">Alerts</h3>
              <Alert variant="info" title="Information">
                This is a standard info alert.
              </Alert>
              <Alert variant="success" title="Success">
                Your changes have been saved successfully.
              </Alert>
              <Alert variant="warning" title="Warning">
                Please review your account settings.
              </Alert>
              <Alert variant="error" title="Error">
                Something went wrong. Please try again.
              </Alert>
            </Card>

            {/* Toast */}
            <Card className="p-6 space-y-4 md:col-span-2">
              <h3 className="text-gold font-medium">Toast Notifications</h3>
              <p className="text-sm text-silver">
                Toasts provide brief, non-intrusive notifications that appear and
                auto-dismiss.
              </p>
              <ToastDemo/>
            </Card>

            {/* Progress */}
            <Card className="p-6 space-y-4 md:col-span-2">
              <h3 className="text-gold font-medium">Progress</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-silver">Uploading...</span>
                    <span className="text-gold">45%</span>
                  </div>
                  <Progress value={45}/>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-silver">Complete</span>
                    <span className="text-gold">100%</span>
                  </div>
                  <Progress value={100}/>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-silver">Indeterminate</span>
                  <Progress indeterminate/>
                </div>
              </div>
            </Card>

            {/* Spinners */}
            <Card className="p-6 space-y-4">
              <h3 className="text-gold font-medium">Spinners</h3>
              <div className="flex items-center gap-8">
                <Spinner size="sm"/>
                <Spinner size="md"/>
                <Spinner size="lg"/>
              </div>
            </Card>

            {/* Skeletons */}
            <Card className="p-6 space-y-4">
              <h3 className="text-gold font-medium">Skeleton</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full"/>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48"/>
                    <Skeleton className="h-4 w-36"/>
                  </div>
                </div>
                <Skeleton className="h-32 w-full"/>
              </div>
            </Card>

            {/* BusyOverlay matrix */}
            <Card className="p-6 space-y-4 md:col-span-2">
              <h3 className="text-gold font-medium">BusyOverlay</h3>
              <p className="text-sm text-silver">
                Mounts <code>position: absolute inset-0</code> over its positioned parent.
                Pair tone and blurStrength to communicate "this region is temporarily
                busy" vs. "this region is blocking".
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {BUSY_OVERLAY_MATRIX.map(({tone, blurStrength, label}) => (
                    <BusyOverlayDemoCard
                        key={`${tone}-${blurStrength}-${label ?? 'none'}`}
                        tone={tone}
                        blurStrength={blurStrength}
                        label={label}
                    />
                ))}
              </div>
            </Card>

            {/* ChatInterface chatLoading */}
            <Card className="p-6 space-y-4 md:col-span-2">
              <h3 className="text-gold font-medium">ChatInterface · chatLoading</h3>
              <p className="text-sm text-silver">
                Overlays the messages region with <code>BusyOverlay</code> while the
                chrome (sidebar, input, tool panels) stays mounted — the user keeps
                every other affordance through the transition.
              </p>
              <div className="h-96 border border-ash/40 overflow-hidden">
                <ChatInterface
                    messages={[]}
                    conversations={[]}
                    chatLoading
                    placeholder="Send a message..."
                />
              </div>
            </Card>

            {/* ArtifactsPanel cold-start placeholders */}
            <Card className="p-6 space-y-4 md:col-span-2">
              <h3 className="text-gold font-medium">ArtifactsPanel · cold-start loading</h3>
              <p className="text-sm text-silver">
                Pass <code>loading</code> as a boolean (e.g. via{' '}
                <code>ChatInterface.artifactsLoading</code>) and the panel renders
                placeholder cards until real artifacts arrive — instead of the bare
                "No artifacts" empty state.
              </p>
              <div className="h-96 border border-ash/40 overflow-hidden">
                <ArtifactsPanel loading nodes={[]}/>
              </div>
            </Card>
          </div>
        </Section>
      </ToastProvider>
  )
}
