import { useStyles } from './style'
import icons from '@static/icons'
// import { Switch } from '@components/Switch/Switch'
import { SelectNetworkAndRPC } from './SelectNetworkAndRPC/SelectNetworkAndRPC'
import { NetworkType } from '@store/consts/static'
import { ISelectNetwork } from '@store/consts/types'
import { Modal } from '../Modal/Modal'
import { FaucetButton } from './FaucetButton/FaucetButton'
import { Separator } from '@components/Separator/Separator'
import { useModal } from '../Modal/useModal'

type Props = {
  rpcs: ISelectNetwork[]
  activeNetwork: NetworkType
  activeRPC: string
  onNetworkChange: (network: NetworkType, rpc: string) => void
  onFaucet: () => void
}

export const SettingsModal = ({
  rpcs,
  activeNetwork,
  activeRPC,
  onNetworkChange,
  onFaucet
}: Props) => {
  const { classes } = useStyles()

  const { open, handleOpen, handleClose } = useModal()

  return (
    <Modal
      icon={<img className={classes.barButtonIcon} src={icons.settings2} alt='Settings icon' />}
      title='Settings'
      showTitle
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}>
      {/* <Switch items={['RPC', 'Priority Fee']} /> */}
      <SelectNetworkAndRPC
        rpcs={rpcs}
        activeNetwork={activeNetwork}
        activeRPC={activeRPC}
        onNetworkChange={(network, activeRPC) => {
          onNetworkChange(network, activeRPC)
          handleClose()
        }}
      />
      {activeNetwork === NetworkType.Testnet && (
        <>
          <Separator isHorizontal />
          <FaucetButton onFaucet={onFaucet} />
        </>
      )}
    </Modal>
  )
}
