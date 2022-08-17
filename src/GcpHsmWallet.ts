import { Address, ReadOnlyWallet } from '@celo/connect'
import {
  bigNumberToBuffer,
  bufferToBigNumber,
  getAddressFromPublicKey,
  publicKeyFromAsn1,
  publicKeyPrefix,
  sixtyFour,
} from '@celo/wallet-hsm'
import { RemoteWallet } from '@celo/wallet-remote'
import { KeyManagementServiceClient } from '@google-cloud/kms'
import { BigNumber } from 'bignumber.js'
import { GcpHsmSigner } from './GcpHsmSigner'

/**
 * A Cloud HSM wallet built on GCP Cloud HSM
 */
export class GcpHsmWallet
  extends RemoteWallet<GcpHsmSigner>
  implements ReadOnlyWallet
{
  private client: KeyManagementServiceClient

  constructor(private readonly versionName: string) {
    super()
    this.client = new KeyManagementServiceClient()
  }

  protected async loadAccountSigners(): Promise<Map<Address, GcpHsmSigner>> {
    const addressToSigner = new Map<Address, GcpHsmSigner>()
    try {
      const publicKey = await this.getPublicKeyFromVersionName()
      const address = getAddressFromPublicKey(publicKey)
      addressToSigner.set(
        address,
        new GcpHsmSigner(this.client, this.versionName, publicKey),
      )
    } catch (e) {
      throw e
    }
    return addressToSigner
  }

  private async getPublicKeyFromVersionName(): Promise<BigNumber> {
    const [pk] = await this.client.getPublicKey({ name: this.versionName })
    const derEncodedPk = pk.pem?.split('\n').slice(1, -2).join('').trim()
    // @ts-ignore
    const pubKey = publicKeyFromAsn1(Buffer.from(derEncodedPk, 'base64'))
    const pkbuff = bigNumberToBuffer(pubKey, sixtyFour)
    const pubKeyPrefix = Buffer.from(new Uint8Array([publicKeyPrefix]))
    const rawPublicKey = Buffer.concat([pubKeyPrefix, pkbuff])
    return bufferToBigNumber(rawPublicKey)
  }
}
