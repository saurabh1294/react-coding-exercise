/* global fetch:false */
import get from 'lodash/get'
import { toggleFavouriteActionCreator, TOGGLE_FAVOURITE_TYPE } from '../actions'
import { getFavouritesApiUrl } from '../selectors'

const toggleFavourite = async (apiUrl, eventTypeId) => {
  // TODO fix this. It has a bug. Use PUT/DELETE here based on toggleFavourite icon
  let url = apiUrl
  if (eventTypeId && !isNaN(eventTypeId)) {
    url += '/' + eventTypeId
  }
  console.log(url, eventTypeId, 'here is the url in toggleFavourite')
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })
  const data = await response.json()
  console.log('toggleFavourite', data)
  // TODO use PUT/DELETE here instead
  const favourites = get(data, ['results', 'favourites']) || []

  if (!response.ok || !favourites) {
    const error = new Error(get(data, ['error', 'message']) || 'Failed to update favourite events')
    error.status = response.status
    throw error
  }
  return favourites
}

export default store => next => action => {
  const ret = next(action)
  console.log(action, 'here')
  if (action.type === TOGGLE_FAVOURITE_TYPE) {
    const state = store.getState()
    const apiUrl = getFavouritesApiUrl(state)
    const eventTypeId = action?.payload?.entityId || ''
    console.log('toggle fav', action, apiUrl, state, eventTypeId)
    store.dispatch(toggleFavouriteActionCreator(toggleFavourite(apiUrl, eventTypeId)))
  }
  return ret
}
