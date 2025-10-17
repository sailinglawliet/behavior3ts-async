"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../core/Action");
const constants_1 = require("../constants");
/**
 * This action node returns `FAILURE` always.
 *
 * @module b3
 * @class Failer
 * @extends Action
 **/
class Failer extends Action_1.default {
    /**
     * Creates an instance of Failer.
     * @memberof Failer
     */
    constructor() {
        super('Failer');
    }
    /**
     * Tick method.
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @return {Constant} Always return `FAILURE`.
     **/
    tick(tick) {
        return constants_1.FAILURE;
    }
}
exports.default = Failer;
//# sourceMappingURL=Failer.js.map