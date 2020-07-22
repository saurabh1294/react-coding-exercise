import React from 'react'
import { createUseStyles } from 'react-jss'
import { useSelector } from 'react-redux'
import { getEvents, isEventsReady } from '../selectors'
import { ReactComponent as TitleIcon } from '../icons/vivid-angle-top-left.svg'
import theme from '../style/theme'
import Event from './Event'

const Events = () => {
  const classes = useStyles()
  const ready = useSelector(isEventsReady)
  const events = useSelector(getEvents)

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>
        <TitleIcon className={classes.titleIcon} />
        {events[0]?.error ? 'Filter not yet implemented' : `Results: ${events && events.length} Events Found`}
      </h3>
      {!ready && (
        <div
          className={
            !ready && !events[0]?.error
              ? classes.loader
              : classes.loaderHide
          }
        />
      )}
      {ready && (
        <div className={classes.tilesWrapper}>
          <div className={classes.tiles}>
            {events.map(event => <Event key={event.id} className={classes.tile} content={event} />)}
          </div>
        </div>
      )}
    </div>
  )
}

const useStyles = createUseStyles({
  title: {
    paddingLeft: 20,
    position: 'relative'
  },
  titleIcon: {
    position: 'absolute',
    left: 0,
    top: 5,
    width: 11,
    height: 11,
    fill: 'currentColor'
  },
  tilesWrapper: {
    margin: [0, 'auto'],
    maxWidth: theme.maxTileWidth,
    '@media (min-width: 768px)': {
      maxWidth: theme.maxTileWidth * 2 + theme.gutter
    },
    '@media (min-width: 1200px)': {
      maxWidth: theme.maxTileWidth * 3 + theme.gutter * 2
    }
  },
  tiles: {
    '@media (min-width: 768px)': {
      marginLeft: -theme.gutter / 2,
      marginRight: -theme.gutter / 2,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    }
  },

  tile: {
    margin: [0, 'auto', theme.gutter],
    maxWidth: theme.maxTileWidth,
    '@media (min-width: 768px)': {
      marginLeft: theme.gutter / 2,
      marginRight: theme.gutter / 2,
      width: `calc(50% - ${theme.gutter}px)`
    },
    '@media (min-width: 1200px)': {
      width: `calc(${100 / 3}% - ${theme.gutter}px)`
    }
  },
  loader: {
    position: 'fixed',
    zIndex: 999,
    top: 'calc(50% - 4em)',
    left: 'calc(50% - 4em)',
    width: '10em',
    height: '10em',
    border: '1.1em solid rgba(0, 0, 0, 0.2)',
    borderLeft: '1.1em solid #000000',
    borderRadius: '50%',
    animationDuration: '2s',
    animation: '$load8 100000ms linear infinite',
    transition: 'opacity 0.3s'
  },
  loaderHide: {
    opacity: '0'
  },
  '@keyframes load8': {
    '0%': {
      transform: 'rotate(0deg)'
    },

    '100%': {
      transform: 'rotate(360deg)'
    }
  }
}, { name: 'Events' })

export default Events
