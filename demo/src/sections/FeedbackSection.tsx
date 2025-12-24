import React from 'react'
import {
  Alert,
  Card,
  Skeleton,
  Spinner,
  Progress,
  Button,
  ToastProvider,
  useToast,
} from '@lukeashford/aurelius'
import Section from './Section'

function ToastDemo() {
  const { toast } = useToast()

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="sm"
        variant="outlined"
        onClick={() => toast({ variant: 'success', title: 'Changes saved successfully!' })}
      >
        Success Toast
      </Button>
      <Button
        size="sm"
        variant="outlined"
        onClick={() => toast({ variant: 'error', title: 'Something went wrong. Please try again.' })}
      >
        Error Toast
      </Button>
      <Button
        size="sm"
        variant="outlined"
        onClick={() => toast({ variant: 'warning', title: 'Please review your settings.' })}
      >
        Warning Toast
      </Button>
      <Button
        size="sm"
        variant="outlined"
        onClick={() => toast({ variant: 'info', title: 'New update available.' })}
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
            <ToastDemo />
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
                <Progress value={45} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-silver">Complete</span>
                  <span className="text-gold">100%</span>
                </div>
                <Progress value={100} />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-silver">Indeterminate</span>
                <Progress indeterminate />
              </div>
            </div>
          </Card>

          {/* Spinners */}
          <Card className="p-6 space-y-4">
            <h3 className="text-gold font-medium">Spinners</h3>
            <div className="flex items-center gap-8">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </Card>

          {/* Skeletons */}
          <Card className="p-6 space-y-4">
            <h3 className="text-gold font-medium">Skeleton</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        </div>
      </Section>
    </ToastProvider>
  )
}
