import React from 'react'
import {Check} from 'lucide-react'

export type StepStatus = 'complete' | 'error'

export interface Step {
  id: string | number
  label: string
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  currentStep: string | number
  status?: StepStatus
}

function cx(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
    ({steps, currentStep, status, className, ...rest}, ref) => {
      const currentIndex = steps.findIndex(step => step.id === currentStep)

      const getStepState = (index: number) => {
        if (index < currentIndex) {
          return 'complete'
        }
        if (index === currentIndex) {
          return status || 'current'
        }
        return 'future'
      }

      return (
          <div
              ref={ref}
              className={cx('flex items-center w-full', className)}
              {...rest}
          >
            {steps.map((step, index) => {
              const state = getStepState(index)
              const isLast = index === steps.length - 1

              return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div
                          className={cx(
                              'flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all duration-200',
                              state === 'complete' && 'bg-gold border-gold text-obsidian',
                              state === 'current' && 'bg-charcoal border-gold text-gold',
                              state === 'error' && 'bg-error border-error text-white',
                              state === 'future' && 'bg-charcoal border-ash text-silver'
                          )}
                      >
                        {state === 'complete' ? (
                            <Check className="h-5 w-5"/>
                        ) : (
                            <span>{index + 1}</span>
                        )}
                      </div>
                      <span
                          className={cx(
                              'mt-2 text-xs font-medium',
                              state === 'complete' && 'text-gold',
                              state === 'current' && 'text-white',
                              state === 'error' && 'text-error',
                              state === 'future' && 'text-silver'
                          )}
                      >
                  {step.label}
                </span>
                    </div>
                    {!isLast && (
                        <div
                            className={cx(
                                'flex-1 h-0.5 mx-4 transition-all duration-200',
                                index < currentIndex ? 'bg-gold' : 'bg-ash'
                            )}
                        />
                    )}
                  </React.Fragment>
              )
            })}
          </div>
      )
    }
)

Stepper.displayName = 'Stepper'

export default Stepper
