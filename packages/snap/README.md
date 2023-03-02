# Mina Snap

This snap helps you interact with Mina protocol using Metamask Flask

## Setup
```shell
yarn install
```
## Building
Run `yarn build` to build this snap

Run `yarn build:clean` to remove old dist folder and re-build snap

## Start local snap
Run `yarn serve` to start local snap

The snap will running on `http://localhost:8080`. You can change port number in `snap.config.js` as well

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
- This snap uses a patched version of mina-signer. It may need to update if there's a new version of mina-signer.
