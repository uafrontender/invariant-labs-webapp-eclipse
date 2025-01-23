import React from 'react'
import { alpha, Box, Grid, Typography, useMediaQuery } from '@mui/material'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { actions as snackbarActions } from '@store/reducers/snackbars'
import LaunchIcon from '@mui/icons-material/Launch'
import { colors, theme, typography } from '@static/theme'
import { useStyles } from './style'
import { TooltipHover } from '@components/TooltipHover/TooltipHover'
import { shortenAddress } from '@utils/uiUtils'
import { PublicKey } from '@solana/web3.js'
import { Link } from 'react-router-dom'
import { network } from '@store/selectors/solanaConnection'
import { BN } from '@coral-xyz/anchor'
import { formatNumberWithCommas, printBN } from '@utils/utils'
import { LEADERBOARD_DECIMAL } from '@pages/LeaderboardPage/config'

interface BaseLeaderboardLpItemProps {
  displayType: 'item' | 'header'
}

interface LeaderboardLpHeaderProps extends BaseLeaderboardLpItemProps {
  displayType: 'header'
}

interface LeaderboardLpItemDetailProps extends BaseLeaderboardLpItemProps {
  displayType: 'item'
  isYou?: boolean
  hideBottomLine?: boolean
  points?: string
  positions?: number
  last24hPoints?: string
  rank?: number
  address?: PublicKey
  domain?: string
}

export type LeaderboardLpItemProps = LeaderboardLpHeaderProps | LeaderboardLpItemDetailProps

const PLACE_COLORS = [colors.invariant.yellow, colors.invariant.silver, colors.invariant.bronze]

const LeaderboardLpHeader: React.FC = () => {
  const { classes } = useStyles()
  const isMd = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container classes={{ container: classes.container, root: classes.header }}>
      <Typography style={{ lineHeight: '11px' }}>Rank</Typography>
      <Typography style={{ cursor: 'pointer' }}>Address</Typography>
      <Typography style={{ cursor: 'pointer' }}>Liquidity points</Typography>
      {!isMd && (
        <>
          <Typography style={{ cursor: 'pointer' }}>Positions</Typography>
          <Typography style={{ cursor: 'pointer' }}>24H points</Typography>
        </>
      )}
    </Grid>
  )
}

const LeaderboardLpItem: React.FC<LeaderboardLpItemProps> = props => {
  const { displayType } = props
  const { classes } = useStyles()
  const isMd = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isNarrowMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const currentNetwork = useSelector(network)
  const pointOneValue = new BN(10).pow(new BN(LEADERBOARD_DECIMAL)).div(new BN(10))

  if (displayType === 'header') {
    return <LeaderboardLpHeader />
  }

  const {
    rank = 0,
    points,
    isYou = false,
    address = '',
    last24hPoints = 0,
    positions = 0,
    hideBottomLine = false,
    domain
  } = props

  const getColorByPlace = (index: number) => {
    return index - 1 < PLACE_COLORS.length ? PLACE_COLORS[index - 1] : colors.invariant.text
  }

  const copyToClipboard = () => {
    if (!address) return

    navigator.clipboard
      .writeText(address.toString())
      .then(() => {
        dispatch(
          snackbarActions.add({
            message: 'Address copied!',
            variant: 'success',
            persist: false
          })
        )
      })
      .catch(() => {
        dispatch(
          snackbarActions.add({
            message: 'Failed to copy address!',
            variant: 'error',
            persist: false
          })
        )
      })
  }

  const shortDomain = domain && domain.slice(0, 8) + '...'

  return (
    <Grid maxWidth='100%'>
      <Grid
        container
        classes={{ container: classes.container }}
        style={{
          border: hideBottomLine ? 'none' : undefined,
          background: isYou ? alpha(colors.invariant.light, 0.2) : 'transparent',
          paddingLeft: isYou ? 24 : 0,
          paddingRight: isYou ? 24 : 0
        }}>
        <Typography style={{ color: getColorByPlace(rank) }}>{rank}</Typography>

        <Typography style={{ paddingRight: '24px', width: 'auto' }}>
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: colors.invariant.text
            }}>
            {domain
              ? isVerySmallScreen || isNarrowMediumScreen
                ? shortDomain
                : domain
              : shortenAddress(address.toString(), 4)}{' '}
          </span>

          {isYou ? (
            <Typography style={{ color: colors.invariant.pink, marginLeft: '5px' }}>
              (You)
            </Typography>
          ) : null}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline' }}>
            <TooltipHover text='Copy address'>
              <FileCopyOutlinedIcon
                onClick={copyToClipboard}
                classes={{ root: classes.clipboardIcon }}
              />
            </TooltipHover>
            <TooltipHover text='Open in explorer'>
              <Link
                to={`https://eclipsescan.xyz/token/${address}?cluster=${currentNetwork.toLocaleLowerCase()}`}
                target='_blank'>
                <LaunchIcon classes={{ root: classes.clipboardIcon }} />
              </Link>
            </TooltipHover>
          </Box>
        </Typography>

        <Typography>
          {new BN(points, 'hex').isZero()
            ? 0
            : formatNumberWithCommas(
                Number(printBN(new BN(points, 'hex'), LEADERBOARD_DECIMAL)).toFixed(2)
              )}
        </Typography>
        {!isMd && <Typography>{positions}</Typography>}

        {!isMd && (
          <Typography>
            <Typography
              style={{
                color: colors.invariant.green,
                ...typography.heading4
              }}>
              {new BN(last24hPoints, 'hex').lt(pointOneValue) ? (
                <span style={{ color: colors.invariant.text }}>0</span>
              ) : (
                <span>
                  +{' '}
                  {formatNumberWithCommas(
                    parseFloat(printBN(new BN(last24hPoints, 'hex'), LEADERBOARD_DECIMAL)).toFixed(
                      1
                    )
                  )}
                </span>
              )}
            </Typography>
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}

export default LeaderboardLpItem
