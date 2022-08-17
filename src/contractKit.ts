import { ContractKit, newKitFromWeb3 } from '@celo/contractkit'
import Web3 from 'web3'
import { GcpHsmWallet } from './GcpHsmWallet'

let contractKit: ContractKit
export async function getContractKit(): Promise<ContractKit> {
  if (contractKit) {
    return contractKit
  }

  if (!process.env.HSM_KEY_VERSION) {
  }

  const gcpWallet = new GcpHsmWallet(process.env.HSM_KEY_VERSION!)
  await gcpWallet.init()

  const web3 = new Web3('https://forno.celo.org')
  contractKit = newKitFromWeb3(web3, gcpWallet)
  return contractKit
}

export async function contract(
  contractAbi: any,
  address: string,
  contractKit: ContractKit,
) {
  const kit = contractKit ?? (await getContractKit())
  return new kit.web3.eth.Contract(contractAbi, address)
}
