"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const Action_1 = require("../core/Action");
/**
 * This action node returns `ERROR` always.
 *
 * @module b3
 * @class Error
 * @extends Action
 **/
class Error extends Action_1.default {
    /**
     * Creates an instance of Error.
     * @memberof Error
     */
    constructor() {
        super('Error');
    }
    /**
     * Tick method.
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @return {Constant} Always return `ERROR`.
     **/
    tick(tick) {
        return constants_1.ERROR;
    }
}
exports.default = Error;
//# sourceMappingURL=Error.js.map