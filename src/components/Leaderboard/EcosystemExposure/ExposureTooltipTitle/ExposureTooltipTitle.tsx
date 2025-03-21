import { Grid, Typography } from '@mui/material'
import useStyles from './styles'
import check from '@static/svg/checkRainbow.svg'
import airdrop from '@static/svg/airdropRainbow.svg'
import GradientBorder from '@components/GradientBorder/GradientBorder'
import newTab from '@static/svg/newTab.svg'
interface ExposureTooltipTitleProps {
  footerDescription?: string
  description?: React.ReactNode
  completed?: boolean
  current?: number
  title: string
  link?: string
  max?: number
  img: string
  id: string
}

export const ExposureTooltipTitle: React.FC<ExposureTooltipTitleProps> = ({
  footerDescription,
  description,
  completed = false,
  current,
  title,
  link,
  img,
  max,
  id
}) => {
  const isComingSoon = !footerDescription && !description && !current
  const { classes } = useStyles({ isFinished: completed })

  return isComingSoon ? (
    <Grid className={classes.tooltipWrapper}>
      <Grid alignItems='center' className={classes.header}>
        <img src={img} alt='project logo' />
        <Grid className={classes.title}>
          <Typography>{title}</Typography>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Grid className={classes.tooltipWrapper}>
      <Grid className={classes.header}>
        <img src={img} alt='project logo' />
        <Grid className={classes.title}>
          <Typography>{title}</Typography>
          <Typography
            component='a'
            className={classes.link}
            href={link}
            target='_blank'
            rel='noopener noreferrer'>
            {id}
            <img src={newTab} className={classes.newTabIcon} />
          </Typography>
          <Grid className={classes.progressWrapper}>
            <img src={check} alt='check icon' />
            <Typography>
              {`${current === Infinity || current == null ? '- ' : current}/${max}`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Typography className={classes.description}>{description}</Typography>
      <Grid width='fit-content'>
        <GradientBorder borderWidth={1} borderRadius={8}>
          <Grid className={classes.footer}>
            <img src={airdrop} alt='airdrop icon' />
            <Typography>{footerDescription}</Typography>
          </Grid>
        </GradientBorder>
      </Grid>
    </Grid>
  )
}
