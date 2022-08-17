import { ContractKit } from '@celo/contractkit'
import erco20Abi from './abis/ERC20.json'
import { contract, getContractKit } from './contractKit'

const CELO_ADDRESS = '0x471EcE3750Da237f93B8E339c536989b8978a438'

export async function sendTransfer() {
  try {
    const kit = await getContractKit()

    const erc20 = await contract(erco20Abi, CELO_ADDRESS, kit)

    const tx = erc20.methods.transfer(
      '0xf44e0c4e32f83a4b862d31e221dd462dcccbb6b4',
      '1' + '0'.repeat(10),
    )

    await sendTransaction(kit, tx)
  } catch (error) {
    console.error('Error when executing transfer', error)
  }
}

async function sendTransaction(kit: ContractKit, tx: any) {
  const address = (await kit.web3.eth.getAccounts())[0]

  console.info(`Sending from ${address}`)

  const gas = await tx.estimateGas({ from: address })
  const txResult = await tx.send({
    from: address,
    gas: Math.floor(gas * 1.2),
  })

  console.info(`Sent transfer with hash: ${txResult.transactionHash}`)
}

sendTransfer()
  .then(() => console.info('Finished'))
  .catch(console.error)
