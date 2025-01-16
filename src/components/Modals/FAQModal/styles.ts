import { colors, theme, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    modalContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 1300
    },
    popoverRoot: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto'
    },
    paper: {
      position: 'relative',
      margin: 'auto',
      maxWidth: '90%',
      background: 'transparent',
      boxShadow: 'none',
      overflow: 'visible'
    },
    root: {
      background: `
        radial-gradient(49.85% 49.85% at 50% 100%, rgba(46, 224, 154, 0.25) 0%, rgba(46, 224, 154, 0) 75%),
        radial-gradient(50.2% 50.2% at 50% 0%, rgba(239, 132, 245, 0.25) 0%, rgba(239, 132, 245, 0) 75%),
        ${colors.invariant.component}
      `,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      width: 623,
      maxWidth: '100%',
      height: 'max-content',
      borderRadius: 24,
      padding: 24,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.5)',
      gap: 24,
      [theme.breakpoints.down('sm')]: {
        width: 'calc(100% - 32px)',
        padding: '16px 20px'
      },

      li: {
        color: colors.invariant.textGrey
      }
    },
    title: {
      ...typography.heading2,
      textAlign: 'center',
      marginInline: 32,
      minWidth: 320,
      [theme.breakpoints.down('md')]: {
        minWidth: 'auto',
        marginInline: 8
      }
    },
    titleContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: 'auto'
    },
    subTitle: {
      ...typography.body2,
      color: colors.invariant.textGrey,
      textAlign: 'center'
    },
    buttonList: {
      marginTop: 12
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: 24
    },
    buttonPrimary: {
      height: 40,
      width: 200,
      pointerEvents: 'auto',

      marginTop: '5px',
      color: colors.invariant.componentBcg,
      ...typography.body1,
      textTransform: 'none',
      borderRadius: 14,
      background: colors.invariant.pinkLinearGradientOpacity,

      '&:hover': {
        background: colors.invariant.pinkLinearGradient,
        boxShadow: '0px 0px 16px rgba(239, 132, 245, 0.35)',
        '@media (hover: none)': {
          background: colors.invariant.pinkLinearGradientOpacity,
          boxShadow: 'none'
        }
      }
    },

    topCloseButton: {
      pointerEvents: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',
      '&:hover': {
        cursor: 'pointer',
        filter: 'brightness(1.5)'
      }
    },

    bottomCloseButton: {
      pointerEvents: 'auto',
      textDecoration: 'none',
      '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline'
      },
      marginTop: '10px',
      borderBottomColor: colors.invariant.light,
      color: colors.invariant.textGrey
    },
    arrowBtn: {
      background: 'none',
      outline: 'none',
      border: 'none',
      padding: 0,
      '&:hover': {
        cursor: 'pointer',
        filter: 'brightness(1.5)'
      }
    },
    text: {
      ...typography.body3,
      letterSpacing: '-0.6px',
      color: colors.invariant.textGrey
    }
  }
})

export default useStyles
