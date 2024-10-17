import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ControlledTextInput, ControlledNumericInput } from './ControlledInputs'
import { FormData, validateSupply } from '../../utils/solanaCreatorUtils'
import useStyles from '../CreateToken/styles'
import { Box, Button, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { openWalletSelectorModal } from '@utils/web3/selector'

interface TokenInfoInputsProps {
  formMethods: UseFormReturn<FormData>
  buttonText: string
}

export const TokenInfoInputs: React.FC<TokenInfoInputsProps> = ({ formMethods, buttonText }) => {
  const { classes } = useStyles()
  const {
    control,
    watch,

    formState: { errors, isValid }
  } = formMethods
  const isSubmitButton = buttonText === 'Create token'
  return (
    <Box className={classes.container}>
      <Box className={classes.inputsWrapper}>
        <ControlledTextInput
          name='name'
          label='Name (Max 30)'
          placeholder='Put the name of your token here'
          control={control}
          errors={errors}
          rules={{
            required: 'Name is required',
            maxLength: { value: 30, message: 'Name must be 30 characters or less' }
          }}
        />
        <ControlledTextInput
          name='symbol'
          label='Symbol (Max 8)'
          placeholder='Put the symbol of your token here'
          control={control}
          errors={errors}
          rules={{
            required: 'Symbol is required',
            maxLength: { value: 8, message: 'Symbol must be 8 characters or less' }
          }}
        />
        <Box className={classes.row}>
          <Box className={classes.inputContainer}>
            <ControlledNumericInput
              name='decimals'
              label='Decimals'
              placeholder='Decimals between 5 and 9'
              control={control}
              errors={errors}
              decimalsLimit={0}
              rules={{
                required: 'Decimals is required',
                validate: (value: string) => {
                  const decimalValue = parseInt(value, 10)
                  return (
                    (decimalValue >= 5 && decimalValue <= 9) || 'Decimals must be between 5 and 9'
                  )
                }
              }}
            />
          </Box>
          <Box className={classes.inputContainer}>
            <ControlledNumericInput
              name='supply'
              label='Supply'
              placeholder='Supply of your token'
              control={control}
              errors={errors}
              decimalsLimit={0}
              rules={{
                required: 'Supply is required',
                validate: (value: string) => validateSupply(value, watch('decimals'))
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box className={classes.tokenCost}>
        <InfoIcon />
        <Typography>Token cost: 0.1 SOL</Typography>
      </Box>
      {isSubmitButton ? (
        <Button className={classes.button} variant='contained' type='submit' disabled={!isValid}>
          <span className={classes.buttonText}>{buttonText}</span>
        </Button>
      ) : (
        <Button
          className={classes.connectWalletButton}
          variant='contained'
          type='button'
          onClick={openWalletSelectorModal}>
          <span className={classes.buttonText}>{buttonText}</span>
        </Button>
      )}
    </Box>
  )
}
