"use strict";
/**
 * List of internal and helper functions in Behavior3JS.
 *
 * @module functions
**/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUUID = void 0;
/**
* This function is used to create unique IDs for trees and nodes.
*
* (consult http://www.ietf.org/rfc/rfc4122.txt).
*
* @class createUUID
* @constructor
* @return {String} A unique ID.
**/
function createUUID() {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = '4';
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = '-';
    let uuid = s.join('');
    return uuid;
}
exports.createUUID = createUUID;
//# sourceMappingURL=b3.functions.js.map