import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => {
  return {
    input: {
      padding: '11px 12px',
      width: '100%',
      boxSizing: 'border-box',
      ...typography.body2,
      outline: 'none',
      marginRight: -8,
      fontFamily: 'Mukta',
      outlineStyle: 'none',
      fontSize: 16,
      border: '1px solid transparent',
      backgroundColor: colors.invariant.newDark,
      color: colors.invariant.lightGrey,
      borderRadius: 8,
      cursor: 'pointer',
      '&::placeholder': {
        color: colors.invariant.textGrey
      },
      '&:focus': {
        color: colors.white.main
      },
      '& textarea': {
        overflow: 'auto !important',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: colors.invariant.newDark
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: colors.invariant.lightGrey,
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: colors.invariant.textGrey
          }
        }
      }
    },
    inputError: {
      border: `1px solid ${colors.red.main}`,
      '&:focus': {
        border: `1px solid ${colors.red.main}`
      }
    },
    headerTitle: {
      fontFamily: 'Mukta',
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: '24px',
      display: 'flex',
      alignItems: 'center',
      letterSpacing: '-0.03em',
      color: colors.invariant.text,
      marginBottom: '8px'
    },
    inputWrapper: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: 'fit-content'
    },
    inputContainer: {
      height: '80px',
      overflowY: 'auto'
    },
    errorMessage: {
      color: colors.red.main,
      fontSize: '14px',
      lineHeight: '20px',
      minHeight: '20px'
    }
  }
})

export default useStyles
