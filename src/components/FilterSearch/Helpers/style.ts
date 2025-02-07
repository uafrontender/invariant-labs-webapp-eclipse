import { Theme } from '@mui/material'
import { typography, colors } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((_theme: Theme) => ({
  commonTokenIcon: {
    width: 24,
    borderRadius: '50%'
  },
  commonTokenContainer: {
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: 12,
    height: 24,
    alignItems: 'center',
    display: 'flex',
    padding: '6px 12px 6px 12px',
    gap: 8,
    background: colors.invariant.dark,
    '&:hover': {
      background: colors.invariant.light,
      '@media (hover: none)': {
        background: colors.invariant.newDark
      }
    }
  },
  commonTokenLabel: {
    ...typography.body2,
    color: colors.invariant.text
  },
  boxChip: {
    display: 'flex',
    padding: '2px 4px 2px 4px',
    borderRadius: 8,
    gap: 8,
    margin: 4,

    height: 26,
    maxHeight: 26,
    justifyContent: 'center',
    alignItems: 'center',
    background: colors.invariant.component
  },
  avatarChip: {
    width: 14,
    height: 14,
    borderRadius: '50%'
  },
  typographyChip: {
    ...typography.body2,
    color: colors.invariant.text
  },
  closeIcon: {
    cursor: 'pointer',
    transition: 'opacity 0.2s ease-in-out',
    '&:hover': {
      opacity: 0.7
    }
  },

  tokenContainer: {
    width: '100%',
    height: 54,
    display: 'flex',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
    padding: '8px',
    '&:hover': {
      background: colors.invariant.lightHover2
    }
  },
  searchResultIcon: {
    width: 36,
    height: 36,
    marginRight: 8,
    borderRadius: '50%'
  },
  tokenLabel: {
    ...typography.heading3
  },
  tokenAddress: {
    backgroundColor: colors.invariant.newDark,
    borderRadius: 4,
    padding: '2px 4px',
    width: 'min-content',
    height: 'min-content',
    '& a': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      textDecoration: 'none',

      '&:hover': {
        filter: 'brightness(1.2)',
        '@media (hover: none)': {
          filter: 'none'
        }
      },
      '& p': {
        color: colors.invariant.lightGrey,
        ...typography.caption4,
        letterSpacing: '0.03em'
      }
    }
  },
  tokenName: {
    ...typography.caption2,
    color: colors.invariant.textGrey
  },
  balaceLabel: {
    ...typography.body2,
    color: colors.invariant.textGrey
  }
}))

export default useStyles
