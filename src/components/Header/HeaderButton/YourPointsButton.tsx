import React from 'react'
import useStyles from './style'
import { blurContent, unblurContent } from '@utils/uiUtils'
import { Button, useMediaQuery } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import YourPointsModal from '@components/Modals/YourPointsModal/YourPointsModals'
import { theme } from '@static/theme'
import { useSelector } from 'react-redux'
import { leaderboardSelectors } from '@store/selectors/leaderboard'
import { formatLargeNumber } from '@utils/formatBigNumber'
import { LEADERBOARD_DECIMAL } from '@pages/LeaderboardPage/config'
import { printBN, trimZeros } from '@utils/utils'
import { BN } from '@coral-xyz/anchor'
import { network } from '@store/selectors/solanaConnection'
import { NetworkType } from '@store/consts/static'

export interface IProps {
  disabled?: boolean
}
export const YourPointsButton: React.FC<IProps> = ({ disabled = false }) => {
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))
  const { classes } = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [openNetworks, setOpenNetworks] = React.useState<boolean>(false)
  const currentUser = useSelector(leaderboardSelectors.currentUser)
  const currentNetwork = useSelector(network)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    blurContent()
    setOpenNetworks(true)
  }

  const handleClose = () => {
    unblurContent()
    setOpenNetworks(false)
  }

  return (
    <>
      <Button
        className={classes.pointsHeaderButton}
        variant='contained'
        classes={{ disabled: classes.disabled }}
        disabled={disabled}
        onClick={handleClick}>
        <>
          {isSm ? (
            <KeyboardArrowDownIcon id='downIcon' />
          ) : currentNetwork === NetworkType.Mainnet ? (
            `Points: ${trimZeros(formatLargeNumber(+printBN(new BN(currentUser?.points, 'hex'), LEADERBOARD_DECIMAL))) ?? 0}`
          ) : (
            'Points'
          )}
        </>
      </Button>
      <YourPointsModal open={openNetworks} anchorEl={anchorEl} handleClose={handleClose} />
    </>
  )
}
