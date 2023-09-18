# Mina Portal

This snap helps you interact with Mina Protocol using MetaMask.

**Important**

You must install MetaMask before using this snap.

## Setup
```shell
yarn install
```
## Building
Run `yarn build` to build this snap

Run `yarn build:clean` to remove old dist folder and re-build snap

## Start local snap
Run `yarn serve` to start local snap

By default, the snap runs on `http://localhost:8080`. You can change port number in `snap.config.js`.

To connect your DApp to the local snap, call the `wallet_requestSnaps` method with `http://localhost:8080` as the `snapId`.

To learn more about Snaps JSON-RPC API, see https://docs.metamask.io/guide/snaps-rpc-api.html#wallet-requestsnaps.

## Using published snap

Connect to the published snap, call the `wallet_requestSnaps` method with `npm:mina-portal` as the `snapId`.

## Notes

- Babel is used for transpiling TypeScript to JavaScript. When building with the CLI,
  set `transpilationMode` to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you must add the following entry to your `tsconfig.json` file:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```

## Publish snap to npm
- Update the `version` in `package.json`, then run:
```
yarn build
```
- Run the following command to publish to NPM:
```
npm publish
```

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
| mina_sendPayment               | Transfer MINA Token                           |
| mina_resetSnapConfig           | Reset snap config to default                  |
| mina_getTxHistory              | Return transaction history by user address    |
| mina_getTxDetail               | Return transaction detail by transaction hash |
| mina_getTxStatus               | Return transaciton status by transaction id   |
| mina_sendStakeDelegation       | Send stake delegation                         |
| mina_verifyMessage             | Verify signed message                         |
| mina_requestNetwork            | Request network                               |
| mina_sendTransaction           | Send zkApp transaction                        |


## Implement zkApp transaction
- To make zkApp transactions with your smart contract, you use the smart contract `.js` file. See [How zkApps Work](https://docs.minaprotocol.com/zkapps/how-zkapps-work).
- Install `o1js` on your front-end site and use `o1js` to make the transaction.
- Then submit your transaction using snap.

Here is an example:

```
import {
    Mina,
    PublicKey,
    fetchAccount,
    Field,
  } from 'o1js';

(async() => {
    const { <Your smart contract class name> } = await import(<Path to your built smart contract>);
    const zkAppAddress = <Your deployed smart contract address>
    const graphqlEndpoint = <replace the graphql endpoint here>
    const zkApp = new <Your smart contract class name>(PublicKey.fromBase58(zkAppAddress));
    Mina.setActiveInstance(Mina.Network(<graphqlEndpoint>));
    <Your smart contract class name>.compile();
    const account = await fetchAccount({publicKey: zkAppAddress, ...zkApp}, <graphqlEndpoint>);
    const tx = await Mina.transaction({
        sender: PublicKey.fromBase58(<sender address>),
        fee: <replace the fee here>
    }, () => {
        zkApp.update(<your parameter>);
    });
    const provedTx = await tx.prove();
    await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: <the mina-portal snap id>,
        request: {
          method: 'mina_sendTransaction',
          params: {
            transaction: tx.toJSON(),
            feePayer: {
              fee: <replace the fee here>,
              memo: <user' memo>,
            }
          }
        },
      },
    });
})();
```
