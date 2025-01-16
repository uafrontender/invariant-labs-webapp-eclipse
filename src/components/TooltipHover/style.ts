import { makeStyles } from 'tss-react/mui'
import { colors, typography } from '@static/theme'

const useStyles = makeStyles<{ top?: number }>()((_theme, { top }) => ({
  tooltip: {
    color: colors.invariant.textGrey,
    ...typography.caption4,
    lineHeight: '24px',
    background: colors.black.full,
    borderRadius: 12,
    width: 'max-content',
    textAlign: 'center',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: top ? top : -30
  },
  tooltipGradient: {
    position: 'relative',
    borderRadius: 14,
    background: colors.invariant.component,
    ...typography.body2,
    color: colors.invariant.textGrey,
    padding: '16px 24px',
    top: top ? top : -30,

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-2px', // border thickness
      left: '-2px',
      right: '-2px',
      bottom: '-2px',
      zIndex: -1,
      borderRadius: 14,
      background: colors.invariant.pinkGreenLinearGradient,
      boxSizing: 'border-box'
    }
  }
}))

export default useStyles
