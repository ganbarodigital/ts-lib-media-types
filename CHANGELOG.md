# CHANGELOG

## Introduction

This CHANGELOG tells you:

* when a release was made
* what is in each release

It also tells you what changes have been completed, and will be included in the next tagged release.

For each release, changes are grouped under these headings:

* _Backwards-Compatibility Breaks_: a list of any backwards-compatibility breaks
* _New_: a list of new features. If the feature came from a contributor via a PR, make sure you link to the PR and give them a mention here.
* _Fixes_: a list of bugs that have been fixed. If there's an issue for the bug, make sure you link to the GitHub issue here.
* _Dependencies_: a list of dependencies that have been added / updated / removed.
* _Tools_: a list of bundled tools that have been added / updated / removed.

## develop branch

The following changes have been completed, and will be included in the next tagged release.

### New

* Added `matchesContentType()` data guard.
* Added `UnexpectedContentTypeError` throwable Error.

## v1.1.0

Released Friday, 22nd May 2020.

### New

* `MediaType.parse()`
  - we now cache the first `parse()` result, to speed up any subsequent calls to `parse()`
* `MediaTypeMatchRegex`
  - added result group `contentType`
* `parseContentType()` added
  - extracts everything before the parameters in the MediaType string

### Fixes

* `parseMediaType()` (and `MediaType.parse()`)
  - converts everything *except* parameter values to lower-case

### Refactor

* `MediaType.parse()`
  - drop the unused `onError` parameter
    - it was impossible for `onError` to ever be called

### Dependencies

* Upgraded to TypeScript 3.9

## v1.0.2

Released Friday, 17th April 2020.

### Dependencies

* Upgraded to v0.3 of `@ganbarodigital/ts-lib-error-reporting`
* Upgraded to v0.3 of `@ganbarodigital/ts-lib-packagename`
* Upgraded to v0.3 of `@ganbarodigital/ts-lib-http-types`

## v1.0.1

Released Wednesday, 15th April 2020.

### Fixes

* Added export for `MediaType` value type.

## v1.0.0

Released Tuesday, 7th April 2020.

### New

* Added `MediaType` value type
* Added `isMediaType()` data guard
* Added `MediaTypeMatchRegexIsBrokenError` structured Error
* Added `mustBeMediaType()` data guarantee
* Added `NotAMediaTypeError` structured Error
* Added `parseMediaType()` data parser
* Added MediaTypeParts value type
* Added MediaTypeMatchRegex
* Added MediaTypeParamRegex
