import get from 'lodash/get'
import React from 'react'
import cn from 'classnames'
import { createUseStyles } from 'react-jss'
import { round } from '../helpers/math'
import defaultImage from '../images/spacer'

const Picture = ({ classes, alt, sizes }) => {
  const hasWebp = !!get(sizes, [0, 'webpUrl'])
  const srcset = key => sizes.map(item => (`${item[key]} ${item.width}w`)).join()
  return (
    <picture>
      {hasWebp && <source {...{ 'data-srcset': srcset('webpUrl') }} type='image/webp' />}
      {sizes && <source {...{ 'data-srcset': srcset('url') }} />}
      <img
        data-sizes='auto'
        alt={alt}
        className={cn(sizes && 'lazyload', classes.image)}
        src={defaultImage}
      />
    </picture>
  )
}

const NoScript = ({ classes, alt, sizes }) => {
  if (sizes) {
    return (
      <noscript>
        <img
          src={sizes[sizes.length - 1].url}
          srcSet={sizes.map(item => (`${item.url} ${item.width}w`)).join()}
          className={classes.image}
          alt={alt}
        />
      </noscript>
    )
  }
  return null
}

const ResponsiveImage = React.forwardRef(function ResponsiveImage ({ aspect, children, className, alt, images }, ref) {
  const classes = useStyles({ aspect })
  return (
    <div className={cn(classes.container, className)} ref={ref}>
      <Picture classes={classes} alt={alt} sizes={images} />
      <NoScript classes={classes} alt={alt} sizes={images} />
      {children}
    </div>
  )
})

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    width: '100%',
    display: 'block',
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
    '&::before': {
      display: 'block',
      content: ({ aspect }) => aspect ? '""' : undefined,
      paddingTop: ({ aspect }) => aspect ? `${round(100 / aspect)}%` : undefined
    }
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'all 0.3s',
    objectFit: 'cover',
    fontFamily: '"object-fit: cover;"', // object-fit polyfill
    opacity: 0,
    '&.lazyloaded': {
      opacity: 1
    }
  },
  link: {
    textDecoration: 'none'
  }
}, { name: 'ResponsiveImage' })

export default ResponsiveImage
