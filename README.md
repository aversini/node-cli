# Node CLI

## Introduction

This repository is a monorepo. There are multiple packages available under the ["packages"](https://github.com/aversini/node-cli/tree/main/packages) folder. They are all intended to either provide Node CLI tools or library helpers for Node CLI tools.

## Node.js compatibility

All packages are:

- pure ESM packages, which means to use them, your packages have to use ESM too (`"type": "module"` should be set in `your package.json` file).
- this does not apply to CLI tools as they can simply be called on the command line.
- compatible with Node.js v16 and above.
