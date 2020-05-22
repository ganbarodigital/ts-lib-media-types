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
import { RefinedString } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

import { MediaTypeParts } from "./MediaTypeParts";
import { mustBeMediaType } from "./mustBeMediaType";
import { parseContentType } from "./parseContentType";
import { parseMediaType } from "./parseMediaType";

/**
 * value type. Represents RFC-compliant media type strings.
 */
export class MediaType extends RefinedString {
    /**
     * internal cache. Stops us having to extract the content type
     * from our value more than once
     */
    #contentType: string|undefined = undefined;

    /**
     * internal cache. Stops us having to parse our value
     * more than once.
     */
    #parsed: MediaTypeParts|undefined = undefined;

    /**
     * smart constructor.
     *
     * calls your `onError` handler if `input` isn't a well-formatted
     * media type
     */
    public constructor(input: string, onError: OnError = THROW_THE_ERROR) {
        super(input, mustBeMediaType, onError);
    }

    /**
     * Gets the 'text/html' bit from 'text/html; charset=UTF-8' (for example)
     */
    public getContentType(): string {
        // haven't we already done this?
        if (!this.#contentType) {
            // no, first time for everything!
            this.#contentType = parseContentType(this.value, THROW_THE_ERROR);
        }

        // return our cached value
        return this.#contentType;
    }

    /**
     * returns a breakdown of the individual components for this media type
     */
    public parse(): MediaTypeParts {
        // haven't we already done this?
        if (!this.#parsed) {
            // no, first time for everything!
            this.#parsed = parseMediaType(this.value, THROW_THE_ERROR);
        }

        // return our cached value
        return this.#parsed;
    }
}