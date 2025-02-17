import React, { useMemo } from 'react'
import { Box, Grid, Skeleton, Typography, useMediaQuery } from '@mui/material'
import { useStyles } from './style'
import PurpleWaves from '@static/png/purple_waves.png'
import GreenWaves from '@static/png/green_waves.png'
import { PaginationList } from '@components/Pagination/Pagination'
import NotFoundPlaceholder from '@components/Stats/NotFoundPlaceholder/NotFoundPlaceholder'
import { Status } from '@store/reducers/solanaWallet'
import { CurrentUser, ILpEntry, ISwapEntry, ITotalEntry } from '@store/reducers/leaderboard'
import { colors, theme } from '@static/theme'
import LeaderboardSwapItem from './LeaderboardItem/LeaderboardSwapItem'
import LeaderboardLpItem from './LeaderboardItem/LeaderboardLpItem'
import LeaderboardTotalItem from './LeaderboardItem/LeaderboardTotalItem'
import { Keypair, PublicKey } from '@solana/web3.js'
import { LeaderBoardType, NetworkType } from '@store/consts/static'
import { VariantType } from 'notistack'
import { EmptyRow } from './EmptyRow/EmptyRow'

interface LeaderboardListProps {
  copyAddressHandler: (message: string, variant: VariantType) => void
  currentNetwork: NetworkType
  type: LeaderBoardType
  lpData: ILpEntry[]
  swapData: ISwapEntry[]
  totalData: ITotalEntry[]
  totalItemsObject: {
    total: number
    swap: number
    lp: number
  }
  itemsPerPage: number
  currentPage: number
  walletStatus: Status
  isLoading: boolean
  userStats: CurrentUser
  handlePageChange: (page: number) => void
}

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
  userTotalStats: ITotalEntry | null,
  copyAddressHandler: (message: string, variant: VariantType) => void,
  currentNetwork: NetworkType
) => {
  if (isLoading) {
    const userDataExist = userLpStats || userSwapStats || userTotalStats
    return (
      <>
        <MemoizedLpLeaderboardItem
          displayType='header'
          copyAddressHandler={copyAddressHandler}
          currentNetwork={currentNetwork}
        />

        <Box
          sx={{
            paddingLeft: '24px',
            paddingRight: '24px',
            [theme.breakpoints.down('sm')]: { paddingLeft: '12px', paddingRight: '12px' }
          }}>
          {Array.from({ length: userDataExist ? itemsPerPage + 1 : itemsPerPage }, (_, index) => (
            <MemoizedLpLeaderboardItem
              key={index + 1}
              displayType='item'
              rank={index + 1}
              positions={index + 1}
              last24hPoints={'00'}
              points={'00'}
              address={Keypair.generate().publicKey}
              copyAddressHandler={copyAddressHandler}
              currentNetwork={currentNetwork}
            />
          ))}
        </Box>
      </>
    )
  }

  if (type === 'Liquidity') {
    return (
      <>
        <MemoizedLpLeaderboardItem
          displayType='header'
          copyAddressHandler={copyAddressHandler}
          currentNetwork={currentNetwork}
        />

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
            copyAddressHandler={copyAddressHandler}
            currentNetwork={currentNetwork}
          />
        )}
        <Box
          sx={{
            paddingLeft: '24px',
            paddingRight: '24px',
            [theme.breakpoints.down('sm')]: { paddingLeft: '12px', paddingRight: '12px' }
          }}>
          {lpData.length > 0 ? (
            <>
              {lpData.map((element, index) => (
                <MemoizedLpLeaderboardItem
                  key={index}
                  displayType='item'
                  rank={element.rank}
                  positions={element.positions}
                  last24hPoints={element.last24hPoints}
                  points={element.points ?? 0}
                  address={new PublicKey(element.address)}
                  domain={element.domain}
                  copyAddressHandler={copyAddressHandler}
                  currentNetwork={currentNetwork}
                />
              ))}
              {new Array(itemsPerPage - lpData.length).fill('').map((_, index) => (
                <EmptyRow key={index} />
              ))}
            </>
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
        <MemoizedSwapLeaderboardItem
          displayType='header'
          copyAddressHandler={copyAddressHandler}
          currentNetwork={currentNetwork}
        />

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
            copyAddressHandler={copyAddressHandler}
            currentNetwork={currentNetwork}
          />
        )}
        <Box
          sx={{
            paddingLeft: '24px',
            paddingRight: '24px',
            [theme.breakpoints.down('sm')]: { paddingLeft: '12px', paddingRight: '12px' }
          }}>
          {swapData.length > 0 ? (
            <>
              {swapData.map((element, index) => (
                <MemoizedSwapLeaderboardItem
                  key={index}
                  displayType='item'
                  rank={element.rank}
                  swaps={element.swaps}
                  last24hPoints={element.last24hPoints}
                  points={element.points ?? 0}
                  address={new PublicKey(element.address)}
                  domain={element.domain}
                  copyAddressHandler={copyAddressHandler}
                  currentNetwork={currentNetwork}
                />
              ))}
              {new Array(itemsPerPage - swapData.length).fill('').map((_, index) => (
                <EmptyRow key={index} />
              ))}
            </>
          ) : (
            <NotFoundPlaceholder title='Leaderboard is empty...' />
          )}
        </Box>
      </>
    )
  return (
    <>
      <MemoizedTotalLeaderboardItem
        displayType='header'
        copyAddressHandler={copyAddressHandler}
        currentNetwork={currentNetwork}
      />

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
          copyAddressHandler={copyAddressHandler}
          currentNetwork={currentNetwork}
        />
      )}
      <Box
        sx={{
          paddingLeft: '24px',
          paddingRight: '24px',
          [theme.breakpoints.down('sm')]: { paddingLeft: '12px', paddingRight: '12px' }
        }}>
        {totalData.length > 0 ? (
          <>
            {totalData.map((element, index) => (
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
                copyAddressHandler={copyAddressHandler}
                currentNetwork={currentNetwork}
              />
            ))}
            {new Array(itemsPerPage - totalData.length).fill('').map((_, index) => (
              <EmptyRow key={index} />
            ))}
          </>
        ) : (
          <NotFoundPlaceholder title='Leaderboard is empty...' />
        )}
      </Box>
    </>
  )
}
const LeaderboardList: React.FC<LeaderboardListProps> = ({
  copyAddressHandler,
  currentNetwork,
  type,
  lpData,
  swapData,
  totalData,
  totalItemsObject,
  itemsPerPage,
  currentPage,
  walletStatus,
  isLoading,
  userStats,
  handlePageChange
}) => {
  const { classes } = useStyles()

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

  const isConnected = useMemo(() => walletStatus === Status.Initialized, [walletStatus])

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
        userStats.total,
        copyAddressHandler,
        currentNetwork
      ),
    [type, isLoading, lpData, swapData, totalData, isConnected, userStats]
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
        <Box sx={isMobile ? { paddingLeft: '12px', paddingRight: '12px' } : {}}>
          <Box
            className={classes.box1}
            sx={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 0 10px 0'
            }}>
            <PaginationList
              pages={totalPages}
              defaultPage={currentPage}
              handleChangePage={handlePageChange}
              variant='center'
            />

            <Typography
              sx={{
                ...(!isMobile && {
                  right: '24px'
                }),
                position: !isMobile ? 'absolute' : 'relative',
                color: colors.invariant.textGrey
              }}>
              Showing {lowerBound}-{upperBound} of {totalItems}
            </Typography>
          </Box>
        </Box>
      )}

      {renderWaves('bottom', GreenWaves)}
    </div>
  )
}

export default LeaderboardList
