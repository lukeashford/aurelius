import React, {useState} from 'react'

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
import DirectorNote from './sections/DirectorNote'
import {Footer} from './components/Footer'
import {LegalNotice} from './components/LegalNotice'

const nav = [
  {id: 'overview', label: 'Overview'},
  {id: 'director-note', label: "Director's Note"},
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
  const [view, setView] = useState(window.location.hash === '#legal' ? 'legal' : 'main')

  React.useEffect(() => {
    const handleHashChange = () => {
      setView(window.location.hash === '#legal' ? 'legal' : 'main')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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

  if (view === 'legal') {
    return <LegalNotice/>
  }

  return (
      <div className="min-h-screen bg-obsidian text-white">
        <aside
            className="fixed left-0 top-0 h-full w-60 hidden lg:block border-r border-ash/40 bg-charcoal/50 backdrop-blur-sm">
          <div className="p-4 border-b border-ash/40">
            <h2 className="text-xl font-semibold text-white">Aurelius Design</h2>
            <a href="https://github.com/lukeashford/aurelius"
               target="_blank"
               rel="noopener noreferrer"
               className="text-xs text-gold hover:text-gold-bright transition-colors mt-2 inline-block">
              View Source on GitHub →
            </a>
          </div>
          <nav className="p-3 space-y-1">
            {nav.map(n => (
                <a key={n.id} href={`#${n.id}`}
                   className={`block px-3 py-2 rounded-md transition-colors ${
                     active === n.id
                       ? 'text-white bg-ash/30'
                       : 'text-silver hover:text-white hover:bg-ash/30'
                   }`}>
                  {n.label}
                </a>
            ))}
          </nav>
        </aside>

        <main className="max-w-screen-xl mx-auto p-6 lg:pl-64 space-y-16">
          <section id="overview" className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-semibold">Aurelius Design</h1>
            <p className="mt-3 text-silver max-w-3xl">
              A cohesive visual language for creative technologists — combining technical
              sophistication with artistic sensibility.
            </p>
          </section>

          <section id="director-note" className="space-y-4">
            <DirectorNote/>
          </section>

          <section id="colors" className="space-y-4">
            <ColorsSection/>
          </section>

          <section id="typography" className="space-y-4">
            <TypographySection/>
          </section>

          <section id="buttons" className="space-y-4">
            <ButtonsSection/>
          </section>

          <section id="badges" className="space-y-4">
            <BadgesSection/>
          </section>

          <section id="inputs" className="space-y-4">
            <InputsSection/>
          </section>

          <section id="forms" className="space-y-4">
            <FormsSection/>
          </section>

          <section id="cards" className="space-y-4">
            <CardsSection/>
          </section>

          <section id="avatar" className="space-y-4">
            <AvatarSection/>
          </section>

          <section id="feedback" className="space-y-4">
            <FeedbackSection/>
          </section>

          <section id="tooltip" className="space-y-4">
            <TooltipSection/>
          </section>

          <section id="modal" className="space-y-4">
            <ModalSection/>
          </section>

          <Footer/>
        </main>
      </div>
  )
}
