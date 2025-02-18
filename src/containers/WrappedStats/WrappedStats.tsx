import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from './styles'
import { Grid, Typography } from '@mui/material'
import { EmptyPlaceholder } from '@components/EmptyPlaceholder/EmptyPlaceholder'
import {
  fees24,
  isLoading,
  liquidityPlot,
  poolsStatsWithTokensDetails,
  tokensStatsWithTokensDetails,
  tvl24,
  volume24,
  volumePlot
} from '@store/selectors/stats'
import { network } from '@store/selectors/solanaConnection'
import { actions } from '@store/reducers/stats'
import Volume from '@components/Stats/Volume/Volume'
import Liquidity from '@components/Stats/Liquidity/Liquidity'
import VolumeBar from '@components/Stats/volumeBar/VolumeBar'
import TokensList from '@components/Stats/TokensList/TokensList'
import PoolList from '@components/Stats/PoolList/PoolList'
import icons from '@static/icons'
import { actions as leaderboardActions } from '@store/reducers/leaderboard'
import { actions as snackbarActions } from '@store/reducers/snackbars'
import { VariantType } from 'notistack'
import { getPromotedPools } from '@store/selectors/leaderboard'
import { FilterSearch, ISearchToken } from '@components/FilterSearch/FilterSearch'

export const WrappedStats: React.FC = () => {
  const { classes } = useStyles()

  const dispatch = useDispatch()

  const poolsList = useSelector(poolsStatsWithTokensDetails)
  const tokensList = useSelector(tokensStatsWithTokensDetails)
  const volume24h = useSelector(volume24)
  const tvl24h = useSelector(tvl24)
  const fees24h = useSelector(fees24)
  const volumePlotData = useSelector(volumePlot)
  const liquidityPlotData = useSelector(liquidityPlot)
  const isLoadingStats = useSelector(isLoading)
  const currentNetwork = useSelector(network)
  const promotedPools = useSelector(getPromotedPools)
  const [searchTokensValue, setSearchTokensValue] = useState<ISearchToken[]>([])
  const [searchPoolsValue, setSearchPoolsValue] = useState<ISearchToken[]>([])

  useEffect(() => {
    dispatch(actions.getCurrentStats())
    dispatch(leaderboardActions.getLeaderboardConfig())
  }, [])

  const filteredTokenList = useMemo(() => {
    if (searchTokensValue.length === 0) {
      return tokensList
    }

    return tokensList.filter(tokenData => {
      const tokenAddress = tokenData.address.toString().toLowerCase()
      const tokenSymbol = tokenData.tokenDetails?.symbol?.toLowerCase() || ''
      const tokenName = tokenData.tokenDetails?.name?.toLowerCase() || ''

      return searchTokensValue.some(filterToken => {
        const filterAddress = filterToken.address?.toLowerCase()
        const filterSymbol = filterToken.symbol.toLowerCase()
        const filterName = filterToken.name.toLowerCase()

        if (filterAddress) {
          return tokenAddress === filterAddress
        }
        return tokenSymbol.includes(filterSymbol) || tokenName.includes(filterName)
      })
    })
  }, [tokensList, searchTokensValue])

  const filteredPoolsList = useMemo(() => {
    return poolsList.filter(poolData => {
      const isTokenXSelected = searchPoolsValue.some(
        token => token.address.toString() === poolData.tokenX.toString()
      )
      const isTokenYSelected = searchPoolsValue.some(
        token => token.address.toString() === poolData.tokenY.toString()
      )

      if (searchPoolsValue.length === 1) {
        return isTokenXSelected || isTokenYSelected
      }

      if (searchPoolsValue.length === 2) {
        if (!(isTokenXSelected && isTokenYSelected)) return false
      }

      return true
    })
  }, [isLoadingStats, poolsList, searchPoolsValue])

  const showAPY = useMemo(() => {
    return filteredPoolsList.some(pool => pool.apy !== 0)
  }, [filteredPoolsList])

  const copyAddressHandler = (message: string, variant: VariantType) => {
    dispatch(
      snackbarActions.add({
        message,
        variant,
        persist: false
      })
    )
  }

  return (
    <Grid container className={classes.wrapper} direction='column'>
      {liquidityPlotData.length === 0 && !isLoadingStats ? (
        <Grid container direction='column' alignItems='center' justifyContent='center'>
          <EmptyPlaceholder desc={'We have not started collecting statistics yet'} />
        </Grid>
      ) : (
        <>
          <Typography className={classes.subheader}>Overview</Typography>
          <Grid container className={classes.plotsRow} wrap='nowrap'>
            <Volume
              volume={volume24h.value}
              percentVolume={volume24h.change}
              data={volumePlotData}
              className={classes.plot}
              isLoading={isLoadingStats}
            />
            <Liquidity
              liquidityVolume={tvl24h.value}
              liquidityPercent={tvl24h.change}
              data={liquidityPlotData}
              className={classes.plot}
              isLoading={isLoadingStats}
            />
          </Grid>
          <Grid className={classes.row}>
            <VolumeBar
              volume={volume24h.value}
              percentVolume={volume24h.change}
              tvlVolume={tvl24h.value}
              percentTvl={tvl24h.change}
              feesVolume={fees24h.value}
              percentFees={fees24h.change}
              isLoading={isLoadingStats}
            />
          </Grid>
          <Grid
            display='flex'
            alignItems='end'
            justifyContent='space-between'
            className={classes.rowContainer}>
            <Typography className={classes.subheader} mb={2}>
              Top tokens
            </Typography>
            <FilterSearch
              networkType={currentNetwork}
              selectedFilters={searchTokensValue}
              setSelectedFilters={setSearchTokensValue}
              filtersAmount={3}
            />
          </Grid>
          <Grid container className={classes.row}>
            <TokensList
              data={filteredTokenList.map(tokenData => ({
                icon: tokenData.tokenDetails?.logoURI ?? icons.unknownToken,
                name: tokenData.tokenDetails?.name ?? tokenData.address.toString(),
                symbol: tokenData.tokenDetails?.symbol ?? tokenData.address.toString(),
                price: tokenData.price,
                // priceChange: tokenData.priceChange,
                volume: tokenData.volume24,
                TVL: tokenData.tvl,
                address: tokenData.address.toString(),
                isUnknown: tokenData.tokenDetails?.isUnknown ?? false
              }))}
              network={currentNetwork}
              copyAddressHandler={copyAddressHandler}
              isLoading={isLoadingStats}
            />
          </Grid>
          <Grid
            display='flex'
            alignItems='end'
            justifyContent='space-between'
            className={classes.rowContainer}>
            <Typography className={classes.subheader} mb={2}>
              Top pools
            </Typography>

            <FilterSearch
              networkType={currentNetwork}
              setSelectedFilters={setSearchPoolsValue}
              selectedFilters={searchPoolsValue}
              filtersAmount={2}
            />
          </Grid>
          <PoolList
            data={filteredPoolsList.map(poolData => ({
              symbolFrom: poolData.tokenXDetails?.symbol ?? poolData.tokenX.toString(),
              symbolTo: poolData.tokenYDetails?.symbol ?? poolData.tokenY.toString(),
              iconFrom: poolData.tokenXDetails?.logoURI ?? icons.unknownToken,
              iconTo: poolData.tokenYDetails?.logoURI ?? icons.unknownToken,
              volume: poolData.volume24,
              TVL: poolData.tvl,
              fee: poolData.fee,
              addressFrom: poolData.tokenX.toString(),
              addressTo: poolData.tokenY.toString(),
              apy: poolData.apy,
              lockedX: poolData.lockedX,
              lockedY: poolData.lockedY,
              liquidityX: poolData.liquidityX,
              liquidityY: poolData.liquidityY,
              apyData: {
                fees: poolData.apy,
                accumulatedFarmsSingleTick: 0,
                accumulatedFarmsAvg: 0
              },

              isUnknownFrom: poolData.tokenXDetails?.isUnknown ?? false,
              isUnknownTo: poolData.tokenYDetails?.isUnknown ?? false,
              poolAddress: poolData.poolAddress.toString(),
              pointsPerSecond:
                promotedPools.find(pool => pool.address === poolData.poolAddress.toString())
                  ?.pointsPerSecond || '0',
              isPromoted: promotedPools.some(
                pool => pool.address === poolData.poolAddress.toString()
              )
            }))}
            network={currentNetwork}
            copyAddressHandler={copyAddressHandler}
            isLoading={isLoadingStats}
            showAPY={showAPY}
          />
        </>
      )}
    </Grid>
  )
}

export default WrappedStats
