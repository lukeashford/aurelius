import React from 'react'
import {type Step, Stepper, type StepStatus} from '@lukeashford/aurelius'

const steps: Step[] = [
  {id: 1, label: 'Account'},
  {id: 2, label: 'Profile'},
  {id: 3, label: 'Preferences'},
  {id: 4, label: 'Review'},
]

export default function StepperSection() {
  const [currentStep, setCurrentStep] = React.useState<number>(2)
  const [status, setStatus] = React.useState<StepStatus | undefined>(undefined)

  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Stepper</h2>
          <p className="text-silver">Step indicators for multi-step processes and workflows.</p>
        </header>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Interactive Example</h3>
            <div className="space-y-4">
              <Stepper steps={steps} currentStep={currentStep} status={status}/>
              <div className="flex gap-3">
                <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="px-4 py-2 bg-charcoal border border-ash text-white rounded-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ash/20 transition-colors"
                >
                  Previous
                </button>
                <button
                    onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                    disabled={currentStep === 4}
                    className="px-4 py-2 bg-gold text-obsidian rounded-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-bright transition-colors"
                >
                  Next
                </button>
                <button
                    onClick={() => setStatus(status === 'error' ? undefined : 'error')}
                    className="px-4 py-2 bg-charcoal border border-ash text-white rounded-none hover:bg-ash/20 transition-colors"
                >
                  Toggle Error
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">States</h3>
            <div className="space-y-6">
              <div>
                <p className="text-silver text-sm mb-2">First step</p>
                <Stepper steps={steps} currentStep={1}/>
              </div>
              <div>
                <p className="text-silver text-sm mb-2">Middle step</p>
                <Stepper steps={steps} currentStep={3}/>
              </div>
              <div>
                <p className="text-silver text-sm mb-2">Last step</p>
                <Stepper steps={steps} currentStep={4}/>
              </div>
              <div>
                <p className="text-silver text-sm mb-2">Error state</p>
                <Stepper steps={steps} currentStep={2} status="error"/>
              </div>
              <div>
                <p className="text-silver text-sm mb-2">Complete state</p>
                <Stepper steps={steps} currentStep={2} status="complete"/>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
