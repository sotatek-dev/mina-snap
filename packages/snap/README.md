# Mina Portal Snap

This `mina-portal snap` helps you interact with Mina protocol using MetaMask

**Important**

Please install MetaMask before using this snap.

## Setup
```shell
yarn install
```
## Building
Run `yarn build` to build this snap

Run `yarn build:clean` to remove old dist folder and re-build snap

## Start local snap
Note: To interact with the snap hosted on your local machine, you will need to use [MetaMask Flask](https://metamask.io/flask/) and make sure to disable the normal MetaMask before using the Flask version.

Run `yarn serve` to start local snap

The snap will be running on `http://localhost:8080`. You can change port number in `snap.config.js` as well

Your DApp now can connect to the snap by calling `wallet_requestSnaps` method with `http://localhost:8080` as the snapId

(Reference: https://docs.metamask.io/guide/snaps-rpc-api.html#wallet-requestsnaps)

## Using published snap
Connect to the snap by calling `wallet_requestSnaps` method with `npm:mina-portal` as the snapId

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```

## Publish snap to NPM
- Update the `version` in `package.json` then run:
```
yarn build
```
- Run the below command to publish to NPM:
```
npm publish
```

## Methods
To learn more about how to interact with these methods from your ZkApp, please check out the documentation in our [wiki](https://github.com/sotatek-dev/mina-snap/wiki/API-Documentation)

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
| mina_sendTransaction           | Send ZkApp transaction                        |


## Implement ZkApp transaction
- To make ZkApp transactions with your smart contract, you will need to have the built file of the smart contract (the .js file).
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
