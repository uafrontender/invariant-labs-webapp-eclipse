import {
  all,
  call,
  put,
  SagaGenerator,
  select,
  spawn,
  takeLatest,
  takeLeading
} from 'typed-redux-saga'

import airdropAdmin from '@consts/airdropAdmin'
import { airdropQuantities, airdropTokens, NetworkType, Token as StoreToken } from '@consts/static'
import { createLoaderKey, getTokenProgramId } from '@consts/utils'
import { BN } from '@project-serum/anchor'
import { actions as poolsActions } from '@reducers/pools'
import { actions as positionsActions } from '@reducers/positions'
import { actions as snackbarsActions } from '@reducers/snackbars'
import { actions, ITokenAccount, Status } from '@reducers/solanaWallet'
import { tokens } from '@selectors/pools'
import { network } from '@selectors/solanaConnection'
import { accounts, status } from '@selectors/solanaWallet'
import {
  // AccountInfo,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token'
import {
  Account,
  ParsedAccountData,
  PublicKey,
  RpcResponseAndContext,
  sendAndConfirmRawTransaction,
  Signer,
  SystemProgram,
  Transaction,
  AccountInfo,
  TransactionInstruction
} from '@solana/web3.js'
import { WalletAdapter } from '@web3/adapters/types'
import { disconnectWallet, getSolanaWallet } from '@web3/wallet'
import { closeSnackbar } from 'notistack'
import { getConnection } from './connection'
import { getTokenDetails } from './token'
import { TOKEN_2022_PROGRAM_ID } from '@invariant-labs/sdk-eclipse'
// import { actions as farmsActions } from '@reducers/farms'
// import { actions as bondsActions } from '@reducers/bonds'

export function* getWallet(): SagaGenerator<WalletAdapter> {
  const wallet = yield* call(getSolanaWallet)
  return wallet
}
export function* getBalance(pubKey: PublicKey): SagaGenerator<BN> {
  const connection = yield* call(getConnection)
  const balance = yield* call([connection, connection.getBalance], pubKey)
  return new BN(balance)
}

export function* handleBalance(): Generator {
  const wallet = yield* call(getWallet)
  yield* put(actions.setAddress(wallet.publicKey))
  yield* put(actions.setIsBalanceLoading(true))
  const balance = yield* call(getBalance, wallet.publicKey)
  yield* put(actions.setBalance(balance))
  yield* call(fetchTokensAccounts)
  yield* put(actions.setIsBalanceLoading(false))
}

interface IparsedTokenInfo {
  mint: string
  owner: string
  tokenAmount: {
    amount: string
    decimals: number
    uiAmount: number
  }
}
interface TokenAccountInfo {
  pubkey: PublicKey
  account: AccountInfo<ParsedAccountData>
}

export function* fetchTokensAccounts(): Generator {
  const connection = yield* call(getConnection)
  const wallet = yield* call(getWallet)

  // const tokenAccounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
  //   programId: TOKEN_PROGRAM_ID
  // })
  // const token2022Accounts = await connection.getTokenAccountsByOwner(wallet.publicKey, {
  //   programId: TOKEN_2022_PROGRAM_ID
  // })
  // const accountsWithProgramId = [...tokenAccounts.value, ...token2022Accounts.value].map(
  //   ({ account, pubkey }) => ({
  //     account,
  //     pubkey,
  //     programId: account.data.program === 'spl-token' ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID
  //   })
  // )

  const splTokensAccounts: RpcResponseAndContext<TokenAccountInfo[]> = yield* call(
    [connection, connection.getParsedTokenAccountsByOwner],
    wallet.publicKey,
    {
      programId: TOKEN_PROGRAM_ID
    }
  )

  console.log(splTokensAccounts)

  const token2022TokensAccounts: RpcResponseAndContext<TokenAccountInfo[]> = yield* call(
    [connection, connection.getParsedTokenAccountsByOwner],
    wallet.publicKey,
    {
      programId: TOKEN_2022_PROGRAM_ID
    }
  )

  console.log(token2022TokensAccounts)

  // Merge the values from both responses
  const mergedAccounts: TokenAccountInfo[] = [
    ...splTokensAccounts.value,
    ...token2022TokensAccounts.value
  ]

  console.log(mergedAccounts)
  const tokensAccounts = yield* call(
    [connection, connection.getParsedTokenAccountsByOwner],
    wallet.publicKey,
    {
      programId: TOKEN_PROGRAM_ID
    }
  )
  console.log(tokensAccounts)
  const allTokens = yield* select(tokens)
  const newAccounts: ITokenAccount[] = []
  const unknownTokens: Record<string, StoreToken> = {}
  for (const account of mergedAccounts) {
    const info: IparsedTokenInfo = account.account.data.parsed.info
    newAccounts.push({
      programId: new PublicKey(info.mint),
      balance: new BN(info.tokenAmount.amount),
      address: account.pubkey,
      decimals: info.tokenAmount.decimals
    })

    if (!allTokens[info.mint]) {
      unknownTokens[info.mint] = {
        name: info.mint,
        symbol: `${info.mint.slice(0, 4)}...${info.mint.slice(-4)}`,
        decimals: info.tokenAmount.decimals,
        address: new PublicKey(info.mint),
        logoURI: '/unknownToken.svg',
        isUnknown: true
      }
    }
  }

  yield* put(actions.addTokenAccounts(newAccounts))
  yield* put(poolsActions.addTokens(unknownTokens))
}

export function* getToken(tokenAddress: PublicKey): SagaGenerator<Token> {
  const connection = yield* call(getConnection)
  const programId = yield* call(getTokenProgramId, connection, new PublicKey(tokenAddress))
  const token = new Token(connection, tokenAddress, programId, new Account())
  return token
}

export function* handleAirdrop(): Generator {
  const walletStatus = yield* select(status)
  if (walletStatus !== Status.Initialized) {
    yield put(
      snackbarsActions.add({
        message: 'Connect your wallet first',
        variant: 'warning',
        persist: false
      })
    )
    return
  }

  const loaderKey = createLoaderKey()
  yield put(
    snackbarsActions.add({
      message: 'Airdrop in progress',
      variant: 'pending',
      persist: true,
      key: loaderKey
    })
  )

  const connection = yield* call(getConnection)
  const networkType = yield* select(network)
  const wallet = yield* call(getWallet)

  if (networkType === NetworkType.TESTNET) {
    // transfer sol
    // yield* call([connection, connection.requestAirdrop], airdropAdmin.publicKey, 1 * 1e9)
    console.log(wallet.publicKey.toString())
    yield* call(transferAirdropSOL)
    yield* call(
      getCollateralTokenAirdrop,
      airdropTokens[networkType],
      airdropQuantities[networkType]
    )

    yield put(
      snackbarsActions.add({
        message: 'You will soon receive airdrop of tokens',
        variant: 'success',
        persist: false
      })
    )
  } else {
    console.log(wallet.publicKey.toString())
    yield* call([connection, connection.requestAirdrop], wallet.publicKey, 1 * 1e9)

    yield* call(
      getCollateralTokenAirdrop,
      airdropTokens[networkType],
      airdropQuantities[networkType]
    )
    yield put(
      snackbarsActions.add({
        message: 'You will soon receive airdrop',
        variant: 'success',
        persist: false
      })
    )
  }

  closeSnackbar(loaderKey)
  yield put(snackbarsActions.remove(loaderKey))
}

export function* setEmptyAccounts(collateralsAddresses: PublicKey[]): Generator {
  const tokensAccounts = yield* select(accounts)
  const acc: PublicKey[] = []
  for (const collateral of collateralsAddresses) {
    const collateralTokenProgram = yield* call(getToken, collateral)
    const accountAddress = tokensAccounts[collateral.toString()]
      ? tokensAccounts[collateral.toString()].address
      : null
    if (accountAddress == null) {
      acc.push(collateralTokenProgram.publicKey)
    }
  }
  if (acc.length !== 0) {
    yield* call(createMultipleAccounts, acc)
  }
}

export function* transferAirdropSOL(): Generator {
  const wallet = yield* call(getWallet)
  console.log(wallet.publicKey.toString())
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: airdropAdmin.publicKey,
      toPubkey: wallet.publicKey,
      lamports: 50000
    })
  )
  const connection = yield* call(getConnection)
  const blockhash = yield* call([connection, connection.getRecentBlockhash])
  tx.feePayer = airdropAdmin.publicKey
  tx.recentBlockhash = blockhash.blockhash
  tx.setSigners(airdropAdmin.publicKey)
  tx.partialSign(airdropAdmin as Signer)

  const txid = yield* call(sendAndConfirmRawTransaction, connection, tx.serialize(), {
    skipPreflight: false
  })

  if (!txid.length) {
    yield put(
      snackbarsActions.add({
        message: 'Failed to airdrop testnet ETH. Please try again.',
        variant: 'error',
        persist: false,
        txid
      })
    )
  } else {
    yield put(
      snackbarsActions.add({
        message: 'Testnet ETH airdrop successfully.',
        variant: 'success',
        persist: false,
        txid
      })
    )
  }
}

export function* getCollateralTokenAirdrop(
  collateralsAddresses: PublicKey[],
  collateralsQuantities: number[]
): Generator {
  const wallet = yield* call(getWallet)
  const instructions: TransactionInstruction[] = []
  yield* call(setEmptyAccounts, collateralsAddresses)
  const tokensAccounts = yield* select(accounts)
  for (const [index, collateral] of collateralsAddresses.entries()) {
    instructions.push(
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        collateral,
        tokensAccounts[collateral.toString()].address,
        airdropAdmin.publicKey,
        [],
        collateralsQuantities[index]
      )
    )
  }
  const tx = instructions.reduce((tx, ix) => tx.add(ix), new Transaction())
  const connection = yield* call(getConnection)
  const blockhash = yield* call([connection, connection.getRecentBlockhash])
  tx.feePayer = wallet.publicKey
  tx.recentBlockhash = blockhash.blockhash
  const signedTx = yield* call([wallet, wallet.signTransaction], tx)
  signedTx.partialSign(airdropAdmin)
  yield* call([connection, connection.sendRawTransaction], signedTx.serialize(), {
    skipPreflight: true
  })
}
// export function* getTokenProgram(pubKey: PublicKey): SagaGenerator<number> {
//   const connection = yield* call(getConnection)
//   const balance = yield* call(, pubKey)
//   return balance
// }

export function* signAndSend(wallet: WalletAdapter, tx: Transaction): SagaGenerator<string> {
  const connection = yield* call(getConnection)
  const blockhash = yield* call([connection, connection.getRecentBlockhash])
  tx.feePayer = wallet.publicKey
  tx.recentBlockhash = blockhash.blockhash
  const signedTx = yield* call([wallet, wallet.signTransaction], tx)
  const signature = yield* call([connection, connection.sendRawTransaction], signedTx.serialize())
  return signature
}

export function* createAccount(tokenAddress: PublicKey): SagaGenerator<PublicKey> {
  const wallet = yield* call(getWallet)
  const connection = yield* call(getConnection)
  const programId = yield* call(getTokenProgramId, connection, new PublicKey(tokenAddress))
  const associatedAccount = yield* call(
    Token.getAssociatedTokenAddress,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    programId,
    tokenAddress,
    wallet.publicKey
  )
  const ix = Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    programId,
    tokenAddress,
    associatedAccount,
    wallet.publicKey,
    wallet.publicKey
  )
  yield* call(signAndSend, wallet, new Transaction().add(ix))
  const token = yield* call(getTokenDetails, tokenAddress.toString())
  yield* put(
    actions.addTokenAccount({
      programId: tokenAddress,
      balance: new BN(0),
      address: associatedAccount,
      decimals: token.decimals
    })
  )
  const allTokens = yield* select(tokens)
  if (!allTokens[tokenAddress.toString()]) {
    yield* put(
      poolsActions.addTokens({
        [tokenAddress.toString()]: {
          name: tokenAddress.toString(),
          symbol: `${tokenAddress.toString().slice(0, 4)}...${tokenAddress.toString().slice(-4)}`,
          decimals: token.decimals,
          address: tokenAddress,
          logoURI: '/unknownToken.svg',
          isUnknown: true
        }
      })
    )
  }
  yield* call(sleep, 1000) // Give time to subscribe to new token
  return associatedAccount
}

export function* createMultipleAccounts(tokenAddress: PublicKey[]): SagaGenerator<PublicKey[]> {
  const wallet = yield* call(getWallet)
  const connection = yield* call(getConnection)
  const ixs: TransactionInstruction[] = []
  const associatedAccs: PublicKey[] = []

  for (const address of tokenAddress) {
    const programId = yield* call(getTokenProgramId, connection, address)
    const associatedAccount = yield* call(
      Token.getAssociatedTokenAddress,
      ASSOCIATED_TOKEN_PROGRAM_ID,
      programId,
      address,
      wallet.publicKey
    )
    associatedAccs.push(associatedAccount)
    const ix = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      programId,
      address,
      associatedAccount,
      wallet.publicKey,
      wallet.publicKey
    )
    ixs.push(ix)
  }
  yield* call(
    signAndSend,
    wallet,
    ixs.reduce((tx, ix) => tx.add(ix), new Transaction())
  )
  const allTokens = yield* select(tokens)
  const unknownTokens: Record<string, StoreToken> = {}
  for (const [index, address] of tokenAddress.entries()) {
    const token = yield* call(getTokenDetails, tokenAddress[index].toString())
    yield* put(
      actions.addTokenAccount({
        programId: address,
        balance: new BN(0),
        address: associatedAccs[index],
        decimals: token.decimals
      })
    )
    // Give time to subscribe to new token
    yield* call(sleep, 1000)

    if (!allTokens[tokenAddress[index].toString()]) {
      unknownTokens[tokenAddress[index].toString()] = {
        name: tokenAddress[index].toString(),
        symbol: `${tokenAddress[index].toString().slice(0, 4)}...${tokenAddress[index]
          .toString()
          .slice(-4)}`,
        decimals: token.decimals,
        address: tokenAddress[index],
        logoURI: '/unknownToken.svg',
        isUnknown: true
      }
    }
  }

  yield* put(poolsActions.addTokens(unknownTokens))

  return associatedAccs
}

export function* init(): Generator {
  yield* put(actions.setStatus(Status.Init))
  const wallet = yield* call(getWallet)
  // const balance = yield* call(getBalance, wallet.publicKey)
  yield* put(actions.setAddress(wallet.publicKey))
  yield* put(actions.setIsBalanceLoading(true))
  const balance = yield* call(getBalance, wallet.publicKey)
  yield* put(actions.setBalance(balance))
  yield* put(actions.setStatus(Status.Initialized))
  yield* call(fetchTokensAccounts)
  yield* put(actions.setIsBalanceLoading(false))
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
export function* sendSol(amount: BN, recipient: PublicKey): SagaGenerator<string> {
  const wallet = yield* call(getWallet)
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipient,
      lamports: amount.toNumber()
    })
  )

  const txid = yield* call(signAndSend, wallet, transaction)
  return txid
}

export function* handleConnect(): Generator {
  const walletStatus = yield* select(status)
  if (walletStatus === Status.Initialized) {
    yield* put(
      snackbarsActions.add({
        message: 'Wallet already connected.',
        variant: 'info',
        persist: false
      })
    )
    return
  }
  yield* call(init)
}

export function* handleDisconnect(): Generator {
  try {
    yield* call(disconnectWallet)
    yield* put(actions.resetState())
    yield* put(positionsActions.setPositionsList([]))
    // yield* put(farmsActions.setUserStakes({}))
    yield* put(
      positionsActions.setCurrentPositionRangeTicks({
        lowerTick: undefined,
        upperTick: undefined
      })
    )
    // yield* put(bondsActions.setUserVested({}))
  } catch (error) {
    console.log(error)
  }
}

export function* connectHandler(): Generator {
  yield takeLatest(actions.connect, handleConnect)
}

export function* disconnectHandler(): Generator {
  yield takeLatest(actions.disconnect, handleDisconnect)
}

export function* airdropSaga(): Generator {
  yield takeLeading(actions.airdrop, handleAirdrop)
}

export function* initSaga(): Generator {
  yield takeLeading(actions.initWallet, init)
}

export function* handleBalanceSaga(): Generator {
  yield takeLeading(actions.getBalance, handleBalance)
}

export function* walletSaga(): Generator {
  yield all(
    [initSaga, airdropSaga, connectHandler, disconnectHandler, handleBalanceSaga].map(spawn)
  )
}
