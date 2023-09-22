# mina-snap


The mina-snap repository contains two packages:

- the `MinaPortal`, an open beta wallet built using the `mina-snap`. See /packages/site.
- the `mina-snap`, a snap. See /packages/snap.

[MetaMask Snaps](https://metamask.io/snaps/) is an open source system that allows anyone to safely extend the functionality of MetaMask, creating new web3 end user experiences.

A snap is a JavaScript program run in an isolated environment that customizes the [MetaMask](https://metamask.io/) wallet experience. Snaps have access to a limited set of capabilities, determined by the permissions the user grants them during installation.

The `mina-snap` is a snap which allows [MetaMask](https://metamask.io/) users to interact with the Mina Protocol.   

The `MinaPortal` is an open beta wallet, built using the `mina-snap` allowing [MetaMask](https://metamask.io/) users to interact with the Mina blockchain. 

## Snaps is pre-release software

To interact with (your) Snaps, you will need to install [MetaMask](https://metamask.io/).
Note: To interact with the snap hosted on your local machine, you will need to install [MetaMask Flask](https://metamask.io/flask/)

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
