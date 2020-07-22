export const isEventsBusy = state => !!state.events.busy
export const getEvents = state => state.events.events
export const getEventsError = state => state.events.error
export const isEventsReady = state => !isEventsBusy(state) && getEvents(state).length > 0 && !getEventsError(state)
