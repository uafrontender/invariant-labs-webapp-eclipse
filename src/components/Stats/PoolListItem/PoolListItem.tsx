import React, { useMemo, useRef, useState } from 'react'
import { theme } from '@static/theme'
import { useStyles } from './style'
import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useNavigate } from 'react-router-dom'
import icons from '@static/icons'
import { NetworkType, SortTypePoolList } from '@store/consts/static'
import { TooltipHover } from '@components/TooltipHover/TooltipHover'
import { addressToTicker, parseFeeToPathFee } from '@utils/utils'
import { DECIMAL } from '@invariant-labs/sdk-eclipse/lib/utils'
import { formatNumber } from '@utils/utils'
import { shortenAddress } from '@utils/uiUtils'
import { VariantType } from 'notistack'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import LockStatsPopover from '@components/Modals/LockStatsPopover/LockStatsPopover'
interface IProps {
  TVL?: number
  volume?: number
  fee?: number
  displayType: string
  symbolFrom?: string
  symbolTo?: string
  iconFrom?: string
  iconTo?: string
  tokenIndex?: number
  sortType?: SortTypePoolList
  onSort?: (type: SortTypePoolList) => void
  hideBottomLine?: boolean
  addressFrom?: string
  addressTo?: string
  network: NetworkType
  apy?: number
  apyData?: {
    fees: number
    accumulatedFarmsAvg: number
    accumulatedFarmsSingleTick: number
  }
  isUnknownFrom?: boolean
  isUnknownTo?: boolean
  isLocked?: boolean
  poolAddress?: string
  copyAddressHandler?: (message: string, variant: VariantType) => void
}

const PoolListItem: React.FC<IProps> = ({
  fee = 0,
  volume = 0,
  TVL = 0,
  displayType,
  symbolFrom,
  symbolTo,
  iconFrom,
  iconTo,
  tokenIndex,
  sortType,
  onSort,
  hideBottomLine = false,
  addressFrom,
  addressTo,
  network,
  // apy = 0,
  // apyData = {
  //   fees: 0,
  //   accumulatedFarmsAvg: 0,
  //   accumulatedFarmsSingleTick: 0
  // }
  isUnknownFrom,
  isUnknownTo,
  isLocked,
  poolAddress,
  copyAddressHandler
}) => {
  const { classes } = useStyles()

  const navigate = useNavigate()
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))
  const isMd = useMediaQuery(theme.breakpoints.down('md'))
  const lockIconRef = useRef<HTMLImageElement | null>(null)
  const [isLockPopoverOpen, setLockPopoverOpen] = useState(false)
  const handleOpenPosition = () => {
    navigate(
      `/newPosition/${addressToTicker(network, addressFrom ?? '')}/${addressToTicker(network, addressTo ?? '')}/${parseFeeToPathFee(Math.round(fee * 10 ** (DECIMAL - 2)))}`,
      { state: { referer: 'stats' } }
    )
  }

  const handleOpenSwap = () => {
    navigate(
      `/exchange/${addressToTicker(network, addressFrom ?? '')}/${addressToTicker(network, addressTo ?? '')}`,
      { state: { referer: 'stats' } }
    )
  }

  const networkUrl = useMemo(() => {
    switch (network) {
      case NetworkType.Mainnet:
        return ''
      case NetworkType.Testnet:
        return '?cluster=testnet'
      case NetworkType.Devnet:
        return '?cluster=devnet'
      default:
        return ''
    }
  }, [network])

  const copyToClipboard = () => {
    if (!poolAddress || !copyAddressHandler) {
      return
    }
    navigator.clipboard
      .writeText(poolAddress)
      .then(() => {
        copyAddressHandler('Market ID copied to Clipboard', 'success')
      })
      .catch(() => {
        copyAddressHandler('Failed to copy Market ID to Clipboard', 'error')
      })
  }

  return (
    <Grid maxWidth='100%'>
      {displayType === 'token' ? (
        <Grid
          container
          classes={{ container: classes.container }}
          style={hideBottomLine ? { border: 'none' } : undefined}>
          {!isMd ? <Typography>{tokenIndex}</Typography> : null}
          <Grid className={classes.imageContainer}>
            {!isSm && (
              <Box className={classes.iconsWrapper}>
                {isLocked && (
                  <Box className={classes.iconContainer}>
                    <img
                      className={classes.tokenIcon}
                      onClick={() => {
                        setLockPopoverOpen(true)
                      }}
                      ref={lockIconRef}
                      src={icons.lockIcon}
                      alt='LockIcon'
                    />
                    <LockStatsPopover
                      anchorEl={lockIconRef.current}
                      open={isLockPopoverOpen}
                      onClose={() => {
                        setLockPopoverOpen(false)
                      }}
                    />
                    {isUnknownFrom && (
                      <img className={classes.warningIcon} src={icons.warningIcon} />
                    )}
                  </Box>
                )}
                <Box className={classes.iconContainer}>
                  <img
                    className={classes.tokenIcon}
                    src={iconFrom}
                    alt='Token from'
                    onError={e => {
                      e.currentTarget.src = icons.unknownToken
                    }}
                  />
                  {isUnknownFrom && <img className={classes.warningIcon} src={icons.warningIcon} />}
                </Box>
                <Box className={classes.iconContainer}>
                  <img
                    className={classes.tokenIcon}
                    src={iconTo}
                    alt='Token to'
                    onError={e => {
                      e.currentTarget.src = icons.unknownToken
                    }}
                  />
                  {isUnknownTo && <img className={classes.warningIcon} src={icons.warningIcon} />}
                </Box>
              </Box>
            )}
            <Grid className={classes.symbolsContainer}>
              <Typography>
                {shortenAddress(symbolFrom ?? '')}/{shortenAddress(symbolTo ?? '')}
              </Typography>
              <TooltipHover text='Copy pool address'>
                <FileCopyOutlinedIcon
                  onClick={copyToClipboard}
                  classes={{ root: classes.clipboardIcon }}
                />
              </TooltipHover>
            </Grid>
          </Grid>
          {/* {!isSm ? (
            <Typography>
              {`${apy > 1000 ? '>1000%' : apy === 0 ? '-' : apy.toFixed(2) + '%'}`}
              {apy !== 0 && (
                <Tooltip
                  title={
                    <>
                      <Typography className={classes.liquidityTitle}>Pool APY</Typography>
                      <Typography className={classes.liquidityDesc}>
                        Pool fees: {`${apyData.fees > 1000 ? '>1000' : apyData.fees.toFixed(2)}%`}
                        {apyData.accumulatedFarmsAvg > 0 ? (
                          <>
                            <br />+ All farms rewards with single tick position:{' '}
                            {`${
                              apyData.accumulatedFarmsSingleTick > 1000
                                ? '>1000'
                                : apyData.accumulatedFarmsSingleTick.toFixed(2)
                            }%`}
                            <br />
                            (All farms rewards with average position:{' '}
                            {`${
                              apyData.accumulatedFarmsAvg > 1000
                                ? '>1000'
                                : apyData.accumulatedFarmsAvg.toFixed(2)
                            }%`}
                            )
                          </>
                        ) : null}
                      </Typography>
                    </>
                  }
                  placement='bottom'
                  classes={{
                    tooltip: classes.liquidityTooltip
                  }}>
                  <span className={classes.activeLiquidityIcon}>i</span>
                </Tooltip>
              )}
            </Typography>
          ) : null} */}
          <Typography>{fee}%</Typography>
          <Typography>{`$${formatNumber(volume)}`}</Typography>
          <Typography>{`$${formatNumber(TVL)}`}</Typography>
          {!isSm && (
            <Box className={classes.action}>
              <TooltipHover text='Exchange'>
                <button className={classes.actionButton} onClick={handleOpenSwap}>
                  <img width={32} height={32} src={icons.horizontalSwapIcon} alt={'Exchange'} />
                </button>
              </TooltipHover>
              <TooltipHover text='Add position'>
                <button className={classes.actionButton} onClick={handleOpenPosition}>
                  <img width={32} height={32} src={icons.plusIcon} alt={'Open'} />
                </button>
              </TooltipHover>
              <TooltipHover text='Open in explorer'>
                <button
                  className={classes.actionButton}
                  onClick={() =>
                    window.open(
                      `https://eclipsescan.xyz/account/${poolAddress}${networkUrl}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }>
                  <img width={32} height={32} src={icons.newTabBtn} alt={'Exchange'} />
                </button>
              </TooltipHover>
            </Box>
          )}
        </Grid>
      ) : (
        <Grid container classes={{ container: classes.container, root: classes.header }}>
          {!isMd && (
            <Typography style={{ lineHeight: '11px' }}>
              N<sup>o</sup>
            </Typography>
          )}
          <Typography
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (sortType === SortTypePoolList.NAME_ASC) {
                onSort?.(SortTypePoolList.NAME_DESC)
              } else {
                onSort?.(SortTypePoolList.NAME_ASC)
              }
            }}>
            Name
            {sortType === SortTypePoolList.NAME_ASC ? (
              <ArrowDropUpIcon className={classes.icon} />
            ) : sortType === SortTypePoolList.NAME_DESC ? (
              <ArrowDropDownIcon className={classes.icon} />
            ) : null}
          </Typography>
          {/* {!isSm ? (
            <Typography
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (sortType === SortTypePoolList.APY_DESC) {
                  onSort?.(SortTypePoolList.APY_ASC)
                } else {
                  onSort?.(SortTypePoolList.APY_DESC)
                }
              }}>
              7-days APY
              {sortType === SortTypePoolList.APY_ASC ? (
                <ArrowDropUpIcon className={classes.icon} />
              ) : sortType === SortTypePoolList.APY_DESC ? (
                <ArrowDropDownIcon className={classes.icon} />
              ) : null}
            </Typography>
          ) : null} */}
          <Typography
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (sortType === SortTypePoolList.FEE_ASC) {
                onSort?.(SortTypePoolList.FEE_DESC)
              } else {
                onSort?.(SortTypePoolList.FEE_ASC)
              }
            }}>
            Fee
            {sortType === SortTypePoolList.FEE_ASC ? (
              <ArrowDropUpIcon className={classes.icon} />
            ) : sortType === SortTypePoolList.FEE_DESC ? (
              <ArrowDropDownIcon className={classes.icon} />
            ) : null}
          </Typography>
          <Typography
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (sortType === SortTypePoolList.VOLUME_DESC) {
                onSort?.(SortTypePoolList.VOLUME_ASC)
              } else {
                onSort?.(SortTypePoolList.VOLUME_DESC)
              }
            }}>
            Volume 24H
            {sortType === SortTypePoolList.VOLUME_ASC ? (
              <ArrowDropUpIcon className={classes.icon} />
            ) : sortType === SortTypePoolList.VOLUME_DESC ? (
              <ArrowDropDownIcon className={classes.icon} />
            ) : null}
          </Typography>
          <Typography
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (sortType === SortTypePoolList.TVL_DESC) {
                onSort?.(SortTypePoolList.TVL_ASC)
              } else {
                onSort?.(SortTypePoolList.TVL_DESC)
              }
            }}>
            TVL
            {sortType === SortTypePoolList.TVL_ASC ? (
              <ArrowDropUpIcon className={classes.icon} />
            ) : sortType === SortTypePoolList.TVL_DESC ? (
              <ArrowDropDownIcon className={classes.icon} />
            ) : null}
          </Typography>
          {!isSm && <Typography align='right'>Action</Typography>}
        </Grid>
      )}
    </Grid>
  )
}

export default PoolListItem
