export const FETCH_EVENTS_TYPE = 'FETCH_EVENTS'

export const fetchEventsActionCreator = promise => ({
  type: FETCH_EVENTS_TYPE,
  payload: promise
})
