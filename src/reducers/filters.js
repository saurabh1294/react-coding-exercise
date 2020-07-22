import { EVENT_TYPE_FILTER_CHANGED } from '../actions'

const initialState = {
  eventTypeId: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EVENT_TYPE_FILTER_CHANGED:
      return {
        ...state,
        eventTypeId: action.payload
      }
    default:
      return state
  }
}

export default reducer
