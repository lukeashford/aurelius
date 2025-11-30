import React from 'react'
import {Button, type ButtonSize, type ButtonVariant} from '@lukeashford/aurelius-design'

const variants: ButtonVariant[] = ['primary', 'important', 'elevated', 'outlined', 'featured', 'ghost', 'danger']
const sizes: ButtonSize[] = ['sm', 'md', 'lg', 'xl']

export default function ButtonsSection() {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Buttons</h2>
          <p className="text-silver">All variants and sizes, including disabled and loading
            states.</p>
        </header>

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
      </div>
  )
}
