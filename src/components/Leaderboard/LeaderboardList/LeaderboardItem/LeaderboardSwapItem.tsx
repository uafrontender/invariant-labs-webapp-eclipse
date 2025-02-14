import React from 'react'
import { alpha, Box, Grid, Typography, useMediaQuery } from '@mui/material'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import LaunchIcon from '@mui/icons-material/Launch'
import { colors, theme, typography } from '@static/theme'
import { useStyles } from './style'
import { TooltipHover } from '@components/TooltipHover/TooltipHover'
import { shortenAddress } from '@utils/uiUtils'
import { PublicKey } from '@solana/web3.js'
import { Link } from 'react-router-dom'
import { BN } from '@coral-xyz/anchor'
import { formatNumberWithCommas, printBN } from '@utils/utils'
import { LEADERBOARD_DECIMAL, NetworkType } from '@store/consts/static'
import { VariantType } from 'notistack'

interface BaseLeaderboardSwapItemProps {
  displayType: 'item' | 'header'
  currentNetwork: NetworkType
  copyAddressHandler: (message: string, variant: VariantType) => void
}

interface LeaderboardSwapHeaderProps extends BaseLeaderboardSwapItemProps {
  displayType: 'header'
}

interface LeaderboardSwapItemDetailProps extends BaseLeaderboardSwapItemProps {
  displayType: 'item'
  isYou?: boolean
  hideBottomLine?: boolean
  points?: string
  swaps?: number
  last24hPoints?: string
  rank?: number
  address?: PublicKey
  domain?: string
}

export type LeaderboardSwapItemProps = LeaderboardSwapHeaderProps | LeaderboardSwapItemDetailProps

const PLACE_COLORS = [colors.invariant.yellow, colors.invariant.silver, colors.invariant.bronze]

const LeaderboardSwapHeader: React.FC = () => {
  const { classes } = useStyles()
  const isMd = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container classes={{ container: classes.container, root: classes.header }}>
      <Typography style={{ lineHeight: '11px' }}>Rank</Typography>
      <Typography style={{ cursor: 'pointer' }}>Address</Typography>
      <Typography style={{ cursor: 'pointer' }}>Swap points</Typography>
      {!isMd && (
        <>
          <Typography style={{ cursor: 'pointer' }}>Swaps counts</Typography>
          <Typography style={{ cursor: 'pointer' }}>24H points</Typography>
        </>
      )}
    </Grid>
  )
}

const LeaderboardSwapItem: React.FC<LeaderboardSwapItemProps> = props => {
  const { displayType, copyAddressHandler, currentNetwork } = props
  const { classes } = useStyles()

  const isMd = useMediaQuery(theme.breakpoints.down('md'))
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isNarrowMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'))

  const pointOneValue = new BN(10).pow(new BN(LEADERBOARD_DECIMAL)).div(new BN(10))
  if (displayType === 'header') {
    return <LeaderboardSwapHeader />
  }

  const {
    rank = 0,
    points,
    isYou = false,
    address = '',
    last24hPoints = 0,
    swaps = 0,
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
        copyAddressHandler('Address copied!', 'success')
      })
      .catch(() => {
        copyAddressHandler('Failed to copy address!', 'error')
      })
  }

  const shortDomain = domain && domain.slice(0, 13) + '...'

  return (
    <Grid maxWidth='100%'>
      <Grid
        container
        classes={{ container: classes.container }}
        style={{
          border: hideBottomLine ? 'none' : undefined,
          background: isYou ? alpha(colors.invariant.light, 0.2) : 'transparent',
          paddingLeft: isYou ? (isVerySmallScreen ? 12 : 24) : 0,
          paddingRight: isYou ? (isVerySmallScreen ? 12 : 24) : 0
        }}>
        <Typography style={{ color: getColorByPlace(rank) }}>{rank}</Typography>

        <Typography>
          {domain
            ? isVerySmallScreen || isNarrowMediumScreen
              ? shortDomain
              : domain
            : shortenAddress(address.toString(), 4)}
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
        {!isMd && <Typography>{swaps}</Typography>}

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

export default LeaderboardSwapItem
