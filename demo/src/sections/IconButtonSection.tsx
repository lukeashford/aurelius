import React from 'react'
import {type ButtonSize, type ButtonVariant, IconButton} from '@lukeashford/aurelius'
import {Heart, Plus, Settings, Star, Trash2, X} from 'lucide-react'

const variants: ButtonVariant[] = ['primary', 'important', 'elevated', 'outlined', 'featured',
  'ghost', 'danger']
const sizes: ButtonSize[] = ['sm', 'md', 'lg', 'xl']
const icons = [Heart, Star, Trash2, Settings, Plus, X]

export default function IconButtonSection() {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Icon Buttons</h2>
          <p className="text-silver">Square icon-only buttons in all variants and sizes.</p>
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
            {variants.map((variant, idx) => {
              const Icon = icons[idx % icons.length]
              return (
                  <tr key={variant} className="border-t border-ash/50">
                    <td className="py-3 pr-4 font-mono text-white">{variant}</td>
                    {sizes.map(size => (
                        <td key={`${variant}-${size}`} className="py-3 pr-4">
                          <IconButton variant={variant} size={size} icon={<Icon/>}/>
                        </td>
                    ))}
                    <td className="py-3 pr-4">
                      <IconButton variant={variant} disabled icon={<Icon/>}/>
                    </td>
                    <td className="py-3 pr-4">
                      <IconButton variant={variant} loading icon={<Icon/>}/>
                    </td>
                  </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </div>
  )
}
