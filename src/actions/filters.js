export const EVENT_TYPE_FILTER_CHANGED = 'EVENT_TYPE_FILTER_CHANGED'

export const eventTypeFilterChangedCreator = (eventTypeId) => ({
  type: EVENT_TYPE_FILTER_CHANGED,
  payload: eventTypeId
})
