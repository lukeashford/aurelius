import React, {useMemo, useState} from 'react'
import {
  addNodeToTree,
  ChatView,
  type ChatViewItem,
  Checkpoint,
  type CheckpointExecutionKind,
  type CheckpointNode,
  type CheckpointStatus,
  type ConversationTree,
  createEmptyTree,
  findAncestor,
  getActivePath,
  getGreyedFuture,
  getSiblingInfo,
  GreyedDivider,
  type MessageNode,
  setActiveLeaf,
  switchBranch,
  type TreeNode,
} from '@lukeashford/aurelius'
import Section from './Section'

// ───────────────────────────────────────────────────────────────
//  Variants — individual rows in isolation
// ───────────────────────────────────────────────────────────────

interface VariantSpec {
  label: string
  name: string
  executionKind: CheckpointExecutionKind
  status?: CheckpointStatus
  isActive?: boolean
  muted?: boolean
  branchInfo?: { current: number; total: number }
}

const VARIANTS: VariantSpec[] = [
  {label: 'Project head (init)', name: 'rough_cut_v1', executionKind: 'init'},
  {label: 'Task — completed', name: 'character_design_pass', executionKind: 'task'},
  {
    label: 'Task — active leaf', name: 'character_design_pass', executionKind: 'task',
    isActive: true
  },
  {label: 'Submit', name: 'rough_cut_v2', executionKind: 'submit'},
  {label: 'Manual rename', name: 'renamed_hero_pose', executionKind: 'rename'},
  {label: 'Task — failed', name: 'storyboard_revision', executionKind: 'task', status: 'failed'},
  {
    label: 'Task — cancelled', name: 'env_lighting_explore', executionKind: 'task',
    status: 'cancelled'
  },
  {
    label: 'Task — muted (greyed future)', name: 'character_design_pass', executionKind: 'task',
    muted: true
  },
  {
    label: 'Task with siblings', name: 'rough_cut_attempt', executionKind: 'task',
    branchInfo: {current: 2, total: 3}
  },
]

function VariantsGrid() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 border border-ash/40 p-4">
        {VARIANTS.map(({label, branchInfo, ...props}, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-xs text-silver/50 w-48 shrink-0">{label}</span>
              <div className="flex-1 min-w-0">
                <Checkpoint
                    {...props}
                    branchInfo={branchInfo
                        ? {...branchInfo, onPrevious: () => undefined, onNext: () => undefined}
                        : undefined}
                    onJumpHere={() => undefined}
                />
              </div>
            </div>
        ))}
      </div>
  )
}

// ───────────────────────────────────────────────────────────────
//  GreyedDivider — in isolation
// ───────────────────────────────────────────────────────────────

function DividerShowcase() {
  return (
      <div className="space-y-3 border border-ash/40 p-4">
        <div>
          <p className="text-xs text-silver/50 mb-2">Single mixed run</p>
          <GreyedDivider
              messageCount={3}
              checkpointCount={1}
              onJumpToLatest={() => undefined}
          />
        </div>
        <div>
          <p className="text-xs text-silver/50 mb-2">Messages only · no jump action</p>
          <GreyedDivider messageCount={2} checkpointCount={0}/>
        </div>
        <div>
          <p className="text-xs text-silver/50 mb-2">Single checkpoint</p>
          <GreyedDivider
              messageCount={0}
              checkpointCount={1}
              onJumpToLatest={() => undefined}
          />
        </div>
      </div>
  )
}

// ───────────────────────────────────────────────────────────────
//  Mini ChatView — checkpoints integrated with messages, with rewind
// ───────────────────────────────────────────────────────────────

type DemoNode = MessageNode | CheckpointNode

function buildSeedTree(): ConversationTree<DemoNode> {
  let tree = createEmptyTree<DemoNode>()
  tree = addNodeToTree<DemoNode>(tree, {
    kind: 'checkpoint', id: 'cp-init', parentId: null,
    taskExecutionId: 'exec-0', name: 'rough_cut_v1', executionKind: 'init',
    status: 'completed',
  }, null)
  tree = addNodeToTree<DemoNode>(tree, {
    kind: 'message', id: 'm-1', parentId: 'cp-init',
    role: 'user', content: 'Push the hero closer to camera and add rim light.',
  }, 'cp-init')
  tree = addNodeToTree<DemoNode>(tree, {
    kind: 'message', id: 'm-2', parentId: 'm-1',
    role: 'assistant', content: 'Pushed in. Rim light applied at ~30°.',
  }, 'm-1')
  tree = addNodeToTree<DemoNode>(tree, {
    kind: 'checkpoint', id: 'cp-1', parentId: 'm-2',
    taskExecutionId: 'exec-1', name: 'hero_closer_with_rim', executionKind: 'task',
    status: 'completed',
  }, 'm-2')
  tree = addNodeToTree<DemoNode>(tree, {
    kind: 'message', id: 'm-3', parentId: 'cp-1',
    role: 'user', content: 'Try a warmer key. Submit when you are happy.',
  }, 'cp-1')
  tree = addNodeToTree<DemoNode>(tree, {
    kind: 'message', id: 'm-4', parentId: 'm-3',
    role: 'assistant', content: 'Warmer key dialed in. Submitting v2.',
  }, 'm-3')
  tree = addNodeToTree<DemoNode>(tree, {
    kind: 'checkpoint', id: 'cp-2', parentId: 'm-4',
    taskExecutionId: 'exec-2', name: 'rough_cut_v2', executionKind: 'submit',
    status: 'completed',
  }, 'm-4')
  return tree
}

function buildItem(
    tree: ConversationTree<DemoNode>,
    node: TreeNode<DemoNode>,
    activeCheckpointId: string | null,
    muted: boolean,
    onJumpHere: (id: string) => void,
    onSwitch: (id: string, dir: 'prev' | 'next') => void,
): ChatViewItem {
  const sibling = getSiblingInfo(tree, node.id)
  const branchInfo = sibling.total > 1
      ? {
        current: sibling.current,
        total: sibling.total,
        onPrevious: () => onSwitch(node.id, 'prev'),
        onNext: () => onSwitch(node.id, 'next'),
      }
      : undefined

  if (node.kind === 'checkpoint') {
    return {
      kind: 'checkpoint',
      id: node.id,
      name: node.name,
      executionKind: node.executionKind,
      status: node.status,
      isActive: node.id === activeCheckpointId && !muted,
      muted,
      branchInfo,
      onJumpHere: () => onJumpHere(node.id),
    }
  }
  return {
    kind: 'message',
    id: node.id,
    variant: node.role,
    content: node.content,
    muted,
    branchInfo,
  }
}

function MiniChat() {
  const [tree, setTree] = useState<ConversationTree<DemoNode>>(buildSeedTree)

  const handleJump = (id: string) => setTree(t => setActiveLeaf(t, id))
  const handleSwitch = (id: string, dir: 'prev' | 'next') =>
      setTree(t => switchBranch(t, id, dir))
  const handleJumpLatest = () => {
    if (tree.lastLeafId) {
      setTree(t => setActiveLeaf(t, t.lastLeafId))
    }
  }

  const activeCheckpointId = useMemo(() => {
    const found = findAncestor(
        tree,
        tree.activeLeafId,
        (n): n is TreeNode<CheckpointNode> => n.kind === 'checkpoint',
    )
    return found?.id ?? null
  }, [tree])

  const items: ChatViewItem[] = useMemo(() => {
    const path = getActivePath(tree)
    const greyed = getGreyedFuture(tree)
    const out: ChatViewItem[] = path.map(n =>
        buildItem(tree, n, activeCheckpointId, false, handleJump, handleSwitch),
    )
    if (greyed.length > 0) {
      out.push({
        kind: 'divider',
        id: '__divider__',
        messageCount: greyed.filter(n => n.kind === 'message').length,
        checkpointCount: greyed.filter(n => n.kind === 'checkpoint').length,
        onJumpToLatest: handleJumpLatest,
      })
      for (const n of greyed) {
        out.push(buildItem(tree, n, activeCheckpointId, true, handleJump, handleSwitch))
      }
    }
    return out
  }, [tree, activeCheckpointId])

  return (
      <div className="border border-ash/40 bg-charcoal/30 h-160 flex flex-col">
        <ChatView items={items} className="flex-1"/>
      </div>
  )
}

// ───────────────────────────────────────────────────────────────
//  Section
// ───────────────────────────────────────────────────────────────

export default function CheckpointsSection() {
  return (
      <Section
          title="Checkpoints & rewind"
          subtitle={
              'A checkpoint anchors a chat position to a project state. Click an inactive '
              + 'checkpoint to rewind the artifact view without forking. The greyed-future '
              + 'divider preserves the timeline you rewound away from.'
          }
      >
        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-base text-white">Variants</h3>
            <p className="text-xs text-silver/60">
              Each row has one click target — the underlined name jumps to the checkpoint.
              Sibling chevrons appear at fork points.
            </p>
            <VariantsGrid/>
          </div>

          <div className="space-y-4">
            <h3 className="text-base text-white">Greyed-future divider</h3>
            <p className="text-xs text-silver/60">
              Marks the boundary between the active path and the timeline the user rewound
              away from. Renders nothing when both counts are zero.
            </p>
            <DividerShowcase/>
          </div>

          <div className="space-y-4">
            <h3 className="text-base text-white">Live: rewind in a chat</h3>
            <p className="text-xs text-silver/60">
              Click any inactive checkpoint to rewind. The previously-active descendants
              render as the greyed future below the divider; click any greyed row or
              "Jump to latest" to return.
            </p>
            <MiniChat/>
          </div>
        </div>
      </Section>
  )
}
