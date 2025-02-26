import { Box, Button, Grid, Skeleton, Tooltip, Typography } from '@mui/material'
import SwapList from '@static/svg/swap-list.svg'
import { formatNumberWithSuffix } from '@utils/utils'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMobileStyles } from './style/mobile'
import { TooltipHover } from '@components/TooltipHover/TooltipHover'
import { initialXtoY, tickerToAddress } from '@utils/utils'
import icons from '@static/icons'
import PromotedPoolPopover from '@components/Modals/PromotedPoolPopover/PromotedPoolPopover'
import { BN } from '@coral-xyz/anchor'
import { usePromotedPool } from '@store/hooks/positionList/usePromotedPool'
import { IPositionItem } from '@components/PositionsList/types'
import { useSharedStyles } from './style/shared'
import { InactivePoolsPopover } from '../../components/InactivePoolsPopover/InactivePoolsPopover'
import { NetworkType } from '@store/consts/static'
import { network as currentNetwork } from '@store/selectors/solanaConnection'
import { useSelector } from 'react-redux'
import { useUnclaimedFee } from '@store/hooks/positionList/useUnclaimedFee'
import { singlePositionData } from '@store/selectors/positions'
import { MinMaxChart } from '../../components/MinMaxChart/MinMaxChart'
import { blurContent, unblurContent } from '@utils/uiUtils'
import PositionViewActionPopover from '@components/Modals/PositionViewActionPopover/PositionViewActionPopover'
import LockLiquidityModal from '@components/Modals/LockLiquidityModal/LockLiquidityModal'
import { ILiquidityToken } from '@components/PositionDetails/SinglePositionInfo/consts'
import { lockerState } from '@store/selectors/locker'
import { ISinglePositionData } from '@components/OverviewYourPositions/components/Overview/Overview'

interface IPositionItemMobile extends IPositionItem {
  setAllowPropagation: React.Dispatch<React.SetStateAction<boolean>>
  handleLockPosition: (index: number) => void
  handleClosePosition: (index: number) => void
  handleClaimFee: (index: number, isLocked: boolean) => void
}

export const PositionItemMobile: React.FC<IPositionItemMobile> = ({
  tokenXName,
  tokenYName,
  tokenXIcon,
  poolAddress,
  tokenYIcon,
  fee,
  min,
  max,
  position,
  id,
  setAllowPropagation,
  poolData,
  isActive = false,
  currentPrice,
  tokenXLiq,
  tokenYLiq,
  network,
  handleLockPosition,
  handleClosePosition,
  handleClaimFee
}) => {
  const { classes } = useMobileStyles()
  const { classes: sharedClasses } = useSharedStyles()
  const airdropIconRef = useRef<any>(null)
  const [isPromotedPoolPopoverOpen, setIsPromotedPoolPopoverOpen] = useState(false)
  const [isPromotedPoolInactive, setIsPromotedPoolInactive] = useState(false)
  const positionSingleData: ISinglePositionData | undefined = useSelector(
    singlePositionData(id ?? '')
  )

  const [isLockPositionModalOpen, setIsLockPositionModalOpen] = useState(false)

  useEffect(() => {
    if (isLockPositionModalOpen) {
      blurContent()
    } else {
      unblurContent()
    }
  }, [isLockPositionModalOpen])

  const networkSelector = useSelector(currentNetwork)

  const { isPromoted, pointsPerSecond, estimated24hPoints } = usePromotedPool(
    poolAddress,
    position,
    poolData
  )

  const handlePopoverState = (isOpen: boolean) => {
    if (isOpen) {
      setAllowPropagation(false)
    } else {
      setTimeout(() => {
        setAllowPropagation(true)
      }, 500)
    }
  }
  const handleInteraction = (event: React.MouseEvent) => {
    event.stopPropagation()
    setIsPromotedPoolPopoverOpen(!isPromotedPoolPopoverOpen)
    setAllowPropagation(false)
  }
  useEffect(() => {
    const PROPAGATION_ALLOW_TIME = 500

    const handleClickOutside = (event: MouseEvent) => {
      const isClickInAirdropIcon =
        airdropIconRef.current &&
        (airdropIconRef.current as HTMLElement).contains(event.target as Node)
      const isClickInPromotedPopover = document
        .querySelector('.promoted-pool-popover')
        ?.contains(event.target as Node)
      const isClickInInactivePopover = document
        .querySelector('.promoted-pool-inactive-popover')
        ?.contains(event.target as Node)

      if (!isClickInAirdropIcon && !isClickInPromotedPopover && !isClickInInactivePopover) {
        if (isPromotedPoolPopoverOpen) {
          setIsPromotedPoolPopoverOpen(false)
        }

        if (isPromotedPoolInactive) {
          setIsPromotedPoolInactive(false)
        }

        setTimeout(() => {
          setAllowPropagation(true)
        }, PROPAGATION_ALLOW_TIME)
      }
    }

    if (isPromotedPoolPopoverOpen || isPromotedPoolInactive || isLockPositionModalOpen) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isPromotedPoolPopoverOpen, isPromotedPoolInactive, isLockPositionModalOpen])

  useEffect(() => {
    setAllowPropagation(!isLockPositionModalOpen)
  }, [isLockPositionModalOpen])
  const promotedIconFragment = useMemo(() => {
    if (isPromoted && isActive) {
      return (
        <>
          <div
            className={classes.actionButton}
            onClick={event => {
              event.stopPropagation()
              setIsPromotedPoolPopoverOpen(!isPromotedPoolPopoverOpen)
              setAllowPropagation(false)
            }}>
            <img src={icons.airdropRainbow} alt={'Airdrop'} style={{ height: '32px' }} />
          </div>
          <PromotedPoolPopover
            showEstPointsFirst
            isActive={isActive}
            anchorEl={airdropIconRef.current}
            open={isPromotedPoolPopoverOpen}
            onClose={() => {
              setIsPromotedPoolPopoverOpen(false)
              setTimeout(() => {
                setAllowPropagation(true)
              }, 500)
            }}
            headerText={
              <>
                This position is currently <b>earning points</b>
              </>
            }
            pointsLabel={'Total points distributed across the pool per 24H:'}
            estPoints={estimated24hPoints}
            points={new BN(pointsPerSecond, 'hex').muln(24).muln(60).muln(60)}
          />
        </>
      )
    }

    return (
      <>
        <InactivePoolsPopover
          anchorEl={airdropIconRef.current}
          open={isPromotedPoolInactive}
          onClose={() => {
            setIsPromotedPoolInactive(false)
            handlePopoverState(false)
          }}
          isActive={isActive}
          isPromoted={isPromoted}
        />
        <div
          className={classes.actionButton}
          onClick={event => {
            event.stopPropagation()
            const newState = !isPromotedPoolInactive
            setIsPromotedPoolInactive(newState)
            handlePopoverState(newState)
          }}
          onPointerEnter={() => {
            if (window.matchMedia('(hover: hover)').matches) {
              setIsPromotedPoolInactive(true)
              handlePopoverState(true)
            }
          }}
          onPointerLeave={() => {
            if (window.matchMedia('(hover: hover)').matches) {
              setIsPromotedPoolInactive(false)
              handlePopoverState(false)
            }
          }}>
          <img
            src={icons.airdropRainbow}
            alt={'Airdrop'}
            style={{
              height: '32px',
              opacity: 0.3,
              filter: 'grayscale(1)'
            }}
          />
        </div>
      </>
    )
  }, [
    isPromoted,
    isActive,
    isPromotedPoolPopoverOpen,
    isPromotedPoolInactive,
    classes.actionButton,
    handleInteraction,
    airdropIconRef,
    estimated24hPoints,
    pointsPerSecond
  ])
  const [xToY, setXToY] = useState<boolean>(
    initialXtoY(tickerToAddress(network, tokenXName), tickerToAddress(network, tokenYName))
  )

  const [isActionPopoverOpen, setActionPopoverOpen] = useState<boolean>(false)

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    blurContent()
    setActionPopoverOpen(true)
  }

  const handleClose = () => {
    unblurContent()
    setActionPopoverOpen(false)
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

  const topSection = useMemo(
    () => (
      <Grid container sx={{ width: '100%', marginBottom: 2 }}>
        <Grid item xs={5}>
          <Tooltip
            enterTouchDelay={0}
            leaveTouchDelay={Number.MAX_SAFE_INTEGER}
            onClick={e => e.stopPropagation()}
            title={
              isActive ? (
                <>
                  The position is <b>active</b> and currently <b>earning a fee</b>
                </>
              ) : (
                <>
                  The position is <b>inactive</b> and <b>not earning a fee</b>
                </>
              )
            }
            placement='top'
            classes={{ tooltip: sharedClasses.tooltip }}>
            <Grid
              container
              className={classNames(
                sharedClasses.fee,
                isActive ? sharedClasses.activeFee : undefined
              )}
              justifyContent='center'
              alignItems='center'>
              <Typography
                className={classNames(
                  sharedClasses.infoText,
                  isActive ? sharedClasses.activeInfoText : undefined
                )}>
                {fee}% fee
              </Typography>
            </Grid>
          </Tooltip>
        </Grid>

        <Grid item xs={7} paddingLeft={'16px'}>
          {unclaimedFeesInUSD.loading ? (
            <Skeleton
              variant='rectangular'
              width='100%'
              height={36}
              sx={{ borderRadius: '10px' }}
            />
          ) : (
            <Grid
              container
              justifyContent='center'
              alignItems='center'
              className={sharedClasses.fee}
              sx={{ width: '100%' }}>
              <Box className={sharedClasses.unclaimedFeeContainer}>
                <Typography className={sharedClasses.infoText}>Unclaimed Fee</Typography>
                <Typography className={sharedClasses.greenText}>
                  ${formatNumberWithSuffix(unclaimedFeesInUSD.value.toFixed(2))}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    ),
    [fee, isActive, unclaimedFeesInUSD]
  )

  const middleSection = useMemo(
    () => (
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          {tokenValueInUsd.loading ? (
            <Skeleton
              variant='rectangular'
              width='100%'
              height={36}
              sx={{ borderRadius: '10px' }}
            />
          ) : (
            <Grid
              container
              className={sharedClasses.value}
              alignItems='center'
              justifyContent='center'>
              <Box gap={'8px'} display={'flex'} alignItems={'center'}>
                <Typography className={sharedClasses.infoText}>Value</Typography>
                <Typography className={sharedClasses.greenText}>
                  ${formatNumberWithSuffix(tokenValueInUsd.value)}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <Grid item xs={6}>
          <Grid
            container
            alignItems='center'
            className={sharedClasses.value}
            justifyContent='center'>
            <Typography className={sharedClasses.infoText}>
              {tokenXPercentage === 100 && (
                <span>
                  {tokenXPercentage}% {xToY ? tokenXName : tokenYName}
                </span>
              )}
              {tokenYPercentage === 100 && (
                <span>
                  {tokenYPercentage}% {xToY ? tokenYName : tokenXName}
                </span>
              )}
              {tokenYPercentage !== 100 && tokenXPercentage !== 100 && (
                <span>
                  {tokenXPercentage}% {xToY ? tokenXName : tokenYName} - {tokenYPercentage}%{' '}
                  {xToY ? tokenYName : tokenXName}
                </span>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    ),
    [tokenValueInUsd, tokenXPercentage, tokenYPercentage, xToY]
  )

  const chartSection = useMemo(
    () => (
      <Grid container justifyContent='center' margin={'0 auto'} width={'80%'}>
        <MinMaxChart
          min={Number(xToY ? min : 1 / max)}
          max={Number(xToY ? max : 1 / min)}
          current={
            xToY ? currentPrice : currentPrice !== 0 ? 1 / currentPrice : Number.MAX_SAFE_INTEGER
          }
        />
      </Grid>
    ),
    [min, max, currentPrice, xToY]
  )

  const { value, tokenXLabel, tokenYLabel } = useMemo<{
    value: string
    tokenXLabel: string
    tokenYLabel: string
  }>(() => {
    const valueX = tokenXLiq + tokenYLiq / currentPrice
    const valueY = tokenYLiq + tokenXLiq * currentPrice
    return {
      value: `${formatNumberWithSuffix(xToY ? valueX : valueY)} ${xToY ? tokenXName : tokenYName}`,
      tokenXLabel: xToY ? tokenXName : tokenYName,
      tokenYLabel: xToY ? tokenYName : tokenXName
    }
  }, [min, max, currentPrice, tokenXName, tokenYName, tokenXLiq, tokenYLiq, xToY])

  const { success, inProgress } = useSelector(lockerState)

  return (
    <Grid className={classes.root} container direction='column'>
      <LockLiquidityModal
        open={isLockPositionModalOpen}
        onClose={() => setIsLockPositionModalOpen(false)}
        xToY={xToY}
        tokenX={{ name: tokenXName, icon: tokenXIcon, liqValue: tokenXLiq } as ILiquidityToken}
        tokenY={{ name: tokenYName, icon: tokenYIcon, liqValue: tokenYLiq } as ILiquidityToken}
        onLock={() => handleLockPosition(positionSingleData?.positionIndex ?? 0)}
        fee={`${fee}% fee`}
        minMax={`${formatNumberWithSuffix(xToY ? min : 1 / max)}-${formatNumberWithSuffix(xToY ? max : 1 / min)} ${tokenYLabel} per ${tokenXLabel}`}
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
      <Grid
        container
        item
        className={classes.mdTop}
        direction='row'
        wrap='nowrap'
        sx={{ marginBottom: 2 }}>
        <Grid
          container
          item
          className={classes.iconsAndNames}
          alignItems='center'
          justifyContent={'space-between'}
          wrap='nowrap'>
          <Box display='flex' alignItems={'center'}>
            <Grid container item className={sharedClasses.icons} alignItems='center' wrap='nowrap'>
              <img
                className={sharedClasses.tokenIcon}
                src={xToY ? tokenXIcon : tokenYIcon}
                alt={xToY ? tokenXName : tokenYName}
              />
              <TooltipHover text='Reverse tokens'>
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
          </Box>

          <Box ref={airdropIconRef} className={sharedClasses.actionButtonContainer}>
            {networkSelector === NetworkType.Mainnet && <>{promotedIconFragment}</>}
            <Button
              className={classes.button}
              onClick={e => {
                e.stopPropagation()
                handleClick(e)
              }}>
              ...
            </Button>
          </Box>
        </Grid>
      </Grid>

      {topSection}
      {middleSection}
      {chartSection}
    </Grid>
  )
}
