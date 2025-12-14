import React from 'react'
import {Alert, Card, Skeleton, Spinner} from '@lukeashford/aurelius'

export default function FeedbackSection() {
  return (
      <div className="space-y-8">
        <header className="section-header">
          <h2 className="text-2xl">Feedback & States</h2>
          <p className="text-silver">Visual indicators for system status and loading states.</p>
        </header>

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
        </div>
      </div>
  )
}
