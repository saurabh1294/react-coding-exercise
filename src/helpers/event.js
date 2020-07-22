import { SLUGS } from '../eventTypes'
import { ReactComponent as LightIcon } from '../icons/light.svg'
import { ReactComponent as MusicIcon } from '../icons/music.svg'
import { ReactComponent as IdeasIcon } from '../icons/ideas.svg'
import { ReactComponent as SpeakerIcon } from '../icons/speaker.svg'

const icons = {
  light: LightIcon,
  music: MusicIcon,
  ideas: IdeasIcon,
  speaker: SpeakerIcon
}

export function getEventTypeIcon (content) {
  const slug = SLUGS[content.type] || content.type
  return icons[slug]
}
