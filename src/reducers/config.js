// import favourites from '../middlewares/favourites'

const initialState = {
  eventsApi: process.env.CLIENT_EVENTS_API_URL,
  favouritesApi: process.env.CLIENT_FAVOURITES_API_URL
}

const config = (state = initialState, action) => {
  console.log(initialState, 'initialState', process.env)
  switch (action.type) {
    default:
      return state
  }
}

export default config
