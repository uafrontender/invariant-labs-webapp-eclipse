import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    footer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '35px 0',
      position: 'relative',
      zIndex: 50
    },
    footerItem: {
      margin: '0 10px',
      opacity: '.25',
      transition: '.2s all',
      '&:hover': {
        opacity: 1,
        transform: 'scale(1.1) rotate(10deg)',
        '@media (hover: none)': {
          opacity: 0.5,
          transform: 'none'
        }
      }
    },
    footerLink: {
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    tooltip: {
      color: colors.invariant.textGrey,
      ...typography.caption4,
      lineHeight: '24px',
      background: colors.black.full,
      borderRadius: 12,
      height: 24,
      width: 59,
      padding: 0,
      textAlign: 'center'
    },
    icon: {
      height: 40,
      width: 40
    }
  }
})

export default useStyles
