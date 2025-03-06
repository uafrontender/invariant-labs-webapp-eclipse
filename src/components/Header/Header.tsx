import NavbarButton from '@components/Navbar/NavbarButton'
import DotIcon from '@mui/icons-material/FiberManualRecordRounded'
import { CardMedia, Grid, useMediaQuery } from '@mui/material'
import icons from '@static/icons'
import { theme } from '@static/theme'
import { RPC, NetworkType } from '@store/consts/static'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ChangeWalletButton from './HeaderButton/ChangeWalletButton'
import useStyles from './style'
import { ISelectChain, ISelectNetwork } from '@store/consts/types'
import { RpcStatus } from '@store/reducers/solanaConnection'
import { PublicKey } from '@solana/web3.js'
import { YourPointsButton } from './HeaderButton/YourPointsButton'
import { BN } from '@coral-xyz/anchor'
import { Bar } from '@components/Bar/Bar'

export interface IHeader {
  address: PublicKey
  onNetworkSelect: (networkType: NetworkType, rpcAddress: string, rpcName?: string) => void
  onConnectWallet: () => void
  walletConnected: boolean
  landing: string
  typeOfNetwork: NetworkType
  rpc: string
  onFaucet: () => void
  onDisconnectWallet: () => void
  defaultTestnetRPC: string
  onCopyAddress: () => void
  activeChain: ISelectChain
  onChainSelect: (chain: ISelectChain) => void
  network: NetworkType
  defaultDevnetRPC: string
  defaultMainnetRPC: string
  rpcStatus: RpcStatus
  walletBalance: BN | null
}

export const Header: React.FC<IHeader> = ({
  address,
  onNetworkSelect,
  onConnectWallet,
  walletConnected,
  landing,
  typeOfNetwork,
  rpc,
  onFaucet,
  onDisconnectWallet,
  onCopyAddress,
  onChainSelect
}) => {
  const { classes } = useStyles()
  const navigate = useNavigate()

  const is650Down = useMediaQuery(theme.breakpoints.down(650))
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'))

  const routes = [
    'exchange',
    'liquidity',
    'portfolio',
    ...(typeOfNetwork === NetworkType.Testnet ? ['creator'] : []),
    ...(typeOfNetwork === NetworkType.Mainnet ? ['points'] : []),
    'statistics'
  ]

  const otherRoutesToHighlight: Record<string, RegExp[]> = {
    liquidity: [/^liquidity\/*/],
    exchange: [/^exchange\/*/],
    portfolio: [/^portfolio\/*/, /^newPosition\/*/, /^position\/*/],

    ...(typeOfNetwork === NetworkType.Mainnet ? { leaderboard: [/^points\/*/] } : {}),
    ...(typeOfNetwork === NetworkType.Testnet ? { creator: [/^creator\/*/] } : {})
  }

  const [activePath, setActive] = useState('exchange')

  useEffect(() => {
    setActive(landing)
  }, [landing])

  const testnetRPCs: ISelectNetwork[] = [
    {
      networkType: NetworkType.Testnet,
      rpc: RPC.TEST,
      rpcName: 'Eclipse Testnet'
    }
  ]

  const mainnetRPCs: ISelectNetwork[] = [
    {
      networkType: NetworkType.Mainnet,
      rpc: RPC.MAIN_TRITON,
      rpcName: 'Triton'
    },
    {
      networkType: NetworkType.Mainnet,
      rpc: RPC.MAIN_HELIUS,
      rpcName: 'Helius'
    },
    {
      networkType: NetworkType.Mainnet,
      rpc: RPC.MAIN,
      rpcName: 'Eclipse'
    },
    {
      networkType: NetworkType.Mainnet,
      rpc: RPC.MAIN_LGNS,
      rpcName: 'LGNS'
    }
  ]

  const devnetRPCs: ISelectNetwork[] = [
    {
      networkType: NetworkType.Devnet,
      rpc: RPC.DEV,
      rpcName: 'Eclipse '
    },
    {
      networkType: NetworkType.Devnet,
      rpc: RPC.DEV_EU,
      rpcName: 'Eclipse EU'
    }
  ]

  const rpcs = [...testnetRPCs, ...mainnetRPCs, ...devnetRPCs]

  return (
    <Grid container>
      <Grid container className={classes.root} direction='row' alignItems='center' wrap='nowrap'>
        <Grid container item className={classes.leftSide} justifyContent='flex-start'>
          <CardMedia
            className={is650Down ? classes.logoShort : classes.logo}
            image={is650Down ? icons.LogoShort : icons.LogoTitle}
            onClick={() => {
              if (!activePath.startsWith('exchange')) {
                navigate('/exchange')
              }
            }}
          />
        </Grid>

        <Grid
          container
          item
          className={classes.routers}
          wrap='nowrap'
          sx={{
            display: { lg: 'block' },
            '@media (max-width: 1200px)': {
              display: 'none'
            }
          }}>
          {routes.map(path => (
            <Link key={`path-${path}`} to={`/${path}`} className={classes.link}>
              <NavbarButton
                name={path}
                onClick={e => {
                  if (path === 'exchange' && activePath.startsWith('exchange')) {
                    e.preventDefault()
                  }

                  setActive(path)
                }}
                active={
                  path === activePath ||
                  (!!otherRoutesToHighlight[path] &&
                    otherRoutesToHighlight[path].some(pathRegex => pathRegex.test(activePath)))
                }
              />
            </Link>
          ))}
        </Grid>

        <Grid container item className={classes.buttons} wrap='nowrap'>
          <Bar
            rpcs={rpcs}
            activeNetwork={typeOfNetwork}
            activeRPC={rpc}
            onNetworkChange={onNetworkSelect}
            onChainChange={onChainSelect}
            onFaucet={onFaucet}
          />

          <Grid>
            <YourPointsButton />
          </Grid>

          <ChangeWalletButton
            name={
              walletConnected
                ? `${address.toString().slice(0, 4)}...${
                    !isSmDown
                      ? address
                          .toString()
                          .slice(address.toString().length - 4, address.toString().length)
                      : ''
                  }`
                : isSmDown
                  ? 'Connect'
                  : 'Connect wallet'
            }
            onConnect={onConnectWallet}
            connected={walletConnected}
            onDisconnect={onDisconnectWallet}
            startIcon={
              walletConnected ? <DotIcon className={classes.connectedWalletIcon} /> : undefined
            }
            onCopyAddress={onCopyAddress}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
export default Header
