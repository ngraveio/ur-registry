<h1 align="center">Ngrave UR Registry</h1>

<p align="center">
  <a href="http://commitizen.github.io/cz-cli/">
	  <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitzen friendly" />
  </a>
  <a href="https://conventionalcommits.org">
	  <img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" alt="Conventional Commits" />
  </a>
</p>

## Getting started

This is a monorepo repository using [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/), [Commitzen](http://commitizen.github.io/cz-cli/) and [Conventional Commits](https://conventionalcommits.org) to maintain and manage bc ur packages.

This repository is an implementation of [the BC-UR Registry specification](https://github.com/BlockchainCommons/Research/blob/master/papers/bcr-2020-006-urtypes.md) and an extension to [Keystone UR Registry](https://github.com/KeystoneHQ/ur-registry)

## 🌐 Links

Blockchain Commons Research

- ➡️ https://github.com/BlockchainCommons/Research

Research Paper on Multi Layer Sync Protocol:

- ➡️ https://github.com/ngraveio/Research

## 🚀 Quick start

In the root folder run following commands _(all the below commands need to run on root folder)_:

Install all dependecies with:

```bash
  yarn
```

to build

```bash
  yarn lerna run build
```

## 🗂 Monorepo structure

| Package                                                              | Description                                                                                                                      |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [`ur-packages/**`](./ur-packages)                                    | Implementations of Blockchain Commons UR packages                                                                                |
| [`@ngrave/crypto-coin-identity`](./ur-packages/crypto-coin-identity) | Implementation of `coin-identity` type that can represent a coin                                                                 |
| [`@ngrave/multi-layer-sync`](./ur-packages/multi-layer-sync)         | Implementations of following types: **crypto-detailed-account**, **crypto-coin**, **crypto-sync-metadata**, **crypto-portfolio** |
| [`@ngrave/hex-string`](./ur-packages/hex-string)                     | Implementation of `hex-string` type that encodes and decodes hex string                                                          |

## 🚨 Code standard

- [JavaScript Standard Style](https://standardjs.com/) - Javascript styleguide
- [Prettier](https://prettier.io/) - Code formatter
- [ESLint](https://eslint.org/) - Lint to quickly find problems
- [Stylelint](https://stylelint.io/) - A mighty, modern linter that helps you avoid errors and enforce conventions in your styles

## ⌨️ Commands

| Command        | Description              |
| -------------- | ------------------------ |
| `yarn`         | Install all dependencies |
| `yarn build`   | Build all packages       |
| `yarn test:ci` | Run all tests            |

