import { Transaction, VersionedTransaction } from '@solana/web3.js'
import { WalletAdapter } from './types'
import { nightlyConnectAdapter } from '../selector'
import { DEFAULT_PUBLICKEY } from '@store/consts/static'

export class StandardAdapter implements WalletAdapter {
  constructor() {
    this.connect = this.connect.bind(this)
  }

  get connected() {
    return nightlyConnectAdapter.connected
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]> {
    return await nightlyConnectAdapter.signAllTransactions(transactions)
  }

  get publicKey() {
    return nightlyConnectAdapter.publicKey ?? DEFAULT_PUBLICKEY
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    return await nightlyConnectAdapter.signTransaction(transaction)
  }

  async signMessage(message: Uint8Array) {
    return await nightlyConnectAdapter.signMessage(message)
  }

  connect = async () => {
    if (!nightlyConnectAdapter.connected) {
      try {
        await nightlyConnectAdapter.connect()
      } catch (error) {
        console.log(error)
      }
    }
  }

  disconnect = async () => {
    if (nightlyConnectAdapter) {
      try {
        await nightlyConnectAdapter.disconnect()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
