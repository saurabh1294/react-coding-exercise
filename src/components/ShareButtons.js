import React, { useCallback, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { createIsFavouritedSelector } from '../selectors'
import { toggleFavouriteActionCreator } from '../actions'
import theme from '../style/theme'
import { ReactComponent as FacebookIcon } from '../icons/facebook.svg'
import { ReactComponent as TwitterIcon } from '../icons/twitter.svg'
import { ReactComponent as HeartIcon } from '../icons/heart.svg'
import { ReactComponent as EmptyHeartIcon } from '../icons/heart-o.svg'
import map from 'lodash/map'
import color from 'color'
import { round } from '../helpers/math'
import detectIt from 'detect-it'

const popupWindowProps = url => ({
  url,
  onClick: e => {
    window.open(url, 'fbShareWindow', 'height=450, width=550, toolbar=0, menubar=0, directories=0, scrollbars=0')
    e.preventDefault()
  }
})

const ShareButtons = ({ children, className, id, url, title }) => {
  const classes = useStyles()
  const isFavouritedSelector = useCallback(createIsFavouritedSelector(id), [id])
  const isFavourited = useSelector(isFavouritedSelector)
  const dispatch = useDispatch()
  const toggleFavourited = useCallback(() => {
    console.log('clicked')
    dispatch(toggleFavouriteActionCreator(id))
  }, [id])

  const social = useMemo(() => [{
    ...popupWindowProps(`https://facebook.com/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`),
    Icon: FacebookIcon,
    text: 'Facebook'
  }, {
    url: `https://twitter.com/share?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    Icon: TwitterIcon,
    text: 'Twitter'
  }], [url, title])

  return (
    <div className={className}>
      {map(social, ({ url, Icon, text, onClick }) =>
        <a key={text} className={classes.socialLink} href={url} target='_blank' rel='noopener noreferrer' onClick={onClick}>
          <Icon className={classes.socialIcon} />
          <span className='sr-only'>{text}</span>
        </a>
      )}
      <button className={classNames(classes.socialLink, classes.favouriteButton)} type='button' onClick={toggleFavourited}>
        <span className={classNames(classes.favouriteIconHolder, isFavourited && classes.favouritedIconHolder, !isFavourited && classes.unfavouritedIconHolder)}>
          <HeartIcon className={classNames(classes.favouriteIcon, classes.fullHeartIcon)} />
          <EmptyHeartIcon className={classNames(classes.favouriteIcon, classes.emptyHeartIcon)} />
        </span>
      </button>
      {children}
    </div>
  )
}

const em = px => round(px / 16) + 'em'
const useStyles = createUseStyles({
  socialLink: {
    color: theme.colors.black,
    width: em(30),
    height: em(30),
    padding: 0,
    cursor: 'pointer',
    outline: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    transition: 'color 0.2s ease-out'
  },
  socialIcon: {
    width: em(16),
    height: em(16),
    fill: 'currentColor'
  },
  favouriteButton: {
    appearance: 'none', // override normalize
    backgroundColor: 'transparent',
    border: 0,
    color: theme.colors.primary,
    ...(detectIt.primaryInput === 'touch' ? undefined : {
      '&:hover': {
        '& > $favouritedIconHolder': {
          '& > $fullHeartIcon': {
            color: color(theme.colors.primary).fade(0.5).rgb().toString()
          }
        },
        '& > $unfavouritedIconHolder': {
          '& > $fullHeartIcon': {
            color: color(theme.colors.primary).fade(0.8).rgb().toString()
          }
        }
      }
    })
  },
  favouriteIconHolder: {
    display: 'block',
    position: 'relative',
    width: em(20),
    height: em(20)
  },
  favouritedIconHolder: {
    '& > $fullHeartIcon': {
      color: theme.colors.primary
    }
  },
  unfavouritedIconHolder: {},
  favouriteIcon: {
    display: 'block',
    position: 'absolute',
    width: '100%',
    height: '100%',
    fill: 'currentColor'
  },
  fullHeartIcon: {
    color: color(theme.colors.primary).fade(1).rgb().toString()
  }
}, { name: 'ShareButtons' })

export default ShareButtons
