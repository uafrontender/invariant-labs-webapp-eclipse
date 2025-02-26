import { INoConnected, NoConnected } from '@components/NoConnected/NoConnected'
import {
  Box,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery
} from '@mui/material'
import refreshIcon from '@static/svg/refresh.svg'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStyles } from './style'
import { TooltipHover } from '@components/TooltipHover/TooltipHover'
import { useDispatch } from 'react-redux'
import { actions } from '@store/reducers/leaderboard'
import { PositionItemMobile } from './PositionItem/variants/PositionMobileCard/PositionItemMobile'
import { IPositionItem } from './types'
import { blurContent, unblurContent } from '@utils/uiUtils'
import { PositionsTable } from './PositionItem/variants/PositionTables/PositionsTable'
import { EmptyPlaceholder } from '@components/EmptyPlaceholder/EmptyPlaceholder'
import PositionCardsSkeletonMobile from './PositionItem/variants/PositionTables/skeletons/PositionCardsSkeletonMobile'
import { FilterSearch, ISearchToken } from '@components/FilterSearch/FilterSearch'
import { NetworkType } from '@store/consts/static'
import { theme } from '@static/theme'

export enum LiquidityPools {
  Standard = 'Standard',
  Locked = 'Locked'
}

interface IProps {
  initialPage: number
  setLastPage: (page: number) => void
  data: IPositionItem[]
  onAddPositionClick: () => void
  loading?: boolean
  showNoConnected?: boolean
  noConnectedBlockerProps: INoConnected
  itemsPerPage: number
  handleRefresh: () => void
  length: number
  lockedLength: number
  noInitialPositions: boolean
  lockedData: IPositionItem[]
  currentNetwork: NetworkType
}

export const PositionsList: React.FC<IProps> = ({
  data,
  onAddPositionClick,
  loading = false,
  showNoConnected = false,
  noConnectedBlockerProps,
  handleRefresh,
  // pageChanged,
  // length,
  // lockedLength,
  // loadedPages,
  // getRemainingPositions,
  noInitialPositions,
  lockedData,
  currentNetwork
}) => {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [alignment, setAlignment] = useState<string>(LiquidityPools.Standard)
  const [selectedFilters, setSelectedFilters] = useState<ISearchToken[]>([])
  const isLg = useMediaQuery('@media (max-width: 1360px)')
  const isMb = useMediaQuery(theme.breakpoints.down('sm'))
  const isMd = useMediaQuery(theme.breakpoints.down('md'))

  const currentData = useMemo(() => {
    if (alignment === LiquidityPools.Standard) {
      return data
    }
    return lockedData
  }, [alignment, data, lockedData])

  const filteredData = useMemo(() => {
    if (selectedFilters.length === 0) return currentData

    return currentData.filter(position => {
      const tokenX = position.tokenXName.toLowerCase()
      const tokenY = position.tokenYName.toLowerCase()

      if (selectedFilters.length === 1) {
        const filterToken = selectedFilters[0].symbol.toLowerCase()
        return tokenX === filterToken || tokenY === filterToken
      }

      if (selectedFilters.length === 2) {
        const filterToken1 = selectedFilters[0].symbol.toLowerCase()
        const filterToken2 = selectedFilters[1].symbol.toLowerCase()
        return (
          (tokenX === filterToken1 && tokenY === filterToken2) ||
          (tokenX === filterToken2 && tokenY === filterToken1)
        )
      }

      return true
    })
  }, [currentData, selectedFilters])

  const handleSwitchPools = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: LiquidityPools | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment)
    }
  }

  useEffect(() => {
    dispatch(actions.getLeaderboardConfig())
  }, [dispatch])

  const [isLockPositionModalOpen, setIsLockPositionModalOpen] = useState(false)

  useEffect(() => {
    if (isLockPositionModalOpen) {
      blurContent()
    } else {
      unblurContent()
    }
  }, [isLockPositionModalOpen])

  const [allowPropagation, setAllowPropagation] = useState(true)

  const renderContent = () => {
    if (showNoConnected) {
      return <NoConnected {...noConnectedBlockerProps} />
    }

    if (!isLg) {
      return (
        <PositionsTable
          positions={filteredData}
          isLoading={loading}
          isLockPositionModalOpen={isLockPositionModalOpen}
          setIsLockPositionModalOpen={setIsLockPositionModalOpen}
          noInitialPositions={noInitialPositions}
          onAddPositionClick={onAddPositionClick}
        />
      )
    } else if (isLg && loading) {
      return <PositionCardsSkeletonMobile />
    }

    if (currentData.length === 0 && !loading) {
      return (
        <EmptyPlaceholder
          newVersion
          desc={
            noInitialPositions
              ? 'Add your first position by pressing the button and start earning!'
              : 'Did not find any matching positions'
          }
          onAction={onAddPositionClick}
          withButton={noInitialPositions}
        />
      )
    }

    return currentData.map((element, index) => (
      <Grid
        onClick={() => {
          if (allowPropagation) {
            navigate(`/position/${element.id}`)
          }
        }}
        key={element.id}
        className={classes.itemLink}>
        <PositionItemMobile
          key={index}
          {...element}
          isLockPositionModalOpen={isLockPositionModalOpen}
          setIsLockPositionModalOpen={setIsLockPositionModalOpen}
          setAllowPropagation={setAllowPropagation}
        />
      </Grid>
    ))
  }

  return (
    <Grid container direction='column' className={classes.root}>
      {!isMd ? (
        <Grid
          className={classes.header}
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Grid className={classes.searchRoot}>
            <Grid className={classes.titleBar}>
              <Typography className={classes.title}>Your Positions</Typography>
              <TooltipHover text='Total number of your positions'>
                <Typography className={classes.positionsNumber}>
                  {String(filteredData.length)}
                </Typography>
              </TooltipHover>
            </Grid>
            {isMb && (
              <Box className={classes.switchPoolsContainer}>
                <Box
                  className={classes.switchPoolsMarker}
                  sx={{
                    left: alignment === LiquidityPools.Standard ? 0 : '50%'
                  }}
                />
                <ToggleButtonGroup
                  value={alignment}
                  exclusive
                  onChange={handleSwitchPools}
                  className={classes.switchPoolsButtonsGroup}>
                  <ToggleButton
                    sx={{ padding: 0 }}
                    value={LiquidityPools.Standard}
                    disableRipple
                    className={classes.switchPoolsButton}
                    style={{ fontWeight: alignment === LiquidityPools.Standard ? 700 : 400 }}>
                    Standard
                  </ToggleButton>
                  <ToggleButton
                    sx={{ padding: 0 }}
                    disabled={lockedData.length === 0}
                    value={LiquidityPools.Locked}
                    disableRipple
                    className={classes.switchPoolsButton}
                    classes={{ disabled: classes.disabledSwitchButton }}
                    style={{ fontWeight: alignment === LiquidityPools.Locked ? 700 : 400 }}>
                    Locked
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}
            <Grid className={classes.searchWrapper}>
              <Grid className={classes.filtersContainer}>
                <FilterSearch
                  loading={loading}
                  bp='md'
                  networkType={currentNetwork}
                  filtersAmount={2}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
                {!isMb && (
                  <Box className={classes.switchPoolsContainer}>
                    <Box
                      className={classes.switchPoolsMarker}
                      sx={{
                        left: alignment === LiquidityPools.Standard ? 0 : '50%'
                      }}
                    />
                    <ToggleButtonGroup
                      value={alignment}
                      exclusive
                      onChange={handleSwitchPools}
                      className={classes.switchPoolsButtonsGroup}>
                      <ToggleButton
                        sx={{ padding: 0 }}
                        value={LiquidityPools.Standard}
                        disableRipple
                        className={classes.switchPoolsButton}
                        style={{ fontWeight: alignment === LiquidityPools.Standard ? 700 : 400 }}>
                        Standard
                      </ToggleButton>
                      <ToggleButton
                        sx={{ padding: 0 }}
                        disabled={lockedData.length === 0}
                        value={LiquidityPools.Locked}
                        disableRipple
                        className={classes.switchPoolsButton}
                        classes={{ disabled: classes.disabledSwitchButton }}
                        style={{ fontWeight: alignment === LiquidityPools.Locked ? 700 : 400 }}>
                        Locked
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                )}
              </Grid>

              <Grid
                display='flex'
                columnGap={2}
                justifyContent='space-between'
                className={classes.fullWidthWrapper}>
                <TooltipHover text='Refresh'>
                  <Grid display='flex' alignItems='center'>
                    <Button
                      disabled={showNoConnected}
                      onClick={showNoConnected ? () => {} : handleRefresh}
                      className={classes.refreshIconBtn}>
                      <img src={refreshIcon} className={classes.refreshIcon} alt='Refresh' />
                    </Button>
                  </Grid>
                </TooltipHover>
                <Button className={classes.button} variant='contained' onClick={onAddPositionClick}>
                  <span className={classes.buttonText}>+ Add Position</span>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          className={classes.header}
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'>
          <Grid className={classes.searchRoot}>
            <Grid className={classes.titleBar}>
              <Typography className={classes.title}>Your Positions</Typography>
              <TooltipHover text='Total number of your positions'>
                <Typography className={classes.positionsNumber}>
                  {String(filteredData.length)}
                </Typography>
              </TooltipHover>
            </Grid>

            <Grid className={classes.searchWrapper}>
              <Grid className={classes.filtersContainer}>
                <Box className={classes.switchPoolsContainer}>
                  <Box
                    className={classes.switchPoolsMarker}
                    sx={{
                      left: alignment === LiquidityPools.Standard ? 0 : '50%'
                    }}
                  />
                  <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleSwitchPools}
                    className={classes.switchPoolsButtonsGroup}>
                    <ToggleButton
                      sx={{ padding: 0 }}
                      value={LiquidityPools.Standard}
                      disableRipple
                      className={classes.switchPoolsButton}
                      style={{ fontWeight: alignment === LiquidityPools.Standard ? 700 : 400 }}>
                      Standard
                    </ToggleButton>
                    <ToggleButton
                      sx={{ padding: 0 }}
                      disabled={lockedData.length === 0}
                      value={LiquidityPools.Locked}
                      disableRipple
                      className={classes.switchPoolsButton}
                      classes={{ disabled: classes.disabledSwitchButton }}
                      style={{ fontWeight: alignment === LiquidityPools.Locked ? 700 : 400 }}>
                      Locked
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Grid
                  display='flex'
                  columnGap={2}
                  justifyContent='space-between'
                  className={classes.fullWidthWrapper}>
                  <TooltipHover text='Refresh'>
                    <Grid display='flex' alignItems='center'>
                      <Button
                        disabled={showNoConnected}
                        onClick={showNoConnected ? () => {} : handleRefresh}
                        className={classes.refreshIconBtn}>
                        <img src={refreshIcon} className={classes.refreshIcon} alt='Refresh' />
                      </Button>
                    </Grid>
                  </TooltipHover>
                  <Button
                    className={classes.button}
                    variant='contained'
                    onClick={onAddPositionClick}>
                    <span className={classes.buttonText}>+ Add Position</span>
                  </Button>
                </Grid>
              </Grid>

              <FilterSearch
                bp='md'
                loading={loading}
                networkType={currentNetwork}
                filtersAmount={2}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid container direction='column' className={classes.list} justifyContent='flex-start'>
        {renderContent()}
      </Grid>
    </Grid>
  )
}
