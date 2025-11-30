import React from 'react'
import {Avatar, type AvatarSize} from '@lukeashford/aurelius-design'

const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

export default function AvatarSection() {
  return (
      <div>
        <header className="section-header">
          <h2 className="text-2xl">Avatar</h2>
          <p className="text-silver">User identity with sizes and fallback initials.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-gold">Sizes</h4>
            <div className="flex flex-wrap items-end gap-4">
              {sizes.map(s => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <Avatar name="Aurelius" size={s}/>
                    <span className="text-xs text-silver">{s}</span>
                  </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-gold">With Image & Status</h4>
            <div className="flex items-center gap-4">
              <Avatar
                  src="https://i.postimg.cc/qvJsCQwy/2-C3-A5121-2.jpg"
                  alt="Profile"
                  size="lg"
                  status="online"
              />
              <Avatar name="Marcus Aurelius" size="lg" status="busy"/>
              <Avatar name="Seneca" size="lg" status="offline"/>
            </div>
          </div>
        </div>
      </div>
  )
}
