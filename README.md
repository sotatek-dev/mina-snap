# Mina-Portal
MetaMask Snaps is a system that allows anyone to safely expand the capabilities of MetaMask. A _snap_ is a program that we run in an isolated environment that can customize the wallet experience.

This snap helps you interact with Mina protocol using MetaMask

## Snaps is pre-release software
To interact with (your) Snaps, you will need to install [MetaMask](https://metamask.io/).
Note: To interact with the snap hosted on your local machine, you will neeed to install [MetaMask Flask](https://metamask.io/flask/)

## Getting Started
You can run and test the snap by running these commands
```shell
yarn install && yarn start
```

## Interact with mina-portal snap
Please check out the documentation in our [wiki](https://github.com/sotatek-dev/mina-snap/wiki/API-Documentation)

## Notes
- To load o1js code in your UI, you must set the COOP and COEP headers. These headers enable o1js to use SharedArrayBuffer that o1js relies on to enable important WebAssembly (Wasm) features. Please checkout this [link](https://docs.minaprotocol.com/zkapps/how-to-write-a-zkapp-ui#enabling-coop-and-coep-headers). In the local environment, create a `setupProxy.js` file inside `packages/site/src`. You can find the content of the file in the `packages/site/src/setupProxy.example.js`

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```

