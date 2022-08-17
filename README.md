# Example project

Example project that simply sends a transfer using an HSM on GCP.

The first step is creating the HSM itself:
1. Open KMS on Google Cloud: https://console.cloud.google.com/security/kms
2. Create a new Key Ring.
3. Open the key ring and create a new key. Set "Protection level" to "HSM", "Purpose" to "Asymmetric sign" and "Algorithm" to "Elliptic Curve secp256k1 - SHA256 Digest".
4. Open the key, click on the 3 dots under "Actions" and "Copy resource name". It will look something like `projects/{your-project}}/locations/global/keyRings/{key-ring-name}/cryptoKeys/{key-name}/cryptoKeyVersions/1`.
5. Copy the `.env` file into `.env.template` and set `HSM_KEY_VERSION` to the copied value.

Now you need a service account with KMS permissions to use the HSM. Note that it's recommended not to download the service account directly, Google recomends [Workload identity federation](https://cloud.google.com/iam/docs/workload-identity-federation?_ga=2.64930668.-2146208758.1652916930) to grant permissions to relevant resources directly. We'll use the service account to run this local example though:

1. Open IAM and navigate to "Service Accounts" in the side menu.
2. Click on "Create new Service Account", set it a name and press "Create and continue".
3. You can grant more granular permissions or more general ones. At the very least you'll need the "Cloud KMS CryptoKey Signer" role. Press "Done".
4. Open the newly created Service Account and navigate to the "Keys" tab.
5. "Add key" -> "Create new key" -> "JSON"
6. Download the key and move it to this repo under the name `serviceAccountKey.json`

Now you're good to go, run the code with `yarn build && yarn start`. In the first run you should see `Sending from 0x012345abc` with your HSM's address there. The tx will fail because it doesn't have CELO to pay for gas. Send it a bit and run again. You should now have sent your first transaction with a GCP HSM!
