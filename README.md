# Mina-Portal

MetaMask Snaps is a system that allows anyone to safely expand the capabilities of MetaMask. A _snap_ is a program that we run in an isolated environment that can customize the wallet experience.

This snap helps you interact with Mina protocol using Metamask

## Snaps is pre-release software

To interact with (your) Snaps, you will need to install [MetaMask](https://metamask.io/).

## Getting Started
You can run and test the snap by running these commands
```shell
yarn install && yarn start
```

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
