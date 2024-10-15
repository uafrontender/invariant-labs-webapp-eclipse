import { Theme } from '@mui/material/styles'
import { colors, typography } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
  input: {
    ...typography.body2,
    width: '100%',
    padding: '11px 12px',
    boxSizing: 'border-box',
    fontFamily: 'Mukta',
    fontSize: 16,
    outline: 'none',
    border: '1px solid transparent',
    backgroundColor: colors.invariant.newDark,
    color: colors.invariant.lightGrey,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'color 0.3s ease, border-color 0.3s ease',

    '&::placeholder': {
      color: colors.invariant.textGrey
    },
    '&:focus': {
      color: colors.white.main,
      borderColor: colors.invariant.lightGrey
    }
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '110px',
    '&:focus': {
      color: colors.white.main
    }
  },
  headerTitle: {
    fontFamily: 'Mukta',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '24px',
    letterSpacing: '-0.03em',
    color: colors.invariant.text,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center'
  },
  inputContainer: {
    height: '80px',
    overflowY: 'auto'
  },
  labelContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: theme.spacing(1)
  },
  requiredDot: {
    position: 'absolute',
    top: 15,
    right: -5,
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'red',
    boxShadow: '0 0 0 rgba(255, 0, 0, 0.4)',
    animation: '$glowing 2s infinite'
  },
  '@keyframes glowing': {
    '0%': { boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.4)' },
    '70%': { boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)' }
  },
  inputError: {
    border: `1px solid ${colors.invariant.Error}`,
    '&:focus': {
      border: `1px solid ${colors.invariant.Error}`
    }
  },
  infoIcon: {
    color: colors.invariant.Error,
    fontSize: '18px'
  },
  errorMessageContainer: {
    minHeight: '20px',
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start'
  },
  errorMessage: {
    color: colors.invariant.Error,
    fontSize: 12,
    marginTop: 4,
    width: '100%'
  },
  errorIndicator: {
    color: colors.invariant.Error
  }
}))

export default useStyles
