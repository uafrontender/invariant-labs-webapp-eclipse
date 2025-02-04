import React, { useMemo, useRef, useState } from 'react'
import { theme } from '@static/theme'
import { useStyles } from './style'
import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useNavigate } from 'react-router-dom'
import icons from '@static/icons'
import { NetworkType, SortTypePoolList } from '@store/consts/static'
import { addressToTicker, calculateAPYAndAPR, initialXtoY, parseFeeToPathFee } from '@utils/utils'
import { formatNumber } from '@utils/utils'
import { DECIMAL } from '@invariant-labs/sdk-eclipse/lib/utils'
import { TooltipHover } from '@components/TooltipHover/TooltipHover'
import { VariantType } from 'notistack'
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'
import { shortenAddress } from '@utils/uiUtils'
import classNames from 'classnames'
import LockStatsPopover from '@components/Modals/LockStatsPopover/LockStatsPopover'
import PromotedPoolPopover from '@components/Modals/PromotedPoolPopover/PromotedPoolPopover'
import { BN } from '@coral-xyz/anchor'

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
  lockedX?: number
  lockedY?: number
  liquidityX?: number
  liquidityY?: number
  apyData?: {
    fees: number
    accumulatedFarmsAvg: number
    accumulatedFarmsSingleTick: number
  }
  isUnknownFrom?: boolean
  isUnknownTo?: boolean
  isLocked?: boolean
  isPromoted?: boolean
  poolAddress?: string
  copyAddressHandler?: (message: string, variant: VariantType) => void
  showAPY: boolean
  points?: BN
}

const PoolListItem: React.FC<IProps> = ({
  fee = 0,
  volume = 0,
  TVL = 0,
  lockedX = 0,
  lockedY = 0,
  liquidityX = 0,
  liquidityY = 0,
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
  apy = 0,
  isUnknownFrom,
  isUnknownTo,
  isLocked,
  isPromoted,
  poolAddress,
  copyAddressHandler,
  points,
  showAPY
}) => {
  const { classes } = useStyles()

  const navigate = useNavigate()
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))
  const isSmd = useMediaQuery('(max-width:780px)')
  const isMd = useMediaQuery(theme.breakpoints.down('md'))
  const lockIconRef = useRef<HTMLButtonElement>(null)
  const airdropIconRef = useRef<HTMLDivElement>(null)

  const [isLockPopoverOpen, setLockPopoverOpen] = useState(false)
  const [isPromotedPoolPopoverOpen, setIsPromotedPoolPopoverOpen] = useState(false)

  const isXtoY = initialXtoY(addressFrom ?? '', addressTo ?? '')

  const tokenAData = isXtoY
    ? {
        symbol: symbolFrom,
        icon: iconFrom,
        address: addressFrom,
        locked: lockedX,
        liquidity: liquidityX,
        isUnknown: isUnknownFrom
      }
    : {
        symbol: symbolTo,
        icon: iconTo,
        address: addressTo,
        locked: lockedY,
        liquidity: liquidityY,
        isUnknown: isUnknownTo
      }

  const tokenBData = isXtoY
    ? {
        symbol: symbolTo,
        icon: iconTo,
        address: addressTo,
        locked: lockedY,
        liquidity: liquidityY,
        isUnknown: isUnknownTo
      }
    : {
        symbol: symbolFrom,
        icon: iconFrom,
        address: addressFrom,
        locked: lockedX,
        liquidity: liquidityX,
        isUnknown: isUnknownFrom
      }

  const handleOpenPosition = () => {
    const tokenA = addressToTicker(network, tokenAData.address ?? '')
    const tokenB = addressToTicker(network, tokenBData.address ?? '')

    navigate(
      `/newPosition/${tokenA}/${tokenB}/${parseFeeToPathFee(Math.round(fee * 10 ** (DECIMAL - 2)))}`,
      { state: { referer: 'stats' } }
    )
  }

  const handleOpenSwap = () => {
    navigate(
      `/exchange/${addressToTicker(network, tokenAData.address ?? '')}/${addressToTicker(network, tokenBData.address ?? '')}`,
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
  const handlePointerEnter = () => {
    setLockPopoverOpen(true)
  }

  const handlePointerLeave = () => {
    setLockPopoverOpen(false)
  }

  //HOTFIX
  const { convertedApy, convertedApr } = calculateAPYAndAPR(apy, poolAddress, volume, fee, TVL)

  return (
    <Grid maxWidth='100%'>
      {displayType === 'token' ? (
        <Grid
          container
          classes={{
            container: classNames(classes.container, { [classes.containerNoAPY]: !showAPY })
          }}
          style={hideBottomLine ? { border: 'none' } : undefined}>
          {!isMd ? <Typography>{tokenIndex}</Typography> : null}
          <Grid className={classes.imageContainer}>
            <Box className={classes.iconsWrapper}>
              <Box className={classes.iconContainer}>
                <img
                  className={classes.tokenIcon}
                  src={tokenAData.icon}
                  alt='Token from'
                  onError={e => {
                    e.currentTarget.src = icons.unknownToken
                  }}
                />
                {tokenAData.isUnknown && (
                  <img className={classes.warningIcon} src={icons.warningIcon} />
                )}
              </Box>
              <Box className={classes.iconContainer}>
                <img
                  className={classes.tokenIcon}
                  src={tokenBData.icon}
                  alt='Token to'
                  onError={e => {
                    e.currentTarget.src = icons.unknownToken
                  }}
                />
                {tokenBData.isUnknown && (
                  <img className={classes.warningIcon} src={icons.warningIcon} />
                )}
              </Box>
            </Box>
            <Grid className={classes.symbolsContainer}>
              {!isSm && (
                <Typography>
                  {shortenAddress(tokenAData.symbol ?? '')}/
                  {shortenAddress(tokenBData.symbol ?? '')}
                </Typography>
              )}
              <TooltipHover text='Copy pool address'>
                <FileCopyOutlinedIcon
                  onClick={copyToClipboard}
                  classes={{ root: classes.clipboardIcon }}
                />
              </TooltipHover>
            </Grid>
          </Grid>
          {!isSmd && showAPY ? (
            <Grid className={classes.row} justifyContent='space-between'>
              <Typography>
                {`${convertedApr > 1000 ? '>1000%' : convertedApr === 0 ? '-' : Math.abs(convertedApr).toFixed(2) + '%'}`}
                <span
                  className={
                    classes.apy
                  }>{`${convertedApy > 1000 ? '>1000%' : convertedApy === 0 ? '' : Math.abs(convertedApy).toFixed(2) + '%'}`}</span>
              </Typography>
              {isPromoted && (
                <Box mr={1}>
                  <Box
                    className={classes.actionButton}
                    ref={airdropIconRef}
                    onPointerLeave={() => {
                      setIsPromotedPoolPopoverOpen(false)
                    }}
                    onPointerEnter={() => {
                      setIsPromotedPoolPopoverOpen(true)
                    }}
                    mr={3}>
                    <img width={32} height={32} src={icons.airdropRainbow} alt={'Airdrop'} />
                  </Box>
                  <PromotedPoolPopover
                    anchorEl={airdropIconRef.current}
                    open={isPromotedPoolPopoverOpen}
                    onClose={() => {
                      setIsPromotedPoolPopoverOpen(false)
                    }}
                    apr={convertedApr}
                    apy={convertedApy}
                    points={points}
                  />
                </Box>
              )}
            </Grid>
          ) : null}
          <Typography>{fee}%</Typography>
          <Typography>{`$${formatNumber(volume)}`}</Typography>
          <Typography>{`$${formatNumber(TVL)}`}</Typography>
          {!isMd && (
            <Box className={classes.action}>
              {isLocked && (
                <>
                  <button
                    className={classes.actionButton}
                    ref={lockIconRef}
                    onPointerLeave={handlePointerLeave}
                    onPointerEnter={handlePointerEnter}>
                    <img width={32} height={32} src={icons.lockIcon} alt={'Lock info'} />
                  </button>
                  <LockStatsPopover
                    anchorEl={lockIconRef.current}
                    open={isLockPopoverOpen}
                    lockedX={tokenAData.locked}
                    lockedY={tokenBData.locked}
                    symbolX={shortenAddress(tokenAData.symbol ?? '')}
                    symbolY={shortenAddress(tokenBData.symbol ?? '')}
                    liquidityX={tokenAData.liquidity}
                    liquidityY={tokenBData.liquidity}
                    onClose={() => {
                      setLockPopoverOpen(false)
                    }}
                  />
                </>
              )}

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
        <Grid
          container
          classes={{
            container: classNames(classes.container, { [classes.containerNoAPY]: !showAPY }),
            root: classes.header
          }}>
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
          {!isSmd && showAPY ? (
            <Typography
              className={classes.row}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (sortType === SortTypePoolList.APY_DESC) {
                  onSort?.(SortTypePoolList.APY_ASC)
                } else {
                  onSort?.(SortTypePoolList.APY_DESC)
                }
              }}>
              APR <span className={classes.apy}>APY</span>
              {sortType === SortTypePoolList.APY_ASC ? (
                <ArrowDropUpIcon className={classes.icon} />
              ) : sortType === SortTypePoolList.APY_DESC ? (
                <ArrowDropDownIcon className={classes.icon} />
              ) : null}
            </Typography>
          ) : null}
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
          {!isMd && <Typography align='right'>Action</Typography>}
        </Grid>
      )}
    </Grid>
  )
}

export default PoolListItem
