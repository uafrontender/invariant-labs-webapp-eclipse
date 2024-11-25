import { getMarketAddress, IWallet, Market } from '@invariant-labs/sdk-eclipse'
import { PublicKey } from '@solana/web3.js'
import { NetworkType } from '@store/consts/static'
import { getSolanaConnection, networkTypetoProgramNetwork } from '../connection'
import { LiquidityLocker } from '@invariant-labs/locker-eclipse-sdk'
let _market: Market
let _locker: LiquidityLocker

export const getCurrentMarketProgram = (): Market => {
  return _market
}

export const getMarketProgram = async (
  networkType: NetworkType,
  rpcAddress: string,
  solWallet: IWallet
): Promise<Market> => {
  if (_market) {
    return _market
  }
  const net = networkTypetoProgramNetwork(networkType)

  _market = await Market.build(
    net,
    solWallet,
    getSolanaConnection(rpcAddress),
    new PublicKey(getMarketAddress(net))
  )
  return _market
}

export const getMarketProgramSync = (
  networkType: NetworkType,
  rpcAddress: string,
  solWallet: IWallet
): Market => {
  if (_market) {
    return _market
  }
  const net = networkTypetoProgramNetwork(networkType)

  const market = Market.build(
    net,
    solWallet,
    getSolanaConnection(rpcAddress),
    new PublicKey(getMarketAddress(net))
  )

  return market
}

export const getLockerProgram = (
  network: NetworkType,
  rpcAddress: string,
  solWallet: IWallet
): LiquidityLocker => {
  if (_locker) {
    return _locker
  }

  const net = networkTypetoProgramNetwork(network)

  _locker = LiquidityLocker.build(net, solWallet, getSolanaConnection(rpcAddress))
  return _locker
}
