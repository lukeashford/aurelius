import React from 'react'
import {BrandIcon, type BrandIconSize, type BrandIconVariant} from '@lukeashford/aurelius'
import Section from './Section'

const variants: BrandIconVariant[] = ['solid', 'outline']
const sizes: BrandIconSize[] = ['sm', 'md', 'lg']

export default function BrandIconSection() {
  return (
      <Section
          title="Brand Icons"
          subtitle="Branded icon containers with solid and outline variants."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-silver">
            <tr>
              <th className="py-2 pr-4">Variant</th>
              {sizes.map(size => (
                  <th key={size} className="py-2 pr-4 font-medium">{size}</th>
              ))}
            </tr>
            </thead>
            <tbody>
            {variants.map(variant => (
                <tr key={variant} className="border-t border-ash/50">
                  <td className="py-3 pr-4 font-mono text-white">{variant}</td>
                  {sizes.map(size => (
                      <td key={`${variant}-${size}`} className="py-3 pr-4">
                        <BrandIcon variant={variant} size={size}>
                          A
                        </BrandIcon>
                      </td>
                  ))}
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Examples</h3>
          <div className="flex gap-6 items-center flex-wrap">
            <BrandIcon variant="solid" size="lg">AI</BrandIcon>
            <BrandIcon variant="outline" size="lg">JB</BrandIcon>
            <BrandIcon variant="solid" size="md">X</BrandIcon>
            <BrandIcon variant="outline" size="md">⚡</BrandIcon>
            <BrandIcon variant="solid" size="sm">★</BrandIcon>
          </div>
        </div>
      </Section>
  )
}
