import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    navbar: {
      display: 'flex',
      width: '100%',
      height: '65px',
      background: colors.invariant.component,
      marginTop: '12px',
      position: 'sticky',
      bottom: 0,
      zIndex: 1200
    },
    navbox: {
      textDecoration: 'none',
      position: 'relative',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '12px',
      alignItems: 'center',
      padding: '10px 0',
      borderRight: `1px solid ${colors.invariant.light}`,
      cursor: 'pointer',

      '& p': {
        ...typography.tiny1
      },
      ':last-child': {
        borderRight: 'none'
      }
    },
    navImg: {
      filter: 'brightness(0) saturate(100%) invert(45%)'
    },
    activeBox: {
      position: 'absolute',
      width: '100%',
      height: 2,
      top: 0,
      left: 0,
      background: colors.invariant.pinkGreenLinearGradient
    }
  }
})

export default useStyles
