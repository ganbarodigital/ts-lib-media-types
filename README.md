# MediaTypes Library for Typescript

## Introduction

This TypeScript library provides a `MediaType` type that supports [RFC 2045][RFC 2045] and [RFC 6838][RFC 6838] MediaType strings:

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [V1 API](#v1-api)
  - [MediaType Value Type](#mediatype-value-type)
  - [MediaTypeParts](#mediatypeparts)
  - [isMediaType()](#ismediatype)
  - [parseMediaType()](#parsemediatype)
  - [mustBeMediaType()](#mustbemediatype)
- [NPM Scripts](#npm-scripts)
  - [npm run clean](#npm-run-clean)
  - [npm run build](#npm-run-build)
  - [npm run test](#npm-run-test)
  - [npm run cover](#npm-run-cover)

## Quick Start

```
# run this from your Terminal
npm install @ganbarodigital/ts-lib-mediatypes
```

```typescript
// add this import to your Typescript code
import { MediaType } from "@ganbarodigital/ts-lib-mediatypes/lib/v1"
```

__VS Code users:__ once you've added a single import anywhere in your project, you'll then be able to auto-import anything else that this library exports.

## V1 API

### MediaType Value Type

TBD.

### MediaTypeParts

TBD.

### isMediaType()

```typescript
// how to import this into your own code
import { isMediaType } from "@ganbarodigital/ts-lib-mediatypes/lib/v1";

/**
 * Data guard. Returns `true` if the input string matches the structure
 * of an RFC2046 / RFC6838 media type.
 *
 * @param input
 */
export function isMediaType(input: string): boolean;
```

`isMediaType()` is a _data guard_. Use it to prove that a string contains something with the structure of a MediaType:

    type "/" [tree "."] subtype ["+" suffix] *[";" parameter]

### parseMediaType()

TBD.

### mustBeMediaType()

TBD.

## NPM Scripts

### npm run clean

Use `npm run clean` to delete all of the compiled code.

### npm run build

Use `npm run build` to compile the Typescript into plain Javascript. The compiled code is placed into the `lib/` folder.

`npm run build` does not compile the unit test code.

### npm run test

Use `npm run test` to compile and run the unit tests. The compiled code is placed into the `lib/` folder.

### npm run cover

Use `npm run cover` to compile the unit tests, run them, and see code coverage metrics.

Metrics are written to the terminal, and are also published as HTML into the `coverage/` folder.

[RFC 2045]: https://tools.ietf.org/html/rfc2045
[RFC 6838]: https://tools.ietf.org/html/rfc6838