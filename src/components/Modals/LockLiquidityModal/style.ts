import { Theme } from '@mui/material'
import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => {
  return {
    popover: {
      marginTop: 'max(calc(50vh - 247px), 0px)',
      marginLeft: 'calc(50vw - 336px)',
      [theme.breakpoints.down(671)]: {
        display: 'flex',
        marginLeft: 'auto',
        justifyContent: 'center'
      }
    },
    backgroundContainer: {
      background: colors.invariant.component,
      borderRadius: 20,
      width: 671,
      [theme.breakpoints.down(671)]: {
        maxWidth: '100vw'
      }
    },
    container: {
      width: '100%',
      overflow: 'hidden',
      padding: 24,
      background: colors.invariant.mixedLinearGradient,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: 32
    },
    lockPositionHeader: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      '& h1': {
        ...typography.heading2,
        flex: 1,
        textAlign: 'center'
      }
    },
    lockExplanation: {
      minHeight: 160,
      color: '#A9B6BF',
      ...typography.body2,
      textWrap: 'wrap'
    },
    lockWarningText: { textWrap: 'wrap', ...typography.body2 },
    lockPositionClose: {
      position: 'absolute',
      right: 0,
      minWidth: 0,
      height: 20,
      '&:after': {
        content: '"\u2715"',
        fontSize: 22,
        position: 'absolute',
        color: 'white',
        top: '50%',
        right: '0%',
        transform: 'translateY(-50%)'
      },
      '&:hover': {
        backgroundColor: '#1B191F'
      }
    },
    paper: {
      background: 'transparent',
      boxShadow: 'none',
      maxWidth: 671,
      maxHeight: '100vh',
      '&::-webkit-scrollbar': {
        width: 6,
        background: colors.invariant.component
      },
      '&::-webkit-scrollbar-thumb': {
        background: colors.invariant.light,
        borderRadius: 6
      }
    },
    lockWarning: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 12,
      paddingRight: 12,
      paddingLeft: 12,
      ...typography.body2,
      textTransform: 'none',
      background: colors.invariant.Error,
      borderRadius: 8,
      minHeight: 40,
      width: '100%',
      letterSpacing: -0.03
    },
    lockButton: {
      color: colors.invariant.black,
      ...typography.body1,
      textTransform: 'none',
      background: colors.invariant.pinkLinearGradientOpacity,
      marginTop: -8,
      borderRadius: 16,
      height: 46.5,
      width: '100%',
      letterSpacing: -0.03,
      '&:hover': {
        background: colors.invariant.pinkLinearGradient,
        boxShadow: `0 0 16px ${colors.invariant.pink}`,
        '@media (hover: none)': {
          background: colors.invariant.pinkLinearGradientOpacity,
          boxShadow: 'none'
        }
      }
    },
    buttonText: {
      WebkitPaddingBefore: '2px',
      [theme.breakpoints.down('sm')]: {
        WebkitPaddingBefore: 0
      }
    },
    positionDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    },
    positionDetailsTitle: {
      color: '#A9B6BF',
      ...typography.body1
    },
    icon: {
      width: 40,
      borderRadius: '100%',
      [theme.breakpoints.down('sm')]: {
        width: 22
      }
    },
    arrowIcon: {
      width: 32,
      marginRight: 4,
      marginLeft: 4,
      height: 32,
      borderRadius: '100%',
      padding: 4,
      [theme.breakpoints.down('sm')]: {
        width: 15,
        height: 15,
        padding: 2,
        marginRight: 2,
        marginLeft: 2
      }
    },
    name: {
      ...typography.heading2,
      color: colors.invariant.text,
      textWrap: 'nowrap',
      textAlign: 'center',
      [theme.breakpoints.down('sm')]: {
        ...typography.heading3
      }
    },
    pairInfo: {
      background: colors.invariant.newDark,
      width: '100%',
      padding: 12,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 12
    },
    pairDisplay: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      paddingTop: 8,
      paddingBottom: 8,
      flex: '0 0 auto'
    },
    pairDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flex: 1
    },
    icons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
      height: 40,
      [theme.breakpoints.down('sm')]: {
        height: 22
      }
    },
    pairMinMax: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 36,
      borderRadius: 11,
      background: colors.invariant.light,
      padding: 8
    },
    pairValues: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      width: '100%'
    },
    pairFee: {
      flex: '0 1 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 11,
      background: colors.invariant.green,
      height: 36,
      color: colors.invariant.black,
      ...typography.body1,
      padding: '0 8px',
      textAlign: 'center'
    },
    pairRange: {
      flex: '1 1 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 11,
      background: colors.invariant.light,
      height: 36,
      padding: '0 8px',
      textAlign: 'center'
    },
    pairValue: {
      flex: '1 1 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 11,
      background: colors.invariant.light,
      height: 36,
      padding: '0 8px',
      textAlign: 'center'
    },
    normalText: {
      color: colors.invariant.textGrey,
      ...typography.body1
    },
    greenText: {
      color: colors.invariant.green,
      ...typography.body1
    }
  }
})

export default useStyles
