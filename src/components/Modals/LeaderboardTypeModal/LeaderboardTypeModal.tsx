import React from 'react'
import useStyles from './style'
import { Button, Grid, Popover, Typography } from '@mui/material'
import { LeaderBoardType } from '@store/reducers/leaderboard'

export interface ISelectNetworkModal {
  open: boolean
  anchorEl: HTMLButtonElement | null
  handleClose: () => void
  selectOption: (option: LeaderBoardType) => void
  options: LeaderBoardType[]
}

export const LeaderboardTypeModal: React.FC<ISelectNetworkModal> = ({
  anchorEl,
  open,
  handleClose,
  selectOption,
  options
}) => {
  const { classes } = useStyles()
  const handleSave = (opt: LeaderBoardType) => {
    selectOption(opt)
    handleClose()
  }
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      classes={{ paper: classes.paper }}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
      <Grid className={classes.root}>
        <Typography className={classes.modalTitle}>Leaderboard types:</Typography>
        {options.map(opt => (
          <Button onClick={() => handleSave(opt)} className={classes.optionButton} disableRipple>
            {opt}
          </Button>
        ))}
      </Grid>
    </Popover>
  )
}

export default LeaderboardTypeModal
