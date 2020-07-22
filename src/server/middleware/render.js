import React from 'react'
import { oneLineTrim, safeHtml } from 'common-tags'
import { renderToString } from 'react-dom/server'
import { Provider as ReduxProvider } from 'react-redux'
import { JssProvider, SheetsRegistry } from 'react-jss'
import asyncHandler from 'express-async-handler'
import stringifyForScriptTag from 'htmlescape'
import createStore from '../../createStore'
import theme from '../../style/theme'
import App from '../../components/App'
import compact from 'lodash/compact'
import { TIDS } from '../../eventTypes'
import { eventTypeFilterChangedCreator } from '../../actions'

/**
 * Renders <script> tags for all required javascript files.
 * Based on the htmlWebpackPluginAssets() method in html-webpack-plugin.
 *
 * @param clientStats bundle stats as output by webpack
 * @returns {string} <script> tags suitable for inserting at the bottom of the html body.
 */
function getScripts (clientStats) {
  const entryNames = Array.from(Object.keys(clientStats.entrypoints))
  const publicPath = clientStats.publicPath
  const js = []

  // Extract paths to .js, .mjs and .css files from the current compilation
  const entryPointPublicPathMap = {}
  const extensionRegexp = /\.(css|js|mjs)(\?|$)/
  for (let i = 0; i < entryNames.length; i++) {
    const entryName = entryNames[i]
    const entryPointFiles = clientStats.entrypoints[entryName].assets
    // Prepend the publicPath and append the hash depending on the
    // webpack.output.publicPath and hashOptions
    // E.g. bundle.js -> /bundle.js?hash
    const entryPointPublicPaths = entryPointFiles
      .map(chunkFile => {
        return publicPath + chunkFile
      })

    entryPointPublicPaths.forEach((entryPointPublicPath) => {
      const extMatch = extensionRegexp.exec(entryPointPublicPath)
      // Skip if the public path is not a .css, .mjs or .js file
      if (!extMatch) {
        return
      }
      // Skip if this file is already known
      // (e.g. because of common chunk optimizations)
      if (entryPointPublicPathMap[entryPointPublicPath]) {
        return
      }
      entryPointPublicPathMap[entryPointPublicPath] = true
      js.push(entryPointPublicPath)
    })
  }
  return js.map(path => safeHtml`<script src="${path}"></script>`).join('')
}

function toCSS (sheets) {
  let css = sheets.toString()

  if (process.env.NODE_ENV === 'production') {
    const CleanCSS = require('clean-css')
    const output = new CleanCSS().minify(css)
    css = output.styles
  }

  return css
}

function dispatchRouteFilters (store, req) {
  const eventTypeId = TIDS[compact(req.path.split('/'))[0]]
  if (eventTypeId) {
    store.dispatch(eventTypeFilterChangedCreator(eventTypeId))
  }
}

async function render (req, { clientStats, serverStats }) {
  const sheets = new SheetsRegistry()
  const store = createStore()

  dispatchRouteFilters(store, req)

  const renderedHtml = renderToString(
    <ReduxProvider store={store}>
      <JssProvider registry={sheets}>
        <App />
      </JssProvider>
    </ReduxProvider>
  )
  const css = toCSS(sheets)
  const state = store.getState()
  // WARNING: See the following for security issues around embedding JSON in HTML:
  // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
  const jsonState = stringifyForScriptTag(state)
  const scripts = getScripts(clientStats)

  const html = oneLineTrim`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Nightjar React Coding Exercise</title>
        ${safeHtml`
          ${/* A referrer will be sent for same-site origins, but cross-origin requests will contain no referrer */''}
          <meta name="referrer" content="strict-origin">
          ${/*
            manifest.json provides metadata used when your web app is installed on a
            user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
          */''}
          <link rel="manifest" href="/manifest.json">
          <link rel="shortcut icon" href="/favicon.ico">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700">
          <link rel="stylesheet" href="https://use.typekit.net/dpu7doa.css">
          <meta name="msapplication-TileColor" content="${theme.colors.primary}">
          <meta name="theme-color" content="${theme.colors.primary}">
        `}
        <style type="text/css" id="jss-preinit">${css}</style>
      </head>
      <body>
        <div id="root">
          ${renderedHtml}
        </div>
        <script type="application/json" id="redux-preinit">${jsonState}</script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        ${scripts}
      </body>
    </html>
  `
  return html
}

export default function (options) {
  return asyncHandler(async (req, res, next) => {
    try {
      const html = await render(req, options)
      res.send(html)
    } catch (err) {
      console.error(err)
      res.status(500).send(err ? err.message : 'Server error')
    }
  })
}
