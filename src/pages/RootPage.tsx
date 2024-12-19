import { useEffect, useCallback, memo, useMemo, useState, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import EventsHandlers from '@containers/EventsHandlers'
import FooterWrapper from '@containers/FooterWrapper'
import HeaderWrapper from '@containers/HeaderWrapper/HeaderWrapper'
import { Grid } from '@mui/material'
import { Status, actions as solanaConnectionActions } from '@store/reducers/solanaConnection'
import { status as connectionStatus } from '@store/selectors/solanaConnection'
import { toBlur } from '@utils/uiUtils'
import useStyles from './style'
import { status } from '@store/selectors/solanaWallet'
import { Status as WalletStatus } from '@store/reducers/solanaWallet'
import { actions } from '@store/reducers/positions'
import { TimerBanner } from './LeaderboardPage/components/LeaderboardBanner/TimerBanner'
import { useCountdown } from './LeaderboardPage/components/LeaderboardTimer/useCountdown'
import { NormalBanner } from './LeaderboardPage/components/LeaderboardBanner/NormalBanner'
import { LAUNCH_DATE } from './LeaderboardPage/config'

const BANNER_STORAGE_KEY = 'invariant-banner-state'
const BANNER_HIDE_DURATION = 1000 * 60 * 60 * 24 // 24 hours

const RootPage: React.FC = memo(() => {
  const [showHeader, setShowHeader] = useState(() => {
    const storedData = localStorage.getItem(BANNER_STORAGE_KEY)
    if (storedData) {
      try {
        const { hiddenAt } = JSON.parse(storedData)
        const currentTime = new Date().getTime()
        return currentTime - hiddenAt >= BANNER_HIDE_DURATION
      } catch (error) {
        return true
      }
    }
    return true
  })

  const [isHiding, setIsHiding] = useState(false)
  const dispatch = useDispatch()
  const signerStatus = useSelector(connectionStatus)
  const walletStatus = useSelector(status)
  const navigate = useNavigate()
  const location = useLocation()

  const { classes } = useStyles()

  const initConnection = useCallback(() => {
    dispatch(solanaConnectionActions.initSolanaConnection())
  }, [dispatch])

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/exchange')
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    initConnection()
  }, [initConnection])

  useEffect(() => {
    if (signerStatus === Status.Initialized && walletStatus === WalletStatus.Initialized) {
      dispatch(actions.getPositionsList())
    }
  }, [signerStatus, walletStatus])

  const [isExpired, setExpired] = useState(false)
  const targetDate = useMemo(() => {
    const date = new Date(LAUNCH_DATE)
    return date
  }, [])

  const { hours, minutes, seconds } = useCountdown({
    targetDate,
    onExpire: () => {
      setExpired(true)
    }
  })

  const handleBannerClose = () => {
    setIsHiding(true)
    setTimeout(() => {
      setShowHeader(false)
      localStorage.setItem(
        BANNER_STORAGE_KEY,
        JSON.stringify({
          hiddenAt: new Date().getTime()
        })
      )
      setIsHiding(false)
    }, 400)
  }

  useLayoutEffect(() => {
    const checkBannerState = () => {
      const storedData = localStorage.getItem(BANNER_STORAGE_KEY)
      if (storedData) {
        try {
          const { hiddenAt } = JSON.parse(storedData)
          const currentTime = new Date().getTime()
          if (currentTime - hiddenAt < BANNER_HIDE_DURATION) {
            setShowHeader(false)
          } else {
            localStorage.removeItem(BANNER_STORAGE_KEY)
            setShowHeader(true)
          }
        } catch (error) {
          console.error('Error parsing banner state:', error)
          localStorage.removeItem(BANNER_STORAGE_KEY)
        }
      }
    }

    checkBannerState()
  }, [])

  return (
    <>
      {signerStatus === Status.Initialized && <EventsHandlers />}
      <div id={toBlur}>
        {showHeader && (
          <>
            {isExpired ? (
              <NormalBanner onClose={handleBannerClose} isHiding={isHiding} />
            ) : (
              <TimerBanner seconds={seconds} minutes={minutes} hours={hours} />
            )}
          </>
        )}
        <Grid className={classes.root}>
          <HeaderWrapper />
          <Grid className={classes.body}>
            <Outlet />
          </Grid>
          <FooterWrapper />
        </Grid>
      </div>
    </>
  )
})

export default RootPage
