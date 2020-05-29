//
// Copyright (c) 2020-present Ganbaro Digital Ltd
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//   * Re-distributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in
//     the documentation and/or other materials provided with the
//     distribution.
//
//   * Neither the names of the copyright holders nor the names of his
//     contributors may be used to endorse or promote products derived
//     from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

import {
    MediaTypeMatchRegexIsBrokenError,
    NotAMediaTypeError,
} from "../Errors";
import { MediaTypeMatchRegex } from "./regexes";
import { _contentTypeFrom } from "../ContentType/contentTypeFrom";

type CaseConverter = (input: string) => string;

/**
 * Data parser. Extracts everything but the parameters from an RFC-compliant
 * MediaType, and returns it as a single string.
 *
 * The result is returned as a lower-case string.
 *
 * @deprecated use `contentTypeFrom()` instead
 */
export const parseContentType = _parseContentType.bind(
    null,
    MediaTypeMatchRegex,
    (x) => x.toLowerCase(),
);

/**
 * Data parser. Extracts everything but the parameters from an RFC-compliant
 * MediaType, and returns it as a single string.
 *
 * The result is run through the `caseConverter` function.
 *
 * @deprecated use `_contentTypeFrom()` instead
 */
export function _parseContentType(
    matchRegex: RegExp,
    caseConverter: CaseConverter,
    input: string,
    onError: OnError = THROW_THE_ERROR,
): string {
    const regResult = matchRegex.exec(input);
    if (regResult === null) {
        throw onError(new NotAMediaTypeError({public: {input}}));
    }

    // special case - the regex has no named groups in it any more
    // this code is unreachable for testing purposes :(
    if (regResult.groups === undefined) {
        throw onError(new MediaTypeMatchRegexIsBrokenError({}));
    }

    return _contentTypeFrom(caseConverter, regResult.groups.contentType);
}