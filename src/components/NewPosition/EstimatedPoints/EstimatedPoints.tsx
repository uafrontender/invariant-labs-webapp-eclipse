import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useStyles } from './style'
import GradientBorder from '@components/GradientBorder/GradientBorder'
import { theme, typography } from '@static/theme'
import icons from '@static/icons'
import { BN } from '@coral-xyz/anchor'
import { formatNumberWithSuffix, printBN } from '@utils/utils'
import { LEADERBOARD_DECIMAL } from '@store/consts/static'
import { PositionOpeningMethod } from '@store/consts/types'

export interface IEstimatedPoints {
  handleClickFAQ: () => void
  concentrationArray: number[]
  concentrationIndex: number
  estimatedPointsPerDay: BN
  estimatedScalePoints: { min: BN; middle: BN; max: BN }
  isConnected: boolean
  showWarning: boolean
  singleDepositWarning: boolean
  positionOpeningMethod: PositionOpeningMethod
}

export const EstimatedPoints: React.FC<IEstimatedPoints> = ({
  handleClickFAQ,
  concentrationArray,
  concentrationIndex,
  estimatedPointsPerDay,
  isConnected,
  estimatedScalePoints,
  showWarning,
  singleDepositWarning,
  positionOpeningMethod
}) => {
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))
  const isMd = useMediaQuery(theme.breakpoints.down('md'))

  const { minConc, middleConc, maxConc } = useMemo(
    () => ({
      minConc: concentrationArray[0].toFixed(0),
      middleConc: concentrationArray[Math.floor(concentrationArray.length / 2)].toFixed(0),
      maxConc: concentrationArray[concentrationArray.length - 1].toFixed(0)
    }),
    [concentrationArray, positionOpeningMethod]
  )

  const warningText = useMemo(() => {
    if (singleDepositWarning) {
      return 'Points are not available for single-asset positions'
    } else if (showWarning) {
      return 'First, enter your deposit amounts to estimate your points per day'
    } else return ''
  }, [showWarning, singleDepositWarning])

  const percentage = useMemo(
    () =>
      showWarning || singleDepositWarning
        ? 0
        : +((concentrationIndex * 100) / (concentrationArray.length - 1)).toFixed(2),
    [concentrationIndex, concentrationArray, warningText.length]
  )
  const { classes } = useStyles({ percentage })

  const isLessThanMinimal = (value: BN) => {
    const minimalValue = new BN(1).mul(new BN(10).pow(new BN(LEADERBOARD_DECIMAL - 2)))
    return value.lt(minimalValue)
  }

  const pointsPerDayFormat: string | number = isLessThanMinimal(estimatedPointsPerDay)
    ? isConnected && !estimatedPointsPerDay.isZero()
      ? '<0.01'
      : 0
    : formatNumberWithSuffix(printBN(estimatedPointsPerDay, LEADERBOARD_DECIMAL), false, 1)

  const estimatedPointsForScaleFormat = useMemo(() => {
    const minPoints = isLessThanMinimal(estimatedScalePoints.min)
      ? isConnected && !estimatedScalePoints.min.isZero()
        ? '<0.01'
        : 0
      : formatNumberWithSuffix(printBN(estimatedScalePoints.min, LEADERBOARD_DECIMAL))

    const middlePoints = isLessThanMinimal(estimatedScalePoints.middle)
      ? isConnected && !estimatedScalePoints.middle.isZero()
        ? '<0.01'
        : 0
      : formatNumberWithSuffix(printBN(estimatedScalePoints.middle, LEADERBOARD_DECIMAL))

    const maxPoints = isLessThanMinimal(estimatedScalePoints.max)
      ? isConnected && !estimatedScalePoints.max.isZero()
        ? '<0.01'
        : 0
      : formatNumberWithSuffix(printBN(estimatedScalePoints.max, LEADERBOARD_DECIMAL))

    return {
      min: minPoints,
      middle: middlePoints,
      max: maxPoints
    }
  }, [estimatedScalePoints, isConnected])

  return (
    <Box mt={3} mb={4}>
      <GradientBorder borderRadius={24} borderWidth={2}>
        <Grid className={classNames(classes.wrapper)}>
          <Grid display='flex' gap={3} className={classNames(classes.innerWrapper)} spacing={3}>
            <Grid className={classes.column}>
              <Grid container direction='column' spacing={1} className={classes.leftHeaderItems}>
                <Grid item>
                  <Grid display='flex' gap={1} alignItems='center' justifyContent={'space-between'}>
                    <Typography style={{ whiteSpace: 'nowrap', ...typography.heading4 }}>
                      Estimated Points
                    </Typography>
                    <Grid
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      className={classes.pointsLabel}
                      flexWrap='nowrap'>
                      <img
                        src={icons.airdropRainbow}
                        alt='Airdrop'
                        style={{ height: '16px', marginLeft: '-8px' }}
                      />
                      <Typography noWrap>
                        Points: <span className={classes.pinkText}>{pointsPerDayFormat}</span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Typography className={classes.description}>
                  Points you accrue depend on the concentration of your position. Adjust the
                  concentration slider to see how many points your current position will accrue.{' '}
                  <button className={classes.questionButton} onClick={handleClickFAQ}>
                    <img
                      src={icons.infoIconPink}
                      alt='i'
                      width={14}
                      style={{ marginLeft: '-2px', marginRight: '4px', marginBottom: '-2px' }}
                    />
                    <Typography
                      display='inline'
                      className={classNames(classes.pinkText, classes.link)}>
                      How to get more points?
                    </Typography>
                  </button>
                </Typography>
              </Grid>
            </Grid>
            <Grid className={classes.column} style={{ alignItems: 'center' }}>
              <Typography
                style={{ whiteSpace: 'nowrap', ...typography.heading4, fontSize: '18px' }}>
                <span>Your Estimated Points: &nbsp;</span>
                <span className={classes.pinkText}>
                  {singleDepositWarning ? 0 : pointsPerDayFormat} Points/24h
                </span>
              </Typography>
              <Grid display='flex' justifyContent='space-between' container mt={1}>
                <Typography className={classes.sliderLabel}>{minConc}x</Typography>
                <Typography className={classes.sliderLabel}>{middleConc}x</Typography>
                <Typography className={classes.sliderLabel}>{maxConc}x</Typography>
              </Grid>
              <Box className={classes.darkBackground}>
                <Box className={classes.gradientProgress} />
              </Box>

              {!warningText ? (
                <Grid container justifyContent='space-between' alignItems='center'>
                  <Typography
                    display='flex'
                    flexDirection={isSm ? 'column' : 'row'}
                    className={classes.sliderLabel}>
                    {estimatedPointsForScaleFormat.min} {isSm ? <span>Pts/24h</span> : 'Points/24h'}
                  </Typography>
                  <Typography
                    display='flex'
                    alignItems='center'
                    flexDirection={isSm ? 'column' : 'row'}
                    className={classes.sliderLabel}>
                    {estimatedPointsForScaleFormat.middle}{' '}
                    {isSm ? <span>Pts/24h</span> : 'Points/24h'}
                  </Typography>
                  <Typography
                    display='flex'
                    alignItems='flex-end'
                    flexDirection={isSm ? 'column' : 'row'}
                    className={classes.sliderLabel}>
                    {estimatedPointsForScaleFormat.max} {isSm ? <span>Pts/24h</span> : 'Points/24h'}
                  </Typography>
                </Grid>
              ) : (
                <Grid container height={isMd ? 0 : 17} />
              )}
            </Grid>
          </Grid>
          {warningText ? (
            <Typography
              display='flex'
              mt={isSm ? '24px' : '16px'}
              alignItems='center'
              columnGap={2}>
              <img
                width={20}
                src={icons.warning2}
                alt='Warning icon'
                style={{ minWidth: '20px' }}
              />
              <span className={classes.warningText}>{warningText}</span>
            </Typography>
          ) : (
            <Grid container height={isMd ? 0 : 40} />
          )}
        </Grid>
      </GradientBorder>
    </Box>
  )
}

export default EstimatedPoints
