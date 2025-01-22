import { BN } from '@coral-xyz/anchor'
import { Box } from '@mui/material'
import icons from '@static/icons'
import { formatNumber, removeAdditionalDecimals } from '@utils/utils'
import React, { useLayoutEffect, useRef, useState } from 'react'
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
  const [displayedValue, setDisplayedValue] = useState<string>(stringPointsValue)
  const contentRef = useRef<HTMLDivElement>(null)
  const alternativeRef = useRef<HTMLDivElement>(null)
  const previousValueRef = useRef<string>(stringPointsValue)
  const { classes } = useStyles({ isVisible: isAnimating, width: 200 })

  useLayoutEffect(() => {
    if (isAnimating || !pointsForSwap.isZero()) {
      setDisplayedValue(stringPointsValue)
      previousValueRef.current = stringPointsValue
    }
  }, [stringPointsValue, isAnimating])

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
          {formatNumber(removeAdditionalDecimals(displayedValue, isLessThanOne ? decimalIndex : 2))}
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
