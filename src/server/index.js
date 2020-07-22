import express from 'express'
import bodyParser from 'body-parser'
import createRenderMiddleware from './middleware/render'
import eventsMiddleware from './middleware/events'
import favouritesMiddleware from './middleware/favourites'
import errorMiddleware from './middleware/error'

export default function (options) {
  const router = express.Router()

  // Support post requests with body data
  router.use(bodyParser.json())
  router.use(bodyParser.urlencoded({ extended: true }))

  router.use('/api/events', eventsMiddleware)
  router.use('/api/favourites', favouritesMiddleware)
  router.use('/api/favourites/:id', favouritesMiddleware)
  router.use('/', createRenderMiddleware(options))

  router.use(errorMiddleware)

  return router
}
