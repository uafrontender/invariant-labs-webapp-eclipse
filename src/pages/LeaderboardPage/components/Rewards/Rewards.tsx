import { Box, Button, Typography } from '@mui/material'
import { useStyles } from './styles'
import LaunchIcon from '@mui/icons-material/Launch'
import { colors } from '@static/theme'
import icons from '@static/icons'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { leaderboardSelectors } from '@store/selectors/leaderboard'
import { status } from '@store/selectors/solanaWallet'
import { Status } from '@store/reducers/solanaWallet'
import { actions as walletActions } from '@store/reducers/solanaWallet'

import ChangeWalletButton from '@components/Header/HeaderButton/ChangeWalletButton'
import { Link } from 'react-router-dom'
import { BN } from '@coral-xyz/anchor'
import { LEADERBOARD_DECIMAL } from '@pages/LeaderboardPage/config'
import { formatNumberWithCommas, trimZeros, printBN } from '@utils/utils'
export const Rewards = () => {
  const { classes } = useStyles()
  const currentUser = useSelector(leaderboardSelectors.currentUser)
  const walletStatus = useSelector(status)
  const dispatch = useDispatch()
  const isConnected = useMemo(() => walletStatus === Status.Initialized, [walletStatus])
  return (
    <Box className={classes.infoContainer}>
      <Box style={{ width: 'auto' }}>
        <Typography className={classes.header}>Rewards</Typography>
        <>
          <Typography className={classes.description}>
            Welcome to the Rewards Tab! Here, you’ll be able to claim airdrops for being an early
            user on Invariant. Your allocation will depend on the number of points you’ve accrued.
          </Typography>
          <Box style={{ marginTop: '64px' }}>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={icons.airdrop} style={{ height: '48px', marginRight: '24px' }} />
              <Typography
                style={{
                  color: colors.invariant.textGrey,
                  fontSize: '20px',
                  fontWeight: 400,
                  lineHeight: '24px',
                  letterSpacing: '-3%'
                }}>
                You have now:
              </Typography>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
              <Typography className={classes.pointsValue}>
                {formatNumberWithCommas(
                  trimZeros(printBN(new BN(currentUser?.points, 'hex') ?? 0, LEADERBOARD_DECIMAL))
                )}
                points
              </Typography>
              <Box style={{ width: '250px' }}>
                <Box sx={{ marginTop: '8px' }}>
                  <ChangeWalletButton
                    isDisabled={isConnected}
                    name={!isConnected ? 'Connect Wallet' : 'Claim'}
                    onConnect={() => {
                      dispatch(walletActions.connect(false))
                    }}
                    connected={false}
                    onDisconnect={() => {}}
                    className={classes.connectWalletButton}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Typography
            className={classes.description}
            style={{
              marginTop: '64px',
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}>
            If you want to learn more about rewards and points distribution, check out our docs.
            <Link
              to='https://docs.invariant.app/docs/invariant_points/mechanism'
              target='_blank'
              style={{ textDecoration: 'none' }}>
              <Button className={classes.button} style={{ marginTop: '32px' }}>
                Learn More <LaunchIcon classes={{ root: classes.clipboardIcon }} />
              </Button>
            </Link>
          </Typography>
        </>
      </Box>
    </Box>
  )
}
