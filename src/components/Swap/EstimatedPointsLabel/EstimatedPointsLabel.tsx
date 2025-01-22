import { BN } from '@coral-xyz/anchor'
import { Box } from '@mui/material'
import icons from '@static/icons'
import { formatNumber, removeAdditionalDecimals } from '@utils/utils'
import React, { useEffect, useRef, useState } from 'react'
import useStyles from './style'

interface IEstimatedPointsLabel {
  pointsBoxRef: React.RefObject<HTMLDivElement>
  handlePointerLeave: () => void
  handlePointerEnter: () => void
  swapMultiplier: string
  stringPointsValue: string
  pointsForSwap: BN
  isLessThanOne: boolean
  decimalIndex: any
  isAnimating: boolean
}

export const EstimatedPointsLabel: React.FC<IEstimatedPointsLabel> = ({
  handlePointerEnter,
  handlePointerLeave,
  pointsBoxRef,
  swapMultiplier,
  pointsForSwap,
  isLessThanOne,
  decimalIndex,
  isAnimating,
  stringPointsValue
}) => {
  const [displayedValue, setDisplayedValue] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)
  const [isChanging, setIsChanging] = useState(false)

  const alternativeRef = useRef<HTMLDivElement>(null)
  const { classes } = useStyles({ isVisible: isAnimating, width: 200, isChanging })

  useEffect(() => {
    console.log(stringPointsValue)
    if (isAnimating || !pointsForSwap.isZero()) {
      setIsChanging(true)

      const blurTimeout = setTimeout(() => {
        setDisplayedValue(
          removeAdditionalDecimals(stringPointsValue, isLessThanOne ? decimalIndex : 2)
        )

        const resetTimeout = setTimeout(() => {
          setIsChanging(false)
        }, 200)

        return () => clearTimeout(resetTimeout)
      }, 300)

      return () => clearTimeout(blurTimeout)
    }
  }, [stringPointsValue, isAnimating, pointsForSwap])

  return (
    <Box
      className={classes.pointsBox}
      ref={pointsBoxRef}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}>
      <div className={classes.contentWrapper} ref={contentRef}>
        <img src={icons.airdropRainbow} alt='' />
        Points:{' '}
        <span
          className={classes.pointsAmount}
          style={{ borderRight: '1px solid #3A466B', paddingRight: '10px' }}>
          <p className={classes.pointsValue}> {formatNumber(displayedValue)}</p>

          <img src={icons.infoCircle} alt='' width='15px' style={{ marginLeft: '5px' }} />
        </span>{' '}
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            marginLeft: '8px'
          }}>
          {new BN(swapMultiplier, 'hex').gte(new BN(1)) &&
            `${new BN(swapMultiplier, 'hex').toNumber()}x`}
          <img src={icons.boostPoints} alt='' style={{ height: '18px', width: '12px' }} />
        </span>
      </div>

      <div className={classes.alternativeContent} ref={alternativeRef}>
        <img src={icons.airdropRainbow} alt='' className={classes.grayscaleIcon} />
        How to earn points?
        <img
          src={icons.infoCircle}
          alt=''
          width='14px'
          style={{ marginTop: '-2px' }}
          className={classes.grayscaleIcon}
        />
      </div>
    </Box>
  )
}

export default EstimatedPointsLabel
