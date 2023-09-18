# Mina Portal

MetaMask Snaps is a system that allows you to safely expand the capabilities of MetaMask. A _snap_ is a program that runs in an isolated environment that can customize the wallet experience.

This snap helps you interact with Mina Protocol using MetaMask.

## Snaps is pre-release software

To interact with Snaps, you must install [MetaMask](https://metamask.io/).

## Getting Started
You can run and test the snap by running these commands:

```shell
yarn install && yarn start
```

## Notes

- Babel is used for transpiling TypeScript to JavaScript. When building with the MetaMask CLI, set `transpilationMode` to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you must add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
