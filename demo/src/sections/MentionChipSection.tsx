import React, {useState} from 'react'
import {MentionChip} from '@lukeashford/aurelius'
import {FileImage, FileText, FileVideo} from 'lucide-react'
import Section from './Section'

export default function MentionChipSection() {
  const [removed, setRemoved] = useState<string[]>([])
  const restore = () => setRemoved([])

  return (
      <Section title="Mention Chip"
               subtitle="Inline reference to a project artifact (the @-handle).">
        <div className="space-y-8">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">Basic</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-silver">A reference to</span>
              <MentionChip name="hero_pose"/>
              <span className="text-silver">in flow text.</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">
              With leading icon and tooltip
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <MentionChip name="opening_shot"
                           title="Opening Shot"
                           leadingIcon={<FileVideo className="w-3 h-3"/>}/>
              <MentionChip name="treatment"
                           title="Treatment Document"
                           leadingIcon={<FileText className="w-3 h-3"/>}/>
              <MentionChip name="moodboard_v2"
                           title="Moodboard v2"
                           leadingIcon={<FileImage className="w-3 h-3"/>}/>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">
              Clickable (logs to console)
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <MentionChip name="clip_2"
                           title="Establishing shot, dusk"
                           onClick={() => alert('Clicked: clip_2')}/>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wider text-silver mb-3">
              Removable (input-side preview)
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {['hero_pose', 'villain_pose', 'sidekick_pose']
                  .filter(n => !removed.includes(n))
                  .map(name => (
                      <MentionChip key={name}
                                   name={name}
                                   onRemove={() => setRemoved(prev => [...prev, name])}/>
                  ))}
              {removed.length > 0 && (
                  <button onClick={restore}
                          className="text-xs text-silver underline">
                    Restore
                  </button>
              )}
            </div>
          </div>
        </div>
      </Section>
  )
}
