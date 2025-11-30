import React, {useState} from 'react'
import {Card, colors, typography,} from '@lukeashford/aurelius-design'

import ColorsSection from './sections/ColorsSection'
import TypographySection from './sections/TypographySection'
import ButtonsSection from './sections/ButtonsSection'
import BadgesSection from './sections/BadgesSection'
import InputsSection from './sections/InputsSection'
import CardsSection from './sections/CardsSection'
import AvatarSection from './sections/AvatarSection'
import TooltipSection from './sections/TooltipSection'
import FormsSection from './sections/FormsSection'
import FeedbackSection from './sections/FeedbackSection'
import ModalSection from './sections/ModalSection'

const nav = [
  {id: 'overview', label: 'Overview'},
  {id: 'colors', label: 'Colors'},
  {id: 'typography', label: 'Typography'},
  {id: 'buttons', label: 'Buttons'},
  {id: 'badges', label: 'Badges'},
  {id: 'inputs', label: 'Inputs'},
  {id: 'forms', label: 'Forms'},
  {id: 'cards', label: 'Cards'},
  {id: 'avatar', label: 'Avatar'},
  {id: 'feedback', label: 'Feedback'},
  {id: 'tooltip', label: 'Tooltip'},
  {id: 'modal', label: 'Overlays'},
]

export default function App() {
  const [active, setActive] = useState('overview')

  // IntersectionObserver to set active nav link
  React.useEffect(() => {
    const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActive(entry.target.id)
            }
          })
        },
        {rootMargin: '-40% 0px -55% 0px', threshold: [0, 1]}
    )

    nav.forEach(n => {
      const el = document.getElementById(n.id)
      if (el) {
        observer.observe(el)
      }
    })
    return () => observer.disconnect()
  }, [])

  return (
      <div className="min-h-screen bg-obsidian text-white">
        <aside
            className="fixed left-0 top-0 h-full w-60 hidden lg:block border-r border-ash/40 bg-charcoal/50 backdrop-blur-sm">
          <div className="p-4 border-b border-ash/40">
            <div className="text-sm text-silver">Aurelius Design</div>
            <h2 className="text-xl font-semibold">Kitchen Sink</h2>
          </div>
          <nav className="p-3 space-y-1">
            {nav.map(n => (
                <a key={n.id} href={`#${n.id}`}
                   className={`sidebar-link ${active === n.id ? 'active' : ''}`}>
                  {n.label}
                </a>
            ))}
          </nav>
          <div className="p-3 text-xs text-silver/70">Live updates via tsup --watch + Vite</div>
        </aside>

        <main className="max-w-screen-xl mx-auto p-6 lg:pl-64 space-y-16">
          <section id="overview" className="section">
            <Card variant="featured" className="p-8">
              <h1 className="text-3xl sm:text-4xl font-semibold">Aurelius Design — Kitchen Sink</h1>
              <p className="mt-3 text-silver max-w-3xl">
                A cohesive visual language for creative technologists — combining technical
                sophistication with artistic sensibility.
              </p>
            </Card>
          </section>

          <section id="colors" className="section">
            <ColorsSection tokens={colors}/>
          </section>

          <section id="typography" className="section">
            <TypographySection tokens={typography}/>
          </section>

          <section id="buttons" className="section">
            <ButtonsSection/>
          </section>

          <section id="badges" className="section">
            <BadgesSection/>
          </section>

          <section id="inputs" className="section">
            <InputsSection/>
          </section>

          <section id="forms" className="section">
            <FormsSection/>
          </section>

          <section id="cards" className="section">
            <CardsSection/>
          </section>

          <section id="avatar" className="section">
            <AvatarSection/>
          </section>

          <section id="feedback" className="section">
            <FeedbackSection/>
          </section>

          <section id="tooltip" className="section">
            <TooltipSection/>
          </section>

          <section id="modal" className="section">
            <ModalSection/>
          </section>
        </main>
      </div>
  )
}
