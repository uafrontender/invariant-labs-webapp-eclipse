import {
  Grid,
  TableRow,
  TableCell,
  Button,
  Typography,
  useMediaQuery,
  Box,
  Skeleton
} from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MinMaxChart } from '../../components/MinMaxChart/MinMaxChart'
import { IPositionItem } from '../../../types'
import { colors, theme } from '@static/theme'
import PromotedPoolPopover from '@components/Modals/PromotedPoolPopover/PromotedPoolPopover'
import { BN } from '@coral-xyz/anchor'
import icons from '@static/icons'
import { initialXtoY, tickerToAddress, formatNumberWithoutSuffix } from '@utils/utils'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { usePromotedPool } from '@store/hooks/positionList/usePromotedPool'
import { useSharedStyles } from '../PositionMobileCard/style/shared'
import { TooltipHover } from '@components/TooltipHover/TooltipHover'
import SwapList from '@static/svg/swap-list.svg'
import PositionStatusTooltip from '../../components/PositionStatusTooltip/PositionStatusTooltip'
import PositionViewActionPopover from '@components/Modals/PositionViewActionPopover/PositionViewActionPopover'
import React from 'react'
import { blurContent, unblurContent } from '@utils/uiUtils'
import { singlePositionData } from '@store/selectors/positions'
import LockLiquidityModal from '@components/Modals/LockLiquidityModal/LockLiquidityModal'
import { lockerState } from '@store/selectors/locker'
import { ILiquidityToken } from '@components/PositionDetails/SinglePositionInfo/consts'
import { useUnclaimedFee } from '@store/hooks/positionList/useUnclaimedFee'
import { usePositionTableRowStyle } from './styles/positionTableRow'
import { TooltipGradient } from '@components/TooltipHover/TooltipGradient'

interface ILoadingStates {
  pairName?: boolean
  feeTier?: boolean
  tokenRatio?: boolean
  value?: boolean
  unclaimedFee?: boolean
  chart?: boolean
  actions?: boolean
}

interface IPositionsTableRow extends IPositionItem {
  isLockPositionModalOpen: boolean
  setIsLockPositionModalOpen: (value: boolean) => void
  loading?: boolean | ILoadingStates
  handleLockPosition: (index: number) => void
  handleClosePosition: (index: number) => void
  handleClaimFee: (index: number, isLocked: boolean) => void
}

export const PositionTableRow: React.FC<IPositionsTableRow> = ({
  tokenXName,
  tokenYName,
  tokenXIcon,
  poolAddress,
  tokenYIcon,
  currentPrice,
  id,
  fee,
  min,
  position,
  max,
  valueX,
  valueY,
  poolData,
  isActive = false,
  tokenXLiq,
  tokenYLiq,
  network,
  loading,
  handleClaimFee,
  handleLockPosition,
  handleClosePosition
}) => {
  const { classes } = usePositionTableRowStyle()
  const { classes: sharedClasses } = useSharedStyles()
  const [xToY, setXToY] = useState<boolean>(
    initialXtoY(tickerToAddress(network, tokenXName), tickerToAddress(network, tokenYName))
  )
  const positionSingleData = useSelector(singlePositionData(id ?? ''))
  const airdropIconRef = useRef<any>(null)
  const isXs = useMediaQuery(theme.breakpoints.down('xs'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))

  const [isLockPositionModalOpen, setIsLockPositionModalOpen] = useState(false)

  useEffect(() => {
    if (isLockPositionModalOpen) {
      blurContent()
    } else {
      unblurContent()
    }
  }, [isLockPositionModalOpen])

  const isItemLoading = (item: keyof ILoadingStates): boolean => {
    if (typeof loading === 'boolean') return loading
    return loading?.[item] ?? false
  }

  const { tokenValueInUsd, tokenXPercentage, tokenYPercentage, unclaimedFeesInUSD } =
    useUnclaimedFee({
      currentPrice,
      id,
      position,
      tokenXLiq,
      tokenYLiq,
      positionSingleData,
      xToY
    })

  const { isPromoted, pointsPerSecond, estimated24hPoints } = usePromotedPool(
    poolAddress,
    position,
    poolData
  )

  const pairNameContent = useMemo(() => {
    if (isItemLoading('pairName')) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
          <Skeleton variant='circular' width={40} height={40} />
          <Skeleton variant='circular' width={36} height={36} />
          <Skeleton variant='circular' width={40} height={40} />
          <Skeleton
            variant='rectangular'
            width={100}
            height={36}
            sx={{ ml: 1.5, borderRadius: '10px' }}
          />
        </Box>
      )
    }

    return (
      <Grid container item className={classes.iconsAndNames} alignItems='center' wrap='nowrap'>
        <Grid container item className={sharedClasses.icons} alignItems='center' wrap='nowrap'>
          <img
            className={sharedClasses.tokenIcon}
            src={xToY ? tokenXIcon : tokenYIcon}
            alt={xToY ? tokenXName : tokenYName}
          />
          <TooltipHover title='Reverse tokens'>
            <img
              className={sharedClasses.arrows}
              src={SwapList}
              alt='Arrow'
              onClick={e => {
                e.stopPropagation()
                setXToY(!xToY)
              }}
            />
          </TooltipHover>
          <img
            className={sharedClasses.tokenIcon}
            src={xToY ? tokenYIcon : tokenXIcon}
            alt={xToY ? tokenYName : tokenXName}
          />
        </Grid>

        <Typography className={sharedClasses.names}>
          {xToY ? tokenXName : tokenYName} - {xToY ? tokenYName : tokenXName}
        </Typography>
      </Grid>
    )
  }, [loading, xToY, tokenXIcon, tokenYIcon, tokenXName, tokenYName])

  const feeFragment = useMemo(() => {
    if (isItemLoading('feeTier')) {
      return (
        <Skeleton
          variant='rectangular'
          width='60px'
          height={36}
          sx={{ borderRadius: '10px', margin: '0 auto', marginRight: '8px' }}
        />
      )
    }
    return (
      <TooltipGradient
        title={
          isActive ? (
            <>
              The position is <b>active</b> and currently <b>earning a fee</b> as long as the
              current price is <b>within</b> the position's price range.
            </>
          ) : (
            <>
              The position is <b>inactive</b> and <b>not earning a fee</b> as long as the current
              price is <b>outside</b> the position's price range.
            </>
          )
        }
        placement='top'
        top={1}
        noGradient>
        <Grid
          container
          item
          sx={{ width: 65 }}
          className={classNames(sharedClasses.fee, isActive ? sharedClasses.activeFee : undefined)}
          justifyContent='center'
          alignItems='center'>
          <Typography
            className={classNames(
              sharedClasses.infoText,
              isActive ? sharedClasses.activeInfoText : undefined
            )}>
            {fee}%
          </Typography>
        </Grid>
      </TooltipGradient>
    )
  }, [fee, classes, isActive])

  const tokenRatioContent = useMemo(() => {
    if (isItemLoading('tokenRatio')) {
      return (
        <Skeleton
          variant='rectangular'
          width='100%'
          height={36}
          sx={{ borderRadius: '10px', margin: '0 auto' }}
        />
      )
    }

    return (
      <Typography
        className={`${sharedClasses.infoText}`}
        style={{
          background: colors.invariant.light,
          padding: '8px 12px',
          borderRadius: '12px'
        }}>
        {tokenXPercentage === 100 && (
          <span>
            {tokenXPercentage}
            {'%'} {xToY ? tokenXName : tokenYName}
          </span>
        )}
        {tokenYPercentage === 100 && (
          <span>
            {tokenYPercentage}
            {'%'} {xToY ? tokenYName : tokenXName}
          </span>
        )}

        {tokenYPercentage !== 100 && tokenXPercentage !== 100 && (
          <span>
            {tokenXPercentage}
            {'%'} {xToY ? tokenXName : tokenYName} {' - '} {tokenYPercentage}
            {'%'} {xToY ? tokenYName : tokenXName}
          </span>
        )}
      </Typography>
    )
  }, [tokenXPercentage, tokenYPercentage, xToY, tokenXName, tokenYName, loading])

  const valueFragment = useMemo(() => {
    if (isItemLoading('value') || tokenValueInUsd.loading) {
      return (
        <Skeleton
          variant='rectangular'
          width='100%'
          height={36}
          sx={{ borderRadius: '10px', margin: '0 auto' }}
        />
      )
    }

    return (
      <Grid
        container
        item
        className={`${sharedClasses.value} ${classes.itemCellContainer}`}
        justifyContent='space-between'
        alignItems='center'
        wrap='nowrap'>
        <Grid className={sharedClasses.infoCenter} container item justifyContent='center'>
          <Typography className={sharedClasses.greenText}>
            {`$${formatNumberWithoutSuffix(tokenValueInUsd.value, { twoDecimals: true })}`}
          </Typography>
        </Grid>
      </Grid>
    )
  }, [
    tokenValueInUsd,
    valueX,
    valueY,
    tokenXName,
    classes,
    isXs,
    isDesktop,
    tokenYName,
    xToY,
    loading
  ])

  const unclaimedFee = useMemo(() => {
    if (isItemLoading('unclaimedFee') || unclaimedFeesInUSD.loading) {
      return (
        <Skeleton
          variant='rectangular'
          width='100%'
          height={36}
          sx={{ borderRadius: '10px', margin: '0 auto' }}
        />
      )
    }
    return (
      <Grid
        container
        item
        className={`${sharedClasses.value} ${classes.itemCellContainer}`}
        justifyContent='space-between'
        alignItems='center'
        wrap='nowrap'>
        <Grid className={sharedClasses.infoCenter} container item justifyContent='center'>
          <Typography className={sharedClasses.greenText}>
            ${formatNumberWithoutSuffix(unclaimedFeesInUSD.value, { twoDecimals: true })}
          </Typography>
        </Grid>
      </Grid>
    )
  }, [unclaimedFeesInUSD, classes, loading])

  const chartFragment = useMemo(() => {
    if (isItemLoading('chart')) {
      return (
        <Skeleton
          variant='rectangular'
          width='100%'
          height={36}
          sx={{ borderRadius: '10px', margin: '0 auto' }}
        />
      )
    }

    return (
      <MinMaxChart
        min={Number(xToY ? min : 1 / max)}
        max={Number(xToY ? max : 1 / min)}
        current={
          xToY ? currentPrice : currentPrice !== 0 ? 1 / currentPrice : Number.MAX_SAFE_INTEGER
        }
      />
    )
  }, [min, max, currentPrice, xToY, loading])

  const actionsFragment = useMemo(() => {
    if (isItemLoading('actions')) {
      return (
        <Skeleton
          variant='rectangular'
          width={32}
          height={32}
          sx={{ borderRadius: '10px', margin: '0 auto' }}
        />
      )
    }

    return (
      <Button
        className={classes.button}
        onClick={e => {
          e.stopPropagation()
          handleClick(e)
        }}>
        ...
      </Button>
    )
  }, [loading])

  const promotedIconContent = useMemo(() => {
    if (isPromoted && isActive) {
      return (
        <>
          <PromotedPoolPopover
            showEstPointsFirst
            isActive={true}
            headerText={
              <>
                This position is currently <b>earning points</b>
              </>
            }
            pointsLabel={'Total points distributed across the pool per 24H:'}
            estPoints={estimated24hPoints}
            points={new BN(pointsPerSecond, 'hex').muln(24).muln(60).muln(60)}>
            <div ref={airdropIconRef} className={classes.actionButton}>
              <img
                src={icons.airdropRainbow}
                alt={'Airdrop'}
                style={{
                  height: '32px',
                  width: '30px'
                }}
              />
            </div>
          </PromotedPoolPopover>
        </>
      )
    }

    return (
      <TooltipGradient
        title={<PositionStatusTooltip isActive={isActive} isPromoted={isPromoted} />}
        placement='top'
        top={1}
        noGradient>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={icons.airdropRainbow}
            alt={'Airdrop'}
            style={{
              flexShrink: '0',
              height: '32px',
              width: '32px',
              opacity: 0.3,
              filter: 'grayscale(1)'
            }}
          />
        </div>
      </TooltipGradient>
    )
  }, [isPromoted, estimated24hPoints, pointsPerSecond])

  const [isActionPopoverOpen, setActionPopoverOpen] = React.useState<boolean>(false)

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    blurContent()
    setActionPopoverOpen(true)
  }

  const handleClose = () => {
    unblurContent()
    setActionPopoverOpen(false)
  }

  const { value, tokenXLabel, tokenYLabel } = useMemo<{
    value: string
    tokenXLabel: string
    tokenYLabel: string
  }>(() => {
    const valueX = tokenXLiq + tokenYLiq / currentPrice
    const valueY = tokenYLiq + tokenXLiq * currentPrice
    return {
      value: `${formatNumberWithoutSuffix(xToY ? valueX : valueY)} ${xToY ? tokenXName : tokenYName}`,
      tokenXLabel: xToY ? tokenXName : tokenYName,
      tokenYLabel: xToY ? tokenYName : tokenXName
    }
  }, [min, max, currentPrice, tokenXName, tokenYName, tokenXLiq, tokenYLiq, xToY])

  const { success, inProgress } = useSelector(lockerState)

  return (
    <TableRow>
      <LockLiquidityModal
        open={isLockPositionModalOpen}
        onClose={() => setIsLockPositionModalOpen(false)}
        xToY={xToY}
        tokenX={{ name: tokenXName, icon: tokenXIcon, liqValue: tokenXLiq } as ILiquidityToken}
        tokenY={{ name: tokenYName, icon: tokenYIcon, liqValue: tokenYLiq } as ILiquidityToken}
        onLock={() => handleLockPosition(positionSingleData?.positionIndex ?? 0)}
        fee={`${fee}% fee`}
        minMax={`${formatNumberWithoutSuffix(xToY ? min : 1 / max)}-${formatNumberWithoutSuffix(xToY ? max : 1 / min)} ${tokenYLabel} per ${tokenXLabel}`}
        value={value}
        isActive={isActive}
        swapHandler={() => setXToY(!xToY)}
        success={success}
        inProgress={inProgress}
      />
      <PositionViewActionPopover
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={isActionPopoverOpen}
        isLocked={positionSingleData?.isLocked ?? false}
        unclaimedFeesInUSD={unclaimedFeesInUSD.value}
        claimFee={() =>
          handleClaimFee(
            positionSingleData?.positionIndex ?? 0,
            positionSingleData?.isLocked ?? false
          )
        }
        closePosition={() => handleClosePosition(positionSingleData?.positionIndex ?? 0)}
        onLockPosition={() => setIsLockPositionModalOpen(true)}
      />
      <TableCell className={`${classes.pairNameCell} ${classes.cellBase}`}>
        {pairNameContent}
      </TableCell>

      <TableCell className={`${classes.cellBase} ${classes.feeTierCell}`}>
        <Box sx={{ display: 'flex' }}>
          {promotedIconContent}
          {feeFragment}
        </Box>
      </TableCell>

      <TableCell className={`${classes.cellBase} ${classes.tokenRatioCell}`}>
        {tokenRatioContent}
      </TableCell>

      <TableCell className={`${classes.cellBase} ${classes.valueCell}`}>{valueFragment}</TableCell>

      <TableCell className={`${classes.cellBase} ${classes.feeCell}`}>{unclaimedFee}</TableCell>

      <TableCell className={`${classes.cellBase} ${classes.chartCell}`}>{chartFragment}</TableCell>

      <TableCell className={`${classes.cellBase} ${classes.actionCell} action-button`}>
        {actionsFragment}
      </TableCell>
    </TableRow>
  )
}
