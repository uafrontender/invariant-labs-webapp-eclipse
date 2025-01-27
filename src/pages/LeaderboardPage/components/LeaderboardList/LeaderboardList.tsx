import React, { useMemo, useCallback } from 'react'
import { Box, Grid, Skeleton, Typography, useMediaQuery } from '@mui/material'
import { useStyles } from './style'
import PurpleWaves from '@static/png/purple_waves.png'
import GreenWaves from '@static/png/green_waves.png'
import { PaginationList } from '@components/Pagination/Pagination'
import NotFoundPlaceholder from '@components/Stats/NotFoundPlaceholder/NotFoundPlaceholder'
import { useDispatch, useSelector } from 'react-redux'
import { status } from '@store/selectors/solanaWallet'
import { Status } from '@store/reducers/solanaWallet'
import {
  leaderboardSelectors,
  topRankedLpUsers,
  topRankedSwapUsers,
  topRankedTotalUsers
} from '@store/selectors/leaderboard'
import {
  actions,
  ILpEntry,
  ISwapEntry,
  ITotalEntry,
  LeaderBoardType
} from '@store/reducers/leaderboard'
import { colors, theme } from '@static/theme'
import LeaderboardSwapItem from '../LeaderboardItem/LeaderboardSwapItem'
import LeaderboardLpItem from '../LeaderboardItem/LeaderboardLpItem'
import LeaderboardTotalItem from '../LeaderboardItem/LeaderboardTotalItem'
import { Keypair, PublicKey } from '@solana/web3.js'

interface LeaderboardListProps {}

const MemoizedLpLeaderboardItem = React.memo(LeaderboardLpItem)
const MemoizedSwapLeaderboardItem = React.memo(LeaderboardSwapItem)
const MemoizedTotalLeaderboardItem = React.memo(LeaderboardTotalItem)

const getContent = (
  type: LeaderBoardType,
  isConnected: boolean,
  isLoading: boolean,
  itemsPerPage: number,
  lpData: ILpEntry[],
  swapData: ISwapEntry[],
  totalData: ITotalEntry[],
  userLpStats: ILpEntry | null,
  userSwapStats: ISwapEntry | null,
  userTotalStats: ITotalEntry | null
) => {
  if (isLoading) {
    return (
      <>
        <MemoizedLpLeaderboardItem displayType='header' />

        <Box sx={{ paddingLeft: '24px', paddingRight: '24px' }}>
          {Array.from({ length: itemsPerPage }, (_, index) => (
            <MemoizedLpLeaderboardItem
              key={index + 1}
              displayType='item'
              rank={index + 1}
              positions={index + 1}
              last24hPoints={'00'}
              points={'00'}
              address={Keypair.generate().publicKey}
            />
          ))}
        </Box>
      </>
    )
  }
  if (type === 'Liquidity') {
    return (
      <>
        <MemoizedLpLeaderboardItem displayType='header' />

        {isConnected && userLpStats && (
          <MemoizedLpLeaderboardItem
            key={userLpStats.rank}
            displayType='item'
            rank={userLpStats.rank}
            isYou
            positions={userLpStats.positions}
            last24hPoints={userLpStats.last24hPoints}
            points={userLpStats.points ?? 0}
            address={new PublicKey(userLpStats.address)}
            domain={userLpStats.domain}
          />
        )}
        <Box sx={{ paddingLeft: '24px', paddingRight: '24px' }}>
          {lpData.length > 0 ? (
            lpData.map((element, index) => (
              <MemoizedLpLeaderboardItem
                key={index}
                displayType='item'
                rank={element.rank}
                positions={element.positions}
                last24hPoints={element.last24hPoints}
                points={element.points ?? 0}
                address={new PublicKey(element.address)}
                domain={element.domain}
              />
            ))
          ) : (
            <NotFoundPlaceholder title='Leaderboard is empty...' />
          )}
        </Box>
      </>
    )
  }
  if (type === 'Swap')
    return (
      <>
        <MemoizedSwapLeaderboardItem displayType='header' />

        {isConnected && userSwapStats && (
          <MemoizedSwapLeaderboardItem
            key={userSwapStats.rank}
            displayType='item'
            rank={userSwapStats.rank}
            isYou
            swaps={userSwapStats.swaps}
            last24hPoints={userSwapStats.last24hPoints}
            points={userSwapStats.points ?? 0}
            address={new PublicKey(userSwapStats.address)}
            domain={userSwapStats.domain}
          />
        )}
        <Box sx={{ paddingLeft: '24px', paddingRight: '24px' }}>
          {swapData.length > 0 ? (
            swapData.map((element, index) => (
              <MemoizedSwapLeaderboardItem
                key={index}
                displayType='item'
                rank={element.rank}
                swaps={element.swaps}
                last24hPoints={element.last24hPoints}
                points={element.points ?? 0}
                address={new PublicKey(element.address)}
                domain={element.domain}
              />
            ))
          ) : (
            <NotFoundPlaceholder title='Leaderboard is empty...' />
          )}
        </Box>
      </>
    )
  return (
    <>
      <MemoizedTotalLeaderboardItem displayType='header' />

      {isConnected && userTotalStats && (
        <MemoizedTotalLeaderboardItem
          key={userTotalStats.rank}
          displayType='item'
          rank={userTotalStats.rank}
          isYou
          swapPoints={userTotalStats.swapPoints}
          lpPoints={userTotalStats.lpPoints}
          last24hPoints={userTotalStats.last24hPoints}
          points={userTotalStats.points}
          address={new PublicKey(userTotalStats.address)}
          domain={userTotalStats.domain}
        />
      )}
      <Box sx={{ paddingLeft: '24px', paddingRight: '24px' }}>
        {totalData.length > 0 ? (
          totalData.map((element, index) => (
            <MemoizedTotalLeaderboardItem
              key={index}
              displayType='item'
              rank={element.rank}
              swapPoints={element.swapPoints}
              lpPoints={element.lpPoints}
              last24hPoints={element.last24hPoints}
              points={element.points}
              address={new PublicKey(element.address)}
              domain={element.domain}
            />
          ))
        ) : (
          <NotFoundPlaceholder title='Leaderboard is empty...' />
        )}
      </Box>
    </>
  )
}
const LeaderboardList: React.FC<LeaderboardListProps> = () => {
  const { classes } = useStyles()
  const walletStatus = useSelector(status)
  const isConnected = useMemo(() => walletStatus === Status.Initialized, [walletStatus])
  const userStats = useSelector(leaderboardSelectors.currentUser)
  const lpData = useSelector(topRankedLpUsers)
  const swapData = useSelector(topRankedSwapUsers)
  const totalData = useSelector(topRankedTotalUsers)
  const isLoading = useSelector(leaderboardSelectors.loading)
  const isLg = useMediaQuery(theme.breakpoints.down('lg'))

  const dispatch = useDispatch()
  const currentPage = useSelector(leaderboardSelectors.currentPage)
  const totalItemsObject = useSelector(leaderboardSelectors.totalItems)
  const itemsPerPage = useSelector(leaderboardSelectors.itemsPerPage)
  const type = useSelector(leaderboardSelectors.type)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const currentData = useMemo(() => {
    if (type === 'Liquidity') return lpData
    if (type === 'Swap') return swapData
    return totalData
  }, [lpData, swapData, totalData, type])

  const totalItems = useMemo(() => {
    if (type === 'Liquidity') return totalItemsObject.lp
    if (type === 'Swap') return totalItemsObject.swap
    return totalItemsObject.total
  }, [totalItemsObject, type])

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [lpData, swapData, totalData, type]
  )
  const lowerBound = useMemo(
    () => (currentPage - 1) * itemsPerPage + 1,
    [currentPage, itemsPerPage, type]
  )
  const upperBound = useMemo(
    () => Math.min(currentPage * itemsPerPage, totalItems),
    [lpData, swapData, totalData, type]
  )
  const content = useMemo(
    () =>
      getContent(
        type,
        isConnected,
        isLoading,
        itemsPerPage,
        lpData,
        swapData,
        totalData,
        userStats.lp,
        userStats.swap,
        userStats.total
      ),
    [type, isLoading, lpData, swapData, totalData, isConnected, userStats]
  )

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(actions.getLeaderboardData({ page, itemsPerPage }))
    },
    [dispatch, itemsPerPage, isConnected]
  )

  const renderWaves = (position: 'top' | 'bottom', imageSrc: string) =>
    totalPages > 1 &&
    currentData.length > 20 && (
      <div
        className={`${classes.waveImage} ${classes[`${position}Wave`]}`}
        style={{ alignItems: position === 'top' ? 'flex-start' : 'flex-end' }}>
        <img src={imageSrc} alt={`${position === 'top' ? 'Purple' : 'Green'} waves`} />
      </div>
    )
  if (currentData.length === 0) {
    return <Skeleton className={classes.skeleton} />
  }
  return (
    <div className={classes.container}>
      {renderWaves('top', PurpleWaves)}

      <Grid container direction='column' className={isLoading ? classes.loadingOverlay : ''}>
        {content}
      </Grid>

      {totalPages >= 1 && (
        <Box
          sx={{
            [theme.breakpoints.up('md')]: { paddingLeft: '24px', paddingRight: '24px' },
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Grid
            container
            sx={{
              padding: '20px 0 10px 0',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              position: 'relative'
            }}>
            <Grid
              item
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}>
              <Box sx={{ width: '80%', [theme.breakpoints.down('md')]: { width: '90%' } }}>
                <PaginationList
                  squeeze={isLg}
                  pages={totalPages}
                  defaultPage={currentPage}
                  handleChangePage={handlePageChange}
                  variant='center'
                />
              </Box>
            </Grid>

            <Grid
              item
              sx={{
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'flex-end',
                width: '100%',
                position: isMobile ? 'static' : 'absolute',
                right: 0,
                top: '55%',
                pointerEvents: 'none',
                transform: isMobile ? 'none' : 'translateY(-50%)'
              }}>
              <Typography
                sx={{
                  color: colors.invariant.textGrey,
                  textWrap: 'nowrap',
                  textAlign: isMobile ? 'center' : 'right'
                }}>
                Showing {lowerBound}-{upperBound} of {totalItems}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {renderWaves('bottom', GreenWaves)}
    </div>
  )
}

export default LeaderboardList
