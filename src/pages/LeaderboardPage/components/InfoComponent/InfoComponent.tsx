import { Box, Button, Typography } from '@mui/material'
import { useStyles } from './styles'
import Jupi from '@static/png/jupi.png'
import './animation.css'
import LaunchIcon from '@mui/icons-material/Launch'
import { Link } from 'react-router-dom'

export const InfoComponent = () => {
  const { classes } = useStyles()
  return (
    <Box className={classes.infoContainer}>
      <Box style={{ width: 'auto' }}>
        <Typography className={classes.header}>What are Invariant Points?</Typography>

        <Typography className={classes.description}>
          Invariant Points are a rewards program designed to incentivize liquidity providers on
          Invariant. Earn points by providing liquidity and participating in community activities.
          Develop your own liquidity provision strategy and climb to the top of the leaderboard.
          Accumulated points can be used for future exclusive benefits.
        </Typography>
        <Box className={classes.linkButtonContainer}>
          <Link
            to='https://docs.invariant.app/docs/invariant_points/overview'
            target='_blank'
            style={{
              textDecoration: 'none'
            }}>
            <Button className={classes.button} style={{ marginTop: '32px' }}>
              Learn more <LaunchIcon classes={{ root: classes.clipboardIcon }} />
            </Button>
          </Link>
        </Box>
      </Box>
      <Box style={{ width: 'auto' }}>
        <img
          src={Jupi}
          alt='Astronaut flying in space'
          className={`${classes.astronaut} floating-astronaut`}
        />
      </Box>
    </Box>
  )
}
