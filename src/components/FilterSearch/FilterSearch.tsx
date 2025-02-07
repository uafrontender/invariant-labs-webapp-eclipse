import {
  Autocomplete,
  Box,
  Divider,
  Fade,
  InputAdornment,
  Paper,
  Popper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import SearchIcon from '@static/svg/lupaDark.svg'
import { forwardRef, useMemo, useState } from 'react'
import { NetworkType } from '@store/consts/static'
import { colors, theme } from '@static/theme'
import useStyles from './styles'
import { CommonTokenItem } from './Helpers/CommonTokenItem'
import { TokenChip } from './Helpers/TokenChip'
import { TokenOption } from './Helpers/TokenOption'

interface ISearchToken {
  icon: string
  name: string
  symbol: string
  address: string
  balance: any
  decimals: number
}

interface IFilterSearch {
  networkType: string
  selectedFilters: ISearchToken[]
  setSelectedFilters: React.Dispatch<React.SetStateAction<ISearchToken[]>>
  mappedTokens: ISearchToken[]
}

export const FilterSearch: React.FC<IFilterSearch> = ({
  networkType,
  selectedFilters,
  setSelectedFilters,
  mappedTokens
}) => {
  const [open, setOpen] = useState(false)
  const isTokensSelected = selectedFilters.length === 2
  const fullWidth = open || selectedFilters.length >= 1
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const { classes } = useStyles({ fullWidth, isSmall })

  const networkUrl = useMemo(() => {
    switch (networkType) {
      case NetworkType.Mainnet:
        return ''
      case NetworkType.Testnet:
        return '?cluster=testnet'
      case NetworkType.Devnet:
        return '?cluster=devnet'
      default:
        return '?cluster=testnet'
    }
  }, [networkType])

  const options: ISearchToken[] = mappedTokens.filter(
    token => !selectedFilters.some(selected => selected.address === token.address)
  )

  const PaperComponent = (paperProps, ref) => {
    return (
      <Fade in timeout={600}>
        <Paper {...paperProps} ref={ref}>
          <Box onClick={e => e.stopPropagation()}>
            <Box className={classes.commonTokens}>
              <Typography className={classes.headerText}>Common Tokens</Typography>
              <Box display='flex' gap='8px' flexDirection='column' height='80px'>
                {[0, 3].map(sliceStart => (
                  <Box key={sliceStart} gap='8px' display='flex'>
                    {mappedTokens.slice(sliceStart, sliceStart + 3).map(token => (
                      <CommonTokenItem
                        key={token.address}
                        token={token}
                        onSelect={handleSelectToken}
                      />
                    ))}
                  </Box>
                ))}
              </Box>
              <Divider className={classes.divider} orientation='horizontal' flexItem />
            </Box>
          </Box>
          <Box>{paperProps.children}</Box>
        </Paper>
      </Fade>
    )
  }

  const CustomPopper = props => {
    return <Popper {...props} placement='bottom-start' modifiers={[]} />
  }

  const PaperComponentForward = forwardRef(PaperComponent)

  const handleRemoveToken = (tokenToRemove: ISearchToken) => {
    setSelectedFilters(prev => prev.filter(token => token.address !== tokenToRemove.address))
  }

  const handleSelectToken = (e: React.MouseEvent, token: ISearchToken) => {
    e.stopPropagation()
    e.preventDefault()
    setSelectedFilters(prev => {
      if (prev.length >= 2 || prev.some(t => t.address === token.address)) return prev
      return [...prev, token]
    })
    setOpen(true)
  }

  const filterOptions = (opts: ISearchToken[], state: { inputValue: string }) => {
    return opts.filter(token => {
      return (
        token.symbol?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
        token.address?.toLowerCase().includes(state.inputValue.toLowerCase())
      )
    })
  }

  const handleAutoCompleteChange = (_event: any, newValue: ISearchToken[]) => {
    setSelectedFilters(newValue)
    setOpen(true)
  }

  return (
    <Autocomplete
      multiple
      disablePortal
      disableClearable
      id='token-selector'
      disableCloseOnSelect={!isTokensSelected}
      value={selectedFilters}
      popupIcon={null}
      onChange={handleAutoCompleteChange}
      PopperComponent={CustomPopper}
      PaperComponent={PaperComponentForward}
      options={options}
      classes={{ paper: classes.paper }}
      open={isTokensSelected ? false : open}
      getOptionLabel={option => option.symbol}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      filterOptions={filterOptions}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }
        }
      }}
      ListboxProps={{
        autoFocus: true,
        sx: {
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: colors.invariant.newDark
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.invariant.pink,
            borderRadius: '3px'
          }
        },
        style: { maxHeight: '460px' }
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <TokenChip option={option} onRemove={handleRemoveToken} {...getTagProps({ index })} />
        ))
      }
      renderOption={(props, option) => (
        <Box component='li' {...props}>
          <TokenOption option={option} networkUrl={networkUrl} />
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          variant='outlined'
          className={classes.searchBar}
          InputProps={
            {
              ...params.InputProps,
              style: { padding: 0, height: '100%', display: 'flex', alignItems: 'center' },
              endAdornment: (
                <InputAdornment position='end'>
                  <img src={SearchIcon} className={classes.searchIcon} alt='Search' />
                </InputAdornment>
              ),
              inputProps: {
                ...params.inputProps,
                readOnly: isTokensSelected
              },
              onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
                if (params.inputProps.onKeyDown) {
                  params.inputProps.onKeyDown(event)
                }
                if (event.key === 'Backspace' && event.currentTarget.value === '') {
                  if (isTokensSelected) {
                  } else if (selectedFilters.length > 0) {
                    const lastToken = selectedFilters[selectedFilters.length - 1]
                    handleRemoveToken(lastToken)
                  }
                }
              }
            } as any
          }
          onClick={() => !isTokensSelected && setOpen(true)}
        />
      )}
    />
  )
}
