export const getEventsApiUrl = state => process.env.EVENTS_API_URL || state.config.eventsApi

export const getFavouritesApiUrl = state => process.env.EVENTS_FAVOURITE_API_URL || state.config.favouritesApi
