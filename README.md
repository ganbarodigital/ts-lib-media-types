# MediaType Library for Typescript

## Introduction

This TypeScript library provides a `MediaType` _value type_ that validates and supports [RFC 2045][RFC 2045] and [RFC 6838][RFC 6838] "media type" strings:

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [v1 API](#v1-api)
  - [MediaType Value Type](#mediatype-value-type)
  - [MediaTypeParts Value Type](#mediatypeparts-value-type)
  - [isMediaType()](#ismediatype)
  - [matchesContentType()](#matchescontenttype)
  - [parseContentType()](#parsecontenttype)
  - [parseMediaType()](#parsemediatype)
  - [mustBeMediaType()](#mustbemediatype)
  - [MediaTypeMatchRegexIsBrokenError](#mediatypematchregexisbrokenerror)
  - [NotAMediaTypeError](#notamediatypeerror)
  - [UnexpectedContentTypeError](#unexpectedcontenttypeerror)
- [NPM Scripts](#npm-scripts)
  - [npm run clean](#npm-run-clean)
  - [npm run build](#npm-run-build)
  - [npm run test](#npm-run-test)
  - [npm run cover](#npm-run-cover)

## Quick Start

```
# run this from your Terminal
npm install @ganbarodigital/ts-lib-mediatype
```

```typescript
// add this import to your Typescript code
import { MediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1"
```

__VS Code users:__ once you've added a single import anywhere in your project, you'll then be able to auto-import anything else that this library exports.

## v1 API

### MediaType Value Type

```typescript
// how to import this into your own code
import { MediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// base class
import { RefinedString } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

// types used for parameters
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

export class MediaType extends RefinedString {
    /**
     * smart constructor.
     *
     * calls your `onError` handler if `input` isn't a well-formatted
     * media type
     */
    public constructor(input: string, onError: OnError = THROW_THE_ERROR);

    /**
     * Gets the 'text/html' bit from 'text/html; charset=UTF-8' (for example)
     */
    public getContentType(): string;

    /**
     * returns a breakdown of the individual components for this media type
     */
    public parse(): MediaTypeParts;
}
```

`MediaType` is a _value type_. It represents an RFC-compliant media type string that has been successfully validated. You don't have to validate it yourself; the constructor will do that for you.

Here's how to create it, and how to use it:

```typescript
// how to import this into your own code
import { MediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// create a value object
const myMediaType = new MediaType("text/html; charset=UTF-8");

// it will auto-convert to a string in most places
console.log("myMediaType is: " + myMediaType);

// if you run into any auto-convert problems, call `.valueOf()`:
const parts = parseMediaType(myMediaType.valueOf());
```

If you try to create a `MediaType` from something that isn't a well-formed media type, the constructor will throw an Error:

```typescript
// how to import this into your own code
import { MediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// throws NotAMediaTypeError
const myMediaType = new MediaType("text");
```

### MediaTypeParts Value Type

```typescript
// how to import this into your own code
import { MediaTypeParts } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

/**
 * the structure of a MediaType
 *
 * call parseMediaType() or MediaType.parse() to get your MediaType
 * broken down
 */
export interface MediaTypeParts {
    /**
     * the 'text' in 'text/html' - everything before the first '/'
     */
    type: string;

    /**
     * the 'vnd' in 'application/vnd.ms-excel' - everything after
     * the first '/' and before the first '.'
     */
    tree?: string;

    /**
     * the 'html' in 'text/html',
     * or the 'ms-excel' in 'application/vnd.ms-excel'
     *
     * - everything after the 'type' and the 'tree'
     */
    subtype: string;

    /**
     * the 'json' in 'application/vnd.ms-excel+json'
     */
    suffix?: string;

    /**
     * any parameters tacked onto the end of the media type
     */
    parameters?: {[parameter: string]: string};
}
```

`MediaTypeParts` is a _value type_. It contains the parsed contents of a MediaType. The attribute names come from [RFC 2045][RFC 2045].

There are two ways to get a `MediaTypesParts` value:

* call [`parseMediaType()`](#parsemediatype) to get a `MediaTypeParts` object from a string, or
* call `MediaType.parse()`

```typescript
// how to import this into your own code
import { MediaType, parseMediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

const parts1 = parseMediaType("text/html; charset=UTF-8");

const myMediaType = new MediaType("text/html; charset=UTF-8");
const parts2 = myMediaType.parse();

// at this point, parts1 and parts2 contain the same information
```

### isMediaType()

```typescript
// how to import this into your own code
import { isMediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

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

### matchesContentType()

```typescript
// how to import this into your own code
import { matchesContentType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// types used for parameters
import { MediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

/**
 * Data guard. Returns `true` if your `input` matches any of the `expected`
 * MediaTypes.
 *
 * We compare everything except the parameters of the MediaTypes.
 *
 * Use `mustMatchMediaType()` for the corresponding data guarantee.
 */
export function matchesContentType(input: MediaType, expected: MediaType[]): boolean;
```

`matchesContentType()` is a _data guard_. Use it to prove that a given MediaType matches any entry in a safelist.

The comparison:

* ignores the case of all the MediaTypes
* ignores any parameters present in each MediaType

### parseContentType()

```typescript
// how to import this into your own code
import { parseContentType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// types used for parameters
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

/**
 * Data parser. Extracts everything but the parameters from an RFC-compliant
 * MediaType, and returns it as a single string.
 *
 * The result is returned as a lower-case string.
 */
export function parseContentType(
    input: string,
    onError: OnError = THROW_THE_ERROR,
): string;
```

`parseContentType()` is a _data parser_. Use it to extract the `text/html` section from `text/html; charset=UTF-8` (for example).

NOTE that `parseContentType()` always returns a lower-case string.

If you need to preserve the case of the result string, have a look at our undocumented `parseContentTypeUnbound()` function.

### parseMediaType()

```typescript
// how to import this into your own code
import { parseMediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// types used for parameters
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

/**
 * Data parser. Breaks down an RFC-compliant MediaType into its
 * individual parts.
 */
export function parseMediaType(
    input: string,
    onError: OnError = THROW_THE_ERROR,
): MediaTypeParts;
```

`parseMediaType()` is a _data parser_. Use it to break down the contents of a media type into its individual parts.

NOTE that `parseMediaType()` converts everything except parameter values to lower-case.

If you need to preserve the case of all the parts, have a look at our undocumented `parseMediaTypeUnbound()` function.

### mustBeMediaType()

```typescript
// how to import this into your own code
import { mustBeMediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// types used for parameters
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

/**
 * Data guarantee. Calls your onError handler if the given input
 * isn't an RFC-2045 / 6838-compliant MediaType
 *
 * @param input
 *        this string to be validated
 */
export function mustBeMediaType(input: string, onError: OnError = THROW_THE_ERROR): void;
```

`mustBeMediaType()` is a _data guarantee_. Use it to ensure that the given string has the structure of a RFC-compliant media type.

### MediaTypeMatchRegexIsBrokenError

```typescript
// how to import this into your own code
import { MediaTypeMatchRegexIsBrokenError } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// base class
import { AppError, AppErrorParams } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

export class MediaTypeMatchRegexIsBrokenError extends AppError {
    public constructor(params: AppErrorParams);
}
```

`MediaTypeMatchRegexIsBrokenError` is a throwable, structured `Error`. It's thrown whenever we break one of the regexes that we use to parse media type strings.

This is an internal error. Hopefully, you'll never see it occur.

### NotAMediaTypeError

```typescript
// how to import this into your own code
import { NotAMediaTypeError } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// base class
import { AppError, AppErrorParams } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

// params object structure
export interface NotAMediaTypeExtraData {
    public: {
        input: string;
    };
}

export class NotAMediaTypeError extends AppError {
    public constructor(params: NotAMediaTypeExtraData & AppErrorParams);
}
```

`NotAMediaTypeError` is a throwable, structured `Error`. It's thrown whenever a string doesn't have the expected structure of a media type.

### UnexpectedContentTypeError

```typescript
// how to import this into your own code
import { UnexpectedContentTypeError } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// base class
import { AppError, AppErrorParams } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

// params object structure
export interface UnexpectedContentTypeExtraData {
    public: {
        input: string;
        required: string[];
    };
}

export class UnexpectedContentTypeError extends AppError {
    public constructor(params: UnexpectedContentTypeExtraData & AppErrorParams);
}
```

`UnexpectedContentTypeError` is a throwable, structured `Error`. It's thrown whenever a given input `MediaType` doesn't match any of `MediaType`s in a given safelist.

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