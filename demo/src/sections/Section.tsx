import React, {HTMLAttributes, ReactNode} from 'react'

export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  subtitle: ReactNode
}

export default function Section({title, subtitle, children, className, ...rest}: SectionProps) {
  return (
      <section className={className} {...rest}>
        <header className="section-header">
          <h2 className="text-2xl">{title}</h2>
          <p className="text-silver">{subtitle}</p>
        </header>
        {children}
      </section>
  )
}