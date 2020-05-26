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

import { matchesContentType } from "./matchesContentType";
import { MediaType } from "./MediaType";

describe("matchesContentType()", () => {
    it("returns `true` if the input matches any of the `expected` media types", () => {
        const input = new MediaType("text/html");
        const expected = [
            new MediaType("application/json"),
            new MediaType("application/vnd.an-example"),
            new MediaType("text/html"),
            new MediaType("text/plain"),
        ];

        const expectedValue = true;

        const actualValue = matchesContentType(input, expected);
        expect(actualValue).to.equal(expectedValue);
    });

    it("returns `false` if the input does not match any of the `expected` media types", () => {
        const input = new MediaType("text/html");
        const expected = [
            new MediaType("application/json"),
            new MediaType("application/vnd.an-example"),
            new MediaType("text/plain"),
        ];

        const expectedValue = false;

        const actualValue = matchesContentType(input, expected);
        expect(actualValue).to.equal(expectedValue);
    });

    it("doesn't use the expected MediaType's parameters to do the comparison", () => {
        const input = new MediaType("text/html");
        const expected = [
            new MediaType("application/json"),
            new MediaType("application/vnd.an-example"),
            new MediaType("text/html; charset=UTF-8"),
            new MediaType("text/plain"),
        ];

        const expectedValue = true;

        const actualValue = matchesContentType(input, expected);
        expect(actualValue).to.equal(expectedValue);
    });

    it("doesn't use the input's MediaType parameters to do the comparison", () => {
        const input = new MediaType("text/html; charset=UTF-8");
        const expected = [
            new MediaType("application/json"),
            new MediaType("application/vnd.an-example"),
            new MediaType("text/html; param1=value1"),
            new MediaType("text/plain"),
        ];

        const expectedValue = true;

        const actualValue = matchesContentType(input, expected);
        expect(actualValue).to.equal(expectedValue);
    });
});