import Header from '@components/Header/Header'
import { RPC, CHAINS, RECOMMENDED_RPC_ADDRESS, NetworkType } from '@store/consts/static'
import { actions, RpcStatus } from '@store/reducers/solanaConnection'
import { Status, actions as walletActions } from '@store/reducers/solanaWallet'
import { network, rpcAddress, rpcStatus } from '@store/selectors/solanaConnection'
import { address, balance, status, thankYouModalShown } from '@store/selectors/solanaWallet'
import { nightlyConnectAdapter } from '@utils/web3/selector'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { actions as snackbarsActions } from '@store/reducers/snackbars'
import { actions as leaderboardActions } from '@store/reducers/leaderboard'
import { Chain, WalletType } from '@store/consts/types'
import { RpcErrorModal } from '@components/RpcErrorModal/RpcErrorModal'
import { ThankYouModal } from '@components/Modals/ThankYouModal/ThankYouModal'
import { changeToNightlyAdapter, connectStaticWallet, getEclipseWallet } from '@utils/web3/wallet'
import { sleep } from '@invariant-labs/sdk-eclipse'
import { getLeaderboardQueryParams } from '@store/selectors/leaderboard'

export const HeaderWrapper: React.FC = () => {
  const dispatch = useDispatch()
  const walletStatus = useSelector(status)
  const currentNetwork = useSelector(network)
  const currentRpc = useSelector(rpcAddress)
  const isThankYouModalShown = useSelector(thankYouModalShown)
  const walletBalance = useSelector(balance)
  const leaderboardQueryParams = useSelector(getLeaderboardQueryParams)
  const location = useLocation()
  const walletAddress = useSelector(address)
  const navigate = useNavigate()

  const hideThankYouModal = () => {
    dispatch(walletActions.showThankYouModal(false))
  }

  useEffect(() => {
    const reconnectStaticWallet = async (wallet: WalletType) => {
      await connectStaticWallet(wallet)
      dispatch(walletActions.connect(true))
      dispatch(
        leaderboardActions.getLeaderboardData({
          page: leaderboardQueryParams.page,
          itemsPerPage: leaderboardQueryParams.pageSize
        })
      )
    }

    const eagerConnectToNightly = async () => {
      try {
        changeToNightlyAdapter()
        const nightlyAdapter = getEclipseWallet()

        await nightlyAdapter.connect()
        await sleep(500)
        if (!nightlyAdapter.connected) {
          await nightlyAdapter.connect()
          await sleep(500)
        }
        dispatch(walletActions.connect(true))
        dispatch(
          leaderboardActions.getLeaderboardData({
            page: leaderboardQueryParams.page,
            itemsPerPage: leaderboardQueryParams.pageSize
          })
        )
      } catch (error) {
        console.error('Error during Nightly eager connection:', error)
      }
    }

    ;(async () => {
      if (currentNetwork === NetworkType.Devnet) {
        dispatch(actions.setNetwork(NetworkType.Testnet))
        dispatch(actions.setRPCAddress(RPC.TEST))
      }

      const walletType = localStorage.getItem('WALLET_TYPE') as WalletType | null

      if (walletType === WalletType.NIGHTLY) {
        const canEagerConnect = await nightlyConnectAdapter.canEagerConnect().catch(error => {
          console.error('Error checking eager connect:', error)
          return false
        })
        if (canEagerConnect) {
          await eagerConnectToNightly()
        }
      } else if (walletType) {
        await reconnectStaticWallet(walletType)
      }
    })()
  }, [])

  const shouldResetRpc = useMemo(() => {
    const defaultRpcNumber = localStorage.getItem(`INVARIANT_DEFAULT_RPC_NUMBER`)

    const currentRpcNumber =
      RECOMMENDED_RPC_ADDRESS[NetworkType.Mainnet].slice(-12, -1) +
      RECOMMENDED_RPC_ADDRESS[NetworkType.Testnet].slice(-15, -5) +
      RECOMMENDED_RPC_ADDRESS[NetworkType.Devnet].slice(-15, -5)

    if (defaultRpcNumber === null || currentRpcNumber !== defaultRpcNumber) {
      localStorage.setItem(`INVARIANT_DEFAULT_RPC_NUMBER`, currentRpcNumber)
      return true
    } else {
      return false
    }
  }, [])

  const defaultTestnetRPC = useMemo(() => {
    const lastRPC = localStorage.getItem(`INVARIANT_RPC_Eclipse_${NetworkType.Testnet}`)

    if (lastRPC === null || shouldResetRpc) {
      localStorage.setItem(
        `INVARIANT_RPC_Eclipse_${NetworkType.Testnet}`,
        RECOMMENDED_RPC_ADDRESS[NetworkType.Testnet]
      )
    }

    return lastRPC === null || shouldResetRpc ? RPC.TEST : lastRPC
  }, [shouldResetRpc])

  const defaultDevnetRPC = useMemo(() => {
    const lastRPC = localStorage.getItem(`INVARIANT_RPC_Eclipse_${NetworkType.Devnet}`)

    if (lastRPC === null || shouldResetRpc) {
      localStorage.setItem(
        `INVARIANT_RPC_Eclipse_${NetworkType.Devnet}`,
        RECOMMENDED_RPC_ADDRESS[NetworkType.Devnet]
      )
    }

    return lastRPC === null || shouldResetRpc ? RPC.DEV_EU : lastRPC
  }, [shouldResetRpc])

  const defaultMainnetRPC = useMemo(() => {
    const lastRPC = localStorage.getItem(`INVARIANT_RPC_Eclipse_${NetworkType.Mainnet}`)

    if (lastRPC === null || shouldResetRpc) {
      localStorage.setItem(
        `INVARIANT_RPC_Eclipse_${NetworkType.Mainnet}`,
        RECOMMENDED_RPC_ADDRESS[NetworkType.Mainnet]
      )
    }

    return lastRPC === null || shouldResetRpc ? RPC.MAIN : lastRPC
  }, [shouldResetRpc])

  const activeChain = CHAINS.find(chain => chain.name === Chain.Eclipse) ?? CHAINS[0]

  const currentRpcStatus = useSelector(rpcStatus)

  const useDefaultRpc = () => {
    localStorage.setItem(
      `INVARIANT_RPC_Eclipse_${currentNetwork}`,
      RECOMMENDED_RPC_ADDRESS[currentNetwork]
    )
    dispatch(actions.setRPCAddress(RECOMMENDED_RPC_ADDRESS[currentNetwork]))
    dispatch(actions.setRpcStatus(RpcStatus.Uninitialized))
    localStorage.setItem('IS_RPC_WARNING_IGNORED', 'false')
    window.location.reload()
  }

  const useCurrentRpc = () => {
    dispatch(actions.setRpcStatus(RpcStatus.IgnoredWithError))
    localStorage.setItem('IS_RPC_WARNING_IGNORED', 'true')
  }

  return (
    <>
      {currentRpcStatus === RpcStatus.Error &&
        currentRpc !== RECOMMENDED_RPC_ADDRESS[currentNetwork] && (
          <RpcErrorModal
            rpcAddress={currentRpc}
            useDefaultRpc={useDefaultRpc}
            useCurrentRpc={useCurrentRpc}
          />
        )}
      {isThankYouModalShown && <ThankYouModal hideModal={hideThankYouModal} />}
      <Header
        address={walletAddress}
        onNetworkSelect={(network, rpcAddress) => {
          if (rpcAddress !== currentRpc) {
            localStorage.setItem(`INVARIANT_RPC_Eclipse_${network}`, rpcAddress)
            dispatch(actions.setRPCAddress(rpcAddress))
            dispatch(actions.setRpcStatus(RpcStatus.Uninitialized))
            localStorage.setItem('IS_RPC_WARNING_IGNORED', 'false')
            window.location.reload()
          }

          if (network !== currentNetwork) {
            if (location.pathname.startsWith('/exchange')) {
              navigate('/exchange')
            }

            if (location.pathname.startsWith('/newPosition')) {
              navigate('/newPosition')
            }

            dispatch(actions.setNetwork(network))
          }
        }}
        onConnectWallet={() => {
          dispatch(walletActions.connect(false))
        }}
        landing={location.pathname.substring(1)}
        walletConnected={walletStatus === Status.Initialized}
        onDisconnectWallet={() => {
          dispatch(walletActions.disconnect())
        }}
        onFaucet={() => dispatch(walletActions.airdrop())}
        typeOfNetwork={currentNetwork}
        rpc={currentRpc}
        defaultTestnetRPC={defaultTestnetRPC}
        onCopyAddress={() => {
          navigator.clipboard.writeText(walletAddress.toString())

          dispatch(
            snackbarsActions.add({
              message: 'Wallet address copied.',
              variant: 'success',
              persist: false
            })
          )
        }}
        activeChain={activeChain}
        onChainSelect={chain => {
          if (chain.name !== activeChain.name) {
            window.location.replace(chain.address)
          }
        }}
        network={currentNetwork}
        defaultDevnetRPC={defaultDevnetRPC}
        rpcStatus={currentRpcStatus}
        defaultMainnetRPC={defaultMainnetRPC}
        walletBalance={walletStatus === Status.Initialized ? walletBalance : null}
      />
    </>
  )
}

export default HeaderWrapper
