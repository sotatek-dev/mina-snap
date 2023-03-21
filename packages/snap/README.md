# Mina Snap

This snap helps you interact with Mina protocol using Metamask Flask

**Important**

This snap only works with Metamask Flask. If you have normal Metamask enabled, please disable it and install Metamask Flask before using this snap.

## Setup
```shell
yarn install
```
## Building
Run `yarn build` to build this snap

Run `yarn build:clean` to remove old dist folder and re-build snap

## Start local snap
Run `yarn serve` to start local snap

The snap will be running on `http://localhost:8080`. You can change port number in `snap.config.js` as well

Your DApp now can connect to the snap by calling `wallet_requestSnaps` method with `http://localhost:8080` as the snapId

(Reference: https://docs.metamask.io/guide/snaps-rpc-api.html#wallet-requestsnaps)

## Using published snap
Connect to the snap by calling `wallet_requestSnaps` method with `npm:test-mina-snap` as the snapId

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
- This snap uses a patched version of mina-signer. It may need to update if there's a new version of mina-signer. We are using this repo as the dependency http://www.github.com/sotatek-dev/mina-signer-for-snap

## Methods
| Method                         | Description                                   |
| ------------------------------ | --------------------------------------------- |
| mina_accountInfo               | Get current account info                      |
| mina_accountList               | Return account list                           |
| mina_createAccount             | Create new account                            |
| mina_changeAccount             | Change Address                                |
| mina_changeNetwork             | Change Network                                |
| mina_importAccountByPrivateKey | Import account by private key                 |
| mina_exportPrivateKey          | Return private key of the current account     |
| mina_editAccountName           | Edit account name                             |
| mina_networkConfig             | Return current network config                 |
| mina_signMessage               | Sign custom message                           |
| mina_sendPayment               | Transfer Mina Token                           |
| mina_resetSnapConfig           | Reset snap config to default                  |
| mina_getTxHistory              | Return transaction history by user address    |
| mina_getTxDetail               | Return transaction detail by transaction hash |
| mina_getTxStatus               | Return transaciton status by transaction id   |
| mina_sendStakeDelegation       | Send stake delegation                         |
| mina_verifyMessage             | Verify signed message                         |
| mina_requestNetwork            | Request network                               |
