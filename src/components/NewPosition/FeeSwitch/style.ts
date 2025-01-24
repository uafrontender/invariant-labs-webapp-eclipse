import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()(() => {
  return {
    wrapper: {
      width: '100%',
      borderRadius: 13,
      backgroundColor: colors.invariant.componentBcg,
      marginBottom: 8
    },
    bestText: {
      color: colors.invariant.green,
      position: 'absolute',
      ...typography.caption1,
      textAlign: 'center',
      top: 40
    }
  }
})

export const useTabsStyles = makeStyles()(() => {
  return {
    root: {
      overflow: 'visible',
      height: 36,
      minHeight: 36,
      margin: '4px 4px',
      borderRadius: 10
    },
    indicator: {
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.invariant.light,
      top: 0
    },
    flexContainer: {
      justifyContent: 'space-between'
    },
    scrollButtons: {
      width: 24,
      '& svg': {
        fill: colors.invariant.light
      },
      '&:hover svg': {
        fill: colors.invariant.text
      }
    }
  }
})

export const useSingleTabStyles = makeStyles()(() => {
  return {
    root: {
      zIndex: 1,
      textTransform: 'none',
      ...typography.body3,
      height: 36,
      minHeight: 36,
      color: colors.invariant.light,
      paddingInline: 0,
      minWidth: 65,
      width: 65,
      marginRight: '7px',
      position: 'relative',
      overflow: 'visible',

      '&:hover': {
        color: colors.invariant.lightHover,
        backgroundColor: colors.invariant.light,
        height: 36,
        borderRadius: 10,
        '@media (hover: none)': {
          color: colors.invariant.light
        }
      },

      '&:last-of-type': {
        marginRight: 0
      }
    },
    best: {
      color: colors.invariant.green,
      border: `2px solid ${colors.invariant.green}`,
      borderRadius: 10,

      '&:hover': {
        color: colors.invariant.green
      }
    },
    promoted: {
      color: colors.invariant.pink,
      borderRadius: 10,
      border: '2px solid transparent',
      backgroundImage: `linear-gradient(${colors.invariant.newDark},${colors.invariant.newDark}), linear-gradient(0deg, #2EE09A, #EF84F5)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      '&:hover': {
        color: colors.invariant.pink,
        backgroundImage:
          'linear-gradient(#2A365C, #2A365C), linear-gradient(0deg, #2EE09A, #EF84F5)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      },
      '&.Mui-selected': {
        backgroundImage:
          'linear-gradient(#2A365C, #2A365C), linear-gradient(0deg, #2EE09A, #EF84F5)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }
    },
    selected: {
      ...typography.heading4,
      color: colors.white.main + ' !important',
      transition: 'color 300ms',

      '&:hover': {
        color: colors.white.main
      }
    }
  }
})

export default useStyles
