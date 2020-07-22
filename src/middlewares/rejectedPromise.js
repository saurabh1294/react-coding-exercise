import isPromise from 'redux-promise-middleware/dist/isPromise'

// redux-promise-middleware re-throws when a promise rejects, even though it dispatches a _REJECTED action, which
// seems to me like a mistake ... except that it's more or less acknowledged in the official "complex" example. This
// middleware just catches and ignores all rejected promises - it's basically a simplified version of:
//   https://github.com/pburtchaell/redux-promise-middleware/blob/master/examples/complex/middleware/error.js
export default store => next => action => {
  if (isPromise(action.payload)) {
    // Dispatch initial pending promise, but catch any errors -
    return next(action).catch(error => {
      if (process.env.NODE_ENV === 'development') {
        console.error(error)
      }
    })
  }

  return next(action)
}
