import React, {useState, useCallback} from 'react'
import {
  ArtifactGroup,
  ArtifactVariantStack,
  ArtifactCard,
  Modal,
  type ArtifactNode,
} from '@lukeashford/aurelius'
import Section from './Section'

// Known working URL from SpecialistCardsSection
const IMG = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'

// --- Demo data ---

const storyboardPanels: ArtifactNode = {
  id: 'storyboard',
  type: 'GROUP',
  name: 'storyboard',
  label: 'Storyboard',
  children: [
    {
      id: 'panel-1',
      type: 'ARTIFACT',
      name: 'panel_1',
      label: 'Panel 1 — Opening',
      artifact: {
        id: 'a-panel-1',
        type: 'IMAGE',
        url: IMG,
        alt: 'Opening shot',
        title: 'Panel 1 — Opening',
        subtitle: 'Wide establishing shot',
      },
      children: [],
    },
    {
      id: 'panel-2',
      type: 'ARTIFACT',
      name: 'panel_2',
      label: 'Panel 2 — Protagonist',
      artifact: {
        id: 'a-panel-2',
        type: 'IMAGE',
        url: IMG,
        alt: 'Protagonist close-up',
        title: 'Panel 2 — Protagonist',
        subtitle: 'Medium close-up',
      },
      children: [],
    },
    {
      id: 'panel-3',
      type: 'ARTIFACT',
      name: 'panel_3',
      label: 'Panel 3 — Chase',
      artifact: {
        id: 'a-panel-3',
        type: 'IMAGE',
        url: IMG,
        alt: 'Chase sequence',
        title: 'Panel 3 — Chase',
        subtitle: 'Tracking shot through alley',
      },
      children: [],
    },
    {
      id: 'panel-4',
      type: 'ARTIFACT',
      name: 'panel_4',
      label: 'Panel 4 — Confrontation',
      artifact: {
        id: 'a-panel-4',
        type: 'TEXT',
        inlineContent: '**SCENE 4** — The protagonist corners the informant in the rain-soaked alley. Lightning illuminates the tension between them.',
        mimeType: 'text/markdown',
        title: 'Panel 4 — Confrontation',
        subtitle: 'Text storyboard note',
      },
      children: [],
    },
    {
      id: 'panel-5',
      type: 'ARTIFACT',
      name: 'panel_5',
      label: 'Panel 5 — Resolution',
      artifact: {
        id: 'a-panel-5',
        type: 'IMAGE',
        url: IMG,
        alt: 'Final scene',
        title: 'Panel 5 — Resolution',
        subtitle: 'Wide shot — dawn breaking',
      },
      children: [],
    },
  ],
}

const colorTreatments: ArtifactNode = {
  id: 'color-treatments',
  type: 'VARIANT_SET',
  name: 'protagonist_color',
  label: 'Protagonist — Color Treatments',
  chosenVariantId: 'color-neon',
  children: [
    {
      id: 'color-neon',
      type: 'ARTIFACT',
      name: 'protagonist_neon',
      label: 'Neon Noir',
      artifact: {
        id: 'a-neon',
        type: 'IMAGE',
        url: IMG,
        alt: 'Neon noir color treatment',
        title: 'Neon Noir',
        subtitle: 'Cool blues and electric highlights',
      },
      children: [],
    },
    {
      id: 'color-warm',
      type: 'ARTIFACT',
      name: 'protagonist_warm',
      label: 'Warm Analog',
      artifact: {
        id: 'a-warm',
        type: 'IMAGE',
        url: IMG,
        alt: 'Warm analog color treatment',
        title: 'Warm Analog',
        subtitle: 'Golden tones, film grain',
      },
      children: [],
    },
    {
      id: 'color-mono',
      type: 'ARTIFACT',
      name: 'protagonist_mono',
      label: 'Monochrome',
      artifact: {
        id: 'a-mono',
        type: 'IMAGE',
        url: IMG,
        alt: 'Monochrome treatment',
        title: 'Monochrome',
        subtitle: 'High-contrast black & white',
      },
      children: [],
    },
  ],
}

const sceneBreakdown: ArtifactNode = {
  id: 'scene-breakdown',
  type: 'GROUP',
  name: 'scene_breakdown',
  label: 'Scene Breakdown — Act I',
  children: [
    {
      id: 'sb-script',
      type: 'ARTIFACT',
      name: 'scene_script',
      label: 'Script Notes',
      artifact: {
        id: 'a-script-notes',
        type: 'TEXT',
        inlineContent: '## Act I — Setup\n\n- **INT. APARTMENT — NIGHT** — Protagonist receives the call\n- **EXT. CITY STREET — NIGHT** — The first pursuit\n- **INT. UNDERGROUND CLUB — NIGHT** — Meeting the informant',
        mimeType: 'text/markdown',
        title: 'Script Notes',
        subtitle: 'Scene breakdown for Act I',
      },
      children: [],
    },
    {
      id: 'sb-lighting',
      type: 'VARIANT_SET',
      name: 'lighting_options',
      label: 'Lighting Options',
      chosenVariantId: null,
      children: [
        {
          id: 'light-practical',
          type: 'ARTIFACT',
          name: 'practical_lighting',
          label: 'Practical Lighting',
          artifact: {
            id: 'a-practical',
            type: 'IMAGE',
            url: IMG,
            alt: 'Practical lighting reference',
            title: 'Practical Lighting',
            subtitle: 'In-scene light sources only',
          },
          children: [],
        },
        {
          id: 'light-stylized',
          type: 'ARTIFACT',
          name: 'stylized_lighting',
          label: 'Stylized Neon',
          artifact: {
            id: 'a-stylized',
            type: 'IMAGE',
            url: IMG,
            alt: 'Stylized neon lighting reference',
            title: 'Stylized Neon',
            subtitle: 'Exaggerated color washes',
          },
          children: [],
        },
      ],
    },
    {
      id: 'sb-mood',
      type: 'ARTIFACT',
      name: 'mood_board',
      label: 'Mood Board',
      artifact: {
        id: 'a-mood',
        type: 'IMAGE',
        url: IMG,
        alt: 'Mood board collage',
        title: 'Mood Board',
        subtitle: 'Visual tone references',
      },
      children: [],
    },
  ],
}

const storyboardApproaches: ArtifactNode = {
  id: 'storyboard-approaches',
  type: 'VARIANT_SET',
  name: 'storyboard_approaches',
  label: 'Storyboard Approaches',
  chosenVariantId: null,
  children: [
    {
      id: 'approach-linear',
      type: 'GROUP',
      name: 'linear_approach',
      label: 'Linear Narrative',
      children: [
        {
          id: 'lin-1',
          type: 'ARTIFACT',
          name: 'lin_panel_1',
          label: 'Opening',
          artifact: {
            id: 'a-lin-1',
            type: 'IMAGE',
            url: IMG,
            alt: 'Linear opening',
            title: 'Opening',
          },
          children: [],
        },
        {
          id: 'lin-2',
          type: 'ARTIFACT',
          name: 'lin_panel_2',
          label: 'Middle',
          artifact: {
            id: 'a-lin-2',
            type: 'IMAGE',
            url: IMG,
            alt: 'Linear middle',
            title: 'Middle',
          },
          children: [],
        },
      ],
    },
    {
      id: 'approach-nonlinear',
      type: 'GROUP',
      name: 'nonlinear_approach',
      label: 'Non-Linear',
      children: [
        {
          id: 'nl-1',
          type: 'ARTIFACT',
          name: 'nl_panel_1',
          label: 'Flash-forward',
          artifact: {
            id: 'a-nl-1',
            type: 'IMAGE',
            url: IMG,
            alt: 'Non-linear flash-forward',
            title: 'Flash-forward',
          },
          children: [],
        },
        {
          id: 'nl-2',
          type: 'ARTIFACT',
          name: 'nl_panel_2',
          label: 'Origin',
          artifact: {
            id: 'a-nl-2',
            type: 'IMAGE',
            url: IMG,
            alt: 'Non-linear origin',
            title: 'Origin',
          },
          children: [],
        },
        {
          id: 'nl-3',
          type: 'ARTIFACT',
          name: 'nl_panel_3',
          label: 'Resolution',
          artifact: {
            id: 'a-nl-3',
            type: 'IMAGE',
            url: IMG,
            alt: 'Non-linear resolution',
            title: 'Resolution',
          },
          children: [],
        },
      ],
    },
  ],
}

export default function ArtifactTreeSection() {
  const [modalGroup, setModalGroup] = useState<ArtifactNode | null>(null)

  const handleGroupClick = (node: ArtifactNode) => {
    setModalGroup(node)
  }

  // Mock async handler — simulates a 1s backend round-trip
  const handleChoose = useCallback(async (_child: ArtifactNode) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }, [])

  return (
      <Section
          title="Artifact Tree"
          subtitle="Group and Variant Stack components for organizing artifacts into a navigable tree structure."
      >
        <div className="space-y-12">
          {/* Group */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gold">Group</h4>
            <p className="text-sm text-silver">
              A stack showing the first child on top with layers behind it. Click to see all members.
              The storyboard below contains {storyboardPanels.children.length} panels.
            </p>
            <div className="max-w-xs">
              <ArtifactGroup node={storyboardPanels} onClick={handleGroupClick}/>
            </div>
          </div>

          {/* Variant Stack with chosen variant */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gold">Variant Stack (with chosen variant)</h4>
            <p className="text-sm text-silver">
              Children displayed side by side for comparison. &quot;Neon Noir&quot; is the chosen
              variant (highlighted, others dimmed). Click the square checkbox to choose — it
              spins for 1s to simulate a backend round-trip.
            </p>
            <div className="max-w-3xl">
              <ArtifactVariantStack
                  node={colorTreatments}
                  onChoose={handleChoose}
                  onGroupClick={handleGroupClick}
              />
            </div>
          </div>

          {/* Nested: Group containing a Variant Set */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gold">Nested — Group with Variant Set</h4>
            <p className="text-sm text-silver">
              A scene breakdown group that contains a mix of artifacts and a variant set (lighting
              options the director hasn&apos;t decided on yet — both shown equally). Click to explore.
            </p>
            <div className="max-w-xs">
              <ArtifactGroup node={sceneBreakdown} onClick={handleGroupClick}/>
            </div>
          </div>

          {/* Variant Set of Groups */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gold">Variant Stack of Groups</h4>
            <p className="text-sm text-silver">
              Two different storyboard approaches displayed side by side, no choice made yet.
              Each is itself a group that can be expanded.
            </p>
            <div className="max-w-2xl">
              <ArtifactVariantStack
                  node={storyboardApproaches}
                  onChoose={handleChoose}
                  onGroupClick={handleGroupClick}
              />
            </div>
          </div>
        </div>

        {/* Modal for exploring group contents */}
        <Modal
            isOpen={modalGroup !== null}
            onClose={() => setModalGroup(null)}
            title={modalGroup?.label}
            className="max-w-4xl max-h-[90vh] flex flex-col"
        >
          {modalGroup && (
              <div className="mt-4 space-y-4 overflow-y-auto pr-1">
                {modalGroup.children.map((child) => {
                  if (child.type === 'ARTIFACT' && child.artifact) {
                    return (
                        <ArtifactCard
                            key={child.id}
                            artifact={child.artifact}
                            className="w-full"
                        />
                    )
                  }
                  if (child.type === 'VARIANT_SET') {
                    return (
                        <ArtifactVariantStack
                            key={child.id}
                            node={child}
                            onChoose={handleChoose}
                            onGroupClick={handleGroupClick}
                        />
                    )
                  }
                  if (child.type === 'GROUP') {
                    return (
                        <ArtifactGroup
                            key={child.id}
                            node={child}
                            onClick={handleGroupClick}
                        />
                    )
                  }
                  return null
                })}
              </div>
          )}
        </Modal>
      </Section>
  )
}
