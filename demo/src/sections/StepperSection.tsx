import React from 'react'
import {type Step, Stepper, type StepStatus} from '@lukeashford/aurelius'
import Section from './Section'

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
      <Section
          title="Stepper"
          subtitle="Step indicators for multi-step processes and workflows."
      >
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
        </div>
      </Section>
  )
}
