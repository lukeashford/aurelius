import React, {useState} from 'react'

import ColorsSection from './sections/ColorsSection'
import TypographySection from './sections/TypographySection'
import ButtonsSection from './sections/ButtonsSection'
import BadgesSection from './sections/BadgesSection'
import BrandIconSection from './sections/BrandIconSection'
import InputsSection from './sections/InputsSection'
import FormsSection from './sections/FormsSection'
import CardsSection from './sections/CardsSection'
import ImageCardSection from './sections/ImageCardSection'
import AvatarSection from './sections/AvatarSection'
import MarkdownContentSection from './sections/MarkdownContentSection'
import MentionChipSection from './sections/MentionChipSection'
import ComboboxSection from './sections/ComboboxSection'
import FileChipSection from './sections/FileChipSection'
import FeedbackSection from './sections/FeedbackSection'
import StepperSection from './sections/StepperSection'
import MessageSection from './sections/MessageSection'
import CheckpointsSection from './sections/CheckpointsSection'
import StreamingCursorSection from './sections/StreamingCursorSection'
import TooltipSection from './sections/TooltipSection'
import ModalSection from './sections/ModalSection'
import DirectorNote from './sections/DirectorNote'
import LayoutSection from './sections/LayoutSection'
import NavigationSection from './sections/NavigationSection'
import DataDisplaySection from './sections/DataDisplaySection'
import ChatInterfaceSection from './sections/ChatInterfaceSection'
import SpecialistCardsSection from './sections/SpecialistCardsSection'
import ArtifactTreeSection from './sections/ArtifactTreeSection'
import DeliverableSection from './sections/DeliverableSection'
import {Footer} from './components/Footer'
import {LegalNotice} from './components/LegalNotice'
import ChatDemo from './components/ChatDemo'
import DeliverablePrint from './components/DeliverablePrint'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

interface SectionEntry {
  id: string
  label: string
  /** Component rendered inside the <section>. Omitted for the overview row. */
  Component?: React.ComponentType
}

const SECTIONS: SectionEntry[] = [
  {id: 'overview', label: 'Overview'},
  {id: 'chat-demo-link', label: 'Chat Demo', Component: ChatInterfaceSection},
  {id: 'director-note', label: "Director's Note", Component: DirectorNote},
  {id: 'colors', label: 'Colors', Component: ColorsSection},
  {id: 'typography', label: 'Typography', Component: TypographySection},
  {id: 'layout', label: 'Layout', Component: LayoutSection},
  {id: 'buttons', label: 'Buttons', Component: ButtonsSection},
  {id: 'badges', label: 'Badges', Component: BadgesSection},
  {id: 'mention-chip', label: 'Mention Chip', Component: MentionChipSection},
  {id: 'file-chip', label: 'File Chip', Component: FileChipSection},
  {id: 'combobox', label: 'Combobox', Component: ComboboxSection},
  {id: 'inputs', label: 'Inputs', Component: InputsSection},
  {id: 'forms', label: 'Forms', Component: FormsSection},
  {id: 'navigation', label: 'Navigation', Component: NavigationSection},
  {id: 'data-display', label: 'Data Display', Component: DataDisplaySection},
  {id: 'stepper', label: 'Stepper', Component: StepperSection},
  {id: 'tooltip', label: 'Tooltip', Component: TooltipSection},
  {id: 'modal', label: 'Overlays', Component: ModalSection},
  {id: 'avatar', label: 'Avatar', Component: AvatarSection},
  {id: 'brand-icons', label: 'Brand Icons', Component: BrandIconSection},
  {id: 'markdown', label: 'Markdown Content', Component: MarkdownContentSection},
  {id: 'cards', label: 'Cards', Component: CardsSection},
  {id: 'specialist-cards', label: 'Specialist Cards', Component: SpecialistCardsSection},
  {id: 'artifact-tree', label: 'Artifact Tree', Component: ArtifactTreeSection},
  {id: 'deliverable', label: 'Deliverable Renderer', Component: DeliverableSection},
  {id: 'image-cards', label: 'Image Cards', Component: ImageCardSection},
  {id: 'feedback', label: 'Feedback', Component: FeedbackSection},
  {id: 'streaming', label: 'Streaming Cursor', Component: StreamingCursorSection},
  {id: 'messages', label: 'Messages', Component: MessageSection},
  {id: 'checkpoints', label: 'Checkpoints', Component: CheckpointsSection},
]

function MainLayout() {
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

    SECTIONS.forEach(({id}) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
      }
    })
    return () => observer.disconnect()
  }, [])

  return (
      <div className="min-h-screen bg-obsidian text-white">
        <aside
            className="fixed left-0 top-0 h-full w-60 hidden lg:block border-r border-ash/40 bg-charcoal/50 backdrop-blur-sm overflow-y-auto">
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
            {SECTIONS.map(({id, label}) => (
                <a key={id} href={`#${id}`}
                   className={`block px-3 py-2 transition-colors ${
                       active === id
                           ? 'text-white bg-ash/30'
                           : 'text-silver hover:text-white hover:bg-ash/30'
                   }`}>
                  {label}
                </a>
            ))}
          </nav>
        </aside>

        <main className="max-w-7xl mx-auto p-6 lg:pl-64 space-y-16">
          <section id="overview" className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-semibold">Aurelius Design</h1>
            <p className="mt-3 text-silver max-w-3xl">
              A cohesive visual language for creative technologists — combining technical
              sophistication with artistic sensibility.
            </p>
          </section>

          {SECTIONS.filter(s => s.Component).map(({id, Component}) => (
              <section key={id} id={id} className="space-y-4">
                {Component && <Component/>}
              </section>
          ))}

          <Footer/>
        </main>
      </div>
  )
}

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout/>}/>
          <Route path="/chat-demo" element={<ChatDemo/>}/>
          <Route path="/deliverable-print" element={<DeliverablePrint/>}/>
          <Route path="/legal" element={<LegalNotice/>}/>
        </Routes>
      </BrowserRouter>
  )
}
