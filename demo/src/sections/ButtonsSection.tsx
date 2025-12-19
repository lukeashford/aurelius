import React from 'react'
import {Button, type ButtonSize, type ButtonVariant} from '@lukeashford/aurelius'
import {Heart, Settings} from 'lucide-react'
import Section from './Section'

const variants: ButtonVariant[] = ['primary', 'important', 'elevated', 'outlined', 'featured',
  'ghost', 'danger']
const sizes: ButtonSize[] = ['sm', 'md', 'lg', 'xl']

export default function ButtonsSection() {
  return (
      <Section
          title="Buttons"
          subtitle="All variants and sizes, including disabled and loading states."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-silver">
            <tr>
              <th className="py-2 pr-4">Variant</th>
              {sizes.map(size => (
                  <th key={size} className="py-2 pr-4 font-medium">{size}</th>
              ))}
              <th className="py-2 pr-4">Disabled</th>
              <th className="py-2 pr-4">Loading</th>
            </tr>
            </thead>
            <tbody>
            {variants.map(variant => (
                <tr key={variant} className="border-t border-ash/50">
                  <td className="py-3 pr-4 font-mono text-white">{variant}</td>
                  {sizes.map(size => (
                      <td key={`${variant}-${size}`} className="py-3 pr-4">
                        <Button variant={variant} size={size}>
                          {variant} {size}
                        </Button>
                      </td>
                  ))}
                  <td className="py-3 pr-4">
                    <Button variant={variant} disabled>
                      Disabled
                    </Button>
                  </td>
                  <td className="py-3 pr-4">
                    <Button variant={variant} loading>
                      Loading
                    </Button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Note: Using React elements as children */}
        <div className="mt-8 border-t border-ash/50 pt-6">
          <h3 className="text-lg font-semibold text-white mb-3">Using Icons and React Elements</h3>
          <p className="text-silver mb-4">
            The Button component accepts any React element as children, making it easy to include
            icons or custom content.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">
              <Heart className="mr-2 h-4 w-4"/> Like
            </Button>
            <Button variant="outlined">
              <Settings className="mr-2 h-4 w-4"/> Settings
            </Button>
          </div>
        </div>
      </Section>
  )
}
