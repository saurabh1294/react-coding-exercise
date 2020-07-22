import mapKeys from 'lodash/mapKeys'
import invert from 'lodash/invert'

export const LIGHT = 'light'
export const MUSIC = 'music'
export const IDEAS = 'ideas'
export const SPEAKERS = 'speaker'

export const LIGHT_TID = 1
export const MUSIC_TID = 2
export const IDEAS_TID = 3

export const LIGHT_TITLE = 'Light'
export const MUSIC_TITLE = 'Music'
export const IDEAS_TITLE = 'Ideas'
export const SPEAKERS_TITLE = 'Speakers'

export const TITLES = {
  [LIGHT]: LIGHT_TITLE,
  [MUSIC]: MUSIC_TITLE,
  [IDEAS]: IDEAS_TITLE,
  [SPEAKERS]: SPEAKERS_TITLE
}

export const TIDS = {
  [LIGHT]: LIGHT_TID,
  [MUSIC]: MUSIC_TID,
  [IDEAS]: IDEAS_TID
}

export const TITLES_BY_TID = mapKeys(TITLES, (title, slug) => TIDS[slug])

export const SLUGS = invert(TIDS)
