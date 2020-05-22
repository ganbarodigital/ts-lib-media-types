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
import { expect } from "chai";
import { describe } from "mocha";

import { MediaTypeMatchRegexIsBrokenError } from "../Errors/MediaTypeMatchRegexIsBroken";
import { InvalidMediaTypeExamples, ValidMediaTypeExamples } from "./MediaTypeExamples.spec";
import { parseMediaType, parseMediaTypeUnbound } from "./parseMediaType";
import { MediaTypeParamRegex } from "./regexes";

// a valid regex, that doesn't populate named groups
const BrokenMatchRegex = /^.*$/;

describe("parseMediaType()", () => {
    // tslint:disable-next-line: forin
    for (const inputValue in ValidMediaTypeExamples) {
        it("correctly parses '" + inputValue + '"', () => {
            const expectedValue = ValidMediaTypeExamples[inputValue];
            const actualValue = parseMediaType(inputValue);

            expect(actualValue).to.eql(expectedValue);
        });
    }

    for (const inputValue of InvalidMediaTypeExamples) {
        it("rejects example '" + inputValue + "'", () => {
            expect(() => parseMediaType(inputValue)).to.throw();
        });
    }

    it("throws MediaTypeMatchRegexIsBrokenError if we use a garbage parser", () => {
        const inputValue = "text/plain";
        expect(() => parseMediaTypeUnbound(
            BrokenMatchRegex,
            MediaTypeParamRegex,
            inputValue,
        )).to.throw(MediaTypeMatchRegexIsBrokenError);
    });

    // one day, I hope auto-conversion makes this possible!
    //
    // it("accepts a MediaType input type", () => {
    //     const inputValue = "text/html; charset=UTF-8";
    //     const expectedValue: MediaTypeParts = {
    //         type: "text",
    //         subtype: "html",
    //         parameters: {
    //             charset: "UTF-8",
    //         },
    //     };

    //     const unit = new MediaType(inputValue);
    //     const actualValue = parseMediaType(unit);

    //     expect(actualValue).to.eql(expectedValue);
    // });
});