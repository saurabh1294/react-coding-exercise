import React from 'react'
import { createUseStyles } from 'react-jss'
import Events from './Events'
import theme from '../style/theme'

const App = () => {
  useStyles()
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-sm-12'>
          <Events />
        </div>
      </div>
    </div>
  )
}

const useStyles = createUseStyles({
  '@global': {
    body: {
      fontFamily: theme.fonts.body,
      color: theme.colors.text
    },
    'h1, h2, h3, h4, h5, h6': {
      fontFamily: theme.fonts.headings,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: theme.colors.heading
    },
    a: {
      '&:hover': {
        color: theme.colors.primary,
        transition: 'color 0.3s ease-in'
      }
    }
  }
}, { name: 'App' })

export default App
