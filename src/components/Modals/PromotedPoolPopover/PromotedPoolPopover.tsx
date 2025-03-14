import { BN } from '@coral-xyz/anchor'
import useStyles from './style'
import { Typography } from '@mui/material'
import { formatNumberWithCommas, printBN, removeAdditionalDecimals } from '@utils/utils'
import { LEADERBOARD_DECIMAL } from '@store/consts/static'
import { TooltipGradient } from '@components/TooltipHover/TooltipGradient'
export interface IPromotedPoolPopover {
  isActive?: boolean
  apr?: BN
  apy?: number
  estPoints?: BN
  points: BN
  headerText?: string | React.ReactNode
  pointsLabel?: string | React.ReactNode
  showEstPointsFirst?: boolean
  children: React.ReactElement<any, any>
}

export const PromotedPoolPopover = ({
  isActive,
  apr,
  apy,
  estPoints,
  points,
  headerText = 'The pool distributes points:',
  pointsLabel = 'Points per 24H',
  showEstPointsFirst = false,
  children
}: IPromotedPoolPopover) => {
  const { classes } = useStyles()

  const isLessThanMinimal = (value: BN) => {
    const minimalValue = new BN(1).mul(new BN(10).pow(new BN(LEADERBOARD_DECIMAL - 2)))
    return value.lt(minimalValue)
  }

  const TotalPointsSection = (
    <div className={classes.insideBox}>
      <Typography
        className={classes.greyText}
        dangerouslySetInnerHTML={
          typeof pointsLabel === 'string' ? { __html: pointsLabel } : undefined
        }>
        {typeof pointsLabel !== 'string' ? pointsLabel : null}
      </Typography>
      <Typography className={classes.whiteText}>
        {formatNumberWithCommas(printBN(points, 0))}
      </Typography>
    </div>
  )
  const EstPointsSection = estPoints ? (
    <div className={classes.insideBox}>
      <Typography className={classes.greyText}>Points earned by this position per 24H:</Typography>
      <Typography className={classes.whiteText}>
        {isLessThanMinimal(estPoints) && isActive
          ? '<0.01'
          : removeAdditionalDecimals(
              formatNumberWithCommas(printBN(estPoints, LEADERBOARD_DECIMAL)),
              2
            )}
      </Typography>
    </div>
  ) : null

  return (
    <TooltipGradient
      title={
        <div className={classes.container}>
          {/* Content remains the same */}
          <Typography
            className={classes.greyText}
            dangerouslySetInnerHTML={
              typeof headerText === 'string' ? { __html: headerText } : undefined
            }>
            {typeof headerText !== 'string' ? headerText : null}
          </Typography>

          {showEstPointsFirst ? (
            <>
              {EstPointsSection}
              {TotalPointsSection}
            </>
          ) : (
            <>
              {TotalPointsSection}
              {EstPointsSection}
            </>
          )}

          {apr && apy ? (
            <>
              <div className={classes.insideBox}>
                <Typography className={classes.greyText}>
                  APR
                  <span className={classes.apy}>APY</span>
                </Typography>{' '}
                <Typography className={classes.whiteText}>
                  {`${apr > 1000 ? '>1000%' : apr === 0 ? '-' : Math.abs(apr).toFixed(2) + '%'}`}
                  <span className={classes.apy}>
                    {`${apy > 1000 ? '>1000%' : apy === 0 ? '' : Math.abs(apy).toFixed(2) + '%'}`}
                  </span>
                </Typography>
              </div>
            </>
          ) : null}
        </div>
      }
      placement='bottom'
      top={1}>
      {children}
    </TooltipGradient>
  )
}

export default PromotedPoolPopover
