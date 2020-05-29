# MediaType Library for Typescript

## Introduction

This TypeScript library provides a `MediaType` _value type_ that validates and supports [RFC 2045][RFC 2045] and [RFC 6838][RFC 6838] "media type" strings:

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [MediaType](#mediatype)
  - [MediaType Value Type](#mediatype-value-type)
  - [MediaTypeParts Value Type](#mediatypeparts-value-type)
  - [isMediaType()](#ismediatype)
  - [matchesContentType()](#matchescontenttype)
  - [parseMediaType()](#parsemediatype)
  - [mustBeMediaType()](#mustbemediatype)
  - [MediaTypeMatchRegexIsBrokenError](#mediatypematchregexisbrokenerror)
  - [NotAMediaTypeError](#notamediatypeerror)
- [ContentType](#contenttype)
  - [ContentType Value Type](#contenttype-value-type)
  - [contentTypeFrom()](#contenttypefrom)
  - [mustMatchContentType()](#mustmatchcontenttype)
  - [isContentType()](#iscontenttype)
  - [mustBeContentType()](#mustbecontenttype)
  - [parseContentType()](#parsecontenttype)
  - [NotAContentTypeError](#notacontenttypeerror)
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

## MediaType

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
 * Data guard. Returns `true` if your `input` matches any of the MediaTypes
 * in the `safelist`.
 *
 * We compare everything except the parameters of the MediaTypes.
 *
 * Use `mustMatchMediaType()` for the corresponding data guarantee.
 */
export function matchesContentType(input: MediaType, safelist: MediaType[]): boolean;
```

`matchesContentType()` is a _data guard_. Use it to prove that a given MediaType matches any entry in a safelist.

The comparison:

* ignores the case of all the MediaTypes
* ignores any parameters present in each MediaType

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

## ContentType

### ContentType Value Type

```typescript
// how to import this into your own code
import { ContentType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

/**
 * everything except the parameters from a MediaType,
 *
 * e.g. the `text/html` bit from `text/html; charset=UTF-8`
 *
 * At compile-time, this type resolves down to being a normal string.
 * Think of it as an interface.
 */
export type ContentType = Branded<string, "ContentType">;
```

`ContentType` is a _value type_. It holds everything except the parameters from a `MediaType`.

NOTE that `ContentType` is an `interface`, not a `class`. It's a type that only exists at compile-time. You can't use it with the `instanceof` operator at runtime.

Use `contentTypeFrom()` to create a new `ContentType` value:

```typescript
const myContentType = contentTypeFrom("text/html");
```

While you can technically do this:

```typescript
const myContentType = "text/html" as ContentType;
```

it's an unsafe practice.

* `XXX as Type` is a compiler override. It bypasses the compiler's type checking. It should only ever be used as a last resort.
* `contentTypeFrom()` will catch any silly mistakes that aren't a well-formatted content type.
* It will break if we ever change the underlying definition of `ContentType` in the future, whereas using `contentTypeFrom()` guarantees forward-compatibility.

### contentTypeFrom()

```typescript
// how to import this into your own code
import { contentTypeFrom } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// types used in parameters / return values
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

/**
 * Smart constructor. Creates a validated `ContentType` from your given
 * input string.
 */
export function contentTypeFrom(input: string, onError: OnError = THROW_THE_ERROR): ContentType;
```

```contentTypeFrom()` is a _smart constructor_. Use it to create a `ContentType` value.

### contentTypeFromMediaType()

```typescript
// how to import this into your own code
import { contentTypeFromMediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// types used for parameters
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { ContentType, MediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

/**
 * Data parser. Extracts everything but the parameters from an RFC-compliant
 * MediaType, and returns it as a single valeue.
 *
 * The result is always returned as a lower-case string.
 */
export function contentTypeFromMediaType(
    input: MediaType,
    onError: OnError = THROW_THE_ERROR,
): ContentType;
```

`contentTypeFromMediaType()` is a _smart constructor_. Use it to extract the `text/html` section from `text/html; charset=UTF-8` (for example).

NOTE that `contentTypeFromMediaType()` always returns a lower-case string.

If you need to preserve the case of the result string, have a look at our undocumented `contentTypeFromMediaTypeUnbound()` function.

### mustMatchContentType()

```typescript
// how to import this into your own code
import { mustMatchContentType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// types used for parameters
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { MediaType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

/**
 * Data guarantee. Calls your onError handler if the given input
 * doesn't match any of the MediaTypes on the given safelist.
 *
 * We compare everything except the parameters of the MediaTypes.
 */
export function mustMatchContentType(
    input: MediaType,
    safelist: MediaType[],
    onError: OnError = THROW_THE_ERROR
): void;
```

`mustMatchContentType()` is a _data guarantee_. Use it to prove that your `input` `MediaType` matches the `MediaTypes` on your safelist.

### isContentType()

```typescript
// how to import this into your own code
import { isContentType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

/**
 * Data guard. Returns `true` if the input string matches the structure
 * of an RFC2046 / RFC6838 media type that has no parameters.
 *
 * @param input
 */
export function isContentType(input: string): boolean;
```

`isContentType()` is a _data guard_. Use it to prove that the given `input` string contains a valid [content type](#contenttype-value-type).

### mustBeContentType()

```typescript
// how to import this into your own code
import { isContentType } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// types used in parameters / return values
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

/**
 * Data guarantee. Calls your onError handler if the given input
 * isn't an RFC-2045 / 6838-compliant MediaType that has no parameters.
 */
export function mustBeContentType(input: string, onError: OnError = THROW_THE_ERROR): void;
```

`mustBeContentType()` is a _data guarantee_. Use it to prove that the given `input` string is a valid content type.

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

### NotAContentTypeError

```typescript
// how to import this into your own code
import { NotAContentTypeError } from "@ganbarodigital/ts-lib-mediatype/lib/v1";

// base class
import { AppError, AppErrorParams } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

// params object structure
export interface NotAContentTypeExtraData {
    public: {
        input: string;
    };
}

export class NotAContentTypeError extends AppError {
    public constructor(params: NotAContentTypeExtraData & AppErrorParams);
}
```

`NotAContentTypeError` is a throwable, structured `Error`. It's thrown whenever a string doesn't have the expected structure of a content type.

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
        required: {
            anyOf: string[];
        }
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