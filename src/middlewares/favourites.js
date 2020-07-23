/* global fetch:false */
import get from 'lodash/get'
import { fetchFavouritesActionCreator, REHYDRATED, FETCH_FAVOURITES_TYPE } from '../actions'
import { getFavouritesApiUrl } from '../selectors'
// import qs from 'query-string'

const fetchFavourites = async (apiUrl) => {
  const url = apiUrl
  //   if (eventTypeId) {
  //     url
  //   }
  console.log('fetchFavourites', url)
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })

  const data = await response.json()
  console.log('got this data from api', data, response)
  const favourites = get(data, ['results', 'favourites']) || []
  console.log('got this favourites from api', favourites)

  if (!response.ok || !favourites) {
    const error = new Error(get(data, ['error', 'message']) || 'Failed to fetch favourite events')
    error.status = response.status
    throw error
  }

  return favourites
}

export default store => next => action => {
  const ret = next(action)
  console.log(action, 'here')
  if (action.type === REHYDRATED || action.type === FETCH_FAVOURITES_TYPE) {
    const state = store.getState()
    const apiUrl = getFavouritesApiUrl(state)
    console.log(apiUrl, state, 'here is the url')
    store.dispatch(fetchFavouritesActionCreator(fetchFavourites(apiUrl)))
  }

  return ret
}
