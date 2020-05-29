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
import { MediaTypeParts } from "./MediaTypeParts";

export interface MediaTypeExamples {
    [mediaType: string]: MediaTypeParts;
}

export interface ContentTypeExamples {
    [mediaType: string]: string;
}

export const ValidMediaTypeExamples: MediaTypeExamples = {
    "text/plain": {
        type: "text",
        subtype: "plain",
    },
    "text/plain; charset=us-ascii": {
        type: "text",
        subtype: "plain",
        parameters: {
            charset: "us-ascii",
        },
    },
    'text/plain; charset="us-ascii"': {
        type: "text",
        subtype: "plain",
        parameters: {
            charset: "us-ascii",
        },
    },
    "text/plain; charset=ISO-8859-1": {
        type: "text",
        subtype: "plain",
        parameters: {
            charset: "ISO-8859-1",
        },
    },
    "application/vnd.record": {
        type: "application",
        tree: "vnd",
        subtype: "record",
    },
    "application/vnd.tie-record": {
        type: "application",
        tree: "vnd",
        subtype: "tie-record",
    },
    "application/vnd.tie-record+json": {
        type: "application",
        tree: "vnd",
        subtype: "tie-record",
        suffix: "json",
    },
    "application/vnd.oai.openapi+json": {
        type: "application",
        tree: "vnd",
        subtype: "oai.openapi",
        suffix: "json",
    },
    "application/vnd.oai.openapi+json; version=3.0": {
        type: "application",
        tree: "vnd",
        subtype: "oai.openapi",
        suffix: "json",
        parameters: {
            version: "3.0",
        }
    }
};

export const InvalidMediaTypeExamples = [
    "text",
    "text/plain; boundary=123:456",
];

export const ValidContentTypeExamples = [
    "text/plain",
    "application/vnd.record",
    "application/vnd.tie-record",
    "application/vnd.tie-record+json",
    "application/vnd.oai.openapi+json",
];

export const ValidContentTypeFromMediaTypeExamples: ContentTypeExamples = {
    "text/plain": "text/plain",
    "text/plain; charset=us-ascii": "text/plain",
    'text/plain; charset="us-ascii"': "text/plain",
    "text/plain; charset=ISO-8859-1": "text/plain",
    "application/vnd.record": "application/vnd.record",
    "application/vnd.tie-record": "application/vnd.tie-record",
    "application/vnd.tie-record+json": "application/vnd.tie-record+json",
    "application/vnd.oai.openapi+json; version=3.0": "application/vnd.oai.openapi+json",
};
