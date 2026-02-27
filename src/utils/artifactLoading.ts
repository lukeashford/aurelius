import {Artifact} from '../components'
import {CardSlotLoading} from '../components/Card'

/**
 * Centralized policy to derive which card slots should show skeletons
 * based on the artifact's current state and pending status.
 */
export function deriveCardSlotLoading(a: Artifact): CardSlotLoading | undefined {
  if (!a.isPending) {
    return undefined
  }

  const header = {
    title: !a.title,
    subtitle: !a.subtitle,
  }

  const mediaNeeded = (type: string) => ['IMAGE', 'VIDEO', 'AUDIO', 'PDF'].includes(type)
  const media = mediaNeeded(a.type) && !a.url

  const body = (
      (a.type === 'TEXT' && !(a.inlineContent && a.inlineContent.trim().length)) ||
      (a.type === 'SCRIPT' && !(a.scriptElements && a.scriptElements.length > 0))
  )

  return {header, media, body}
}
