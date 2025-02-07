import { Theme } from '@mui/material'
import { typography, colors } from '@static/theme'
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles<{ fullWidth: boolean; isSmall: boolean }>()(
  (_theme: Theme, { fullWidth, isSmall }) => ({
    searchBar: {
      minHeight: 32,
      borderRadius: 10,
      padding: 4,
      marginBottom: 8,
      background: colors.invariant.black,
      border: '1px solid #202946',
      color: colors.invariant.light,
      transition: 'width 0.3s ease-in-out',
      width: isSmall ? '100%' : fullWidth ? 424 : 221,
      display: 'flex',
      alignItems: 'center'
    },
    searchIcon: {
      width: 17,
      paddingRight: '10px'
    },

    paper: {
      width: isSmall ? '100%' : 392,
      maxWidth: isSmall ? '100%' : 392,
      boxShadow: 'none',
      padding: '16px 16px 10px 16px',

      marginTop: 8,
      background: colors.invariant.bodyBackground
    },

    header: {
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 10,
      padding: 2
    },
    headerText: {
      ...typography.body2,
      color: colors.invariant.textGrey
    },
    commonTokens: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    },
    divider: {
      background: colors.invariant.light,
      height: 1,
      width: 'fullWidth',
      marginBottom: 16
    },

    liqudityLabel: { ...typography.body2, color: colors.invariant.textGrey },
    tokenLabel: {
      ...typography.heading3
    },
    labelContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 4px 2px 4px'
    },
    addressLabel: {
      ...typography.caption4,
      color: colors.invariant.textGrey
    },

    feeTierLabel: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    },
    feeTierProcent: {
      ...typography.heading3,
      color: colors.invariant.text
    },
    feeTierText: {
      padding: '2px 4px 2px 4px',
      ...typography.caption4,
      color: colors.invariant.textGrey
    }
  })
)

export default useStyles
