"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../core/Action");
const constants_1 = require("../constants");
/**
 * This action node returns RUNNING always.
 *
 * @module b3
 * @class Runner
 * @extends Action
 **/
class Runner extends Action_1.default {
    /**
     * Creates an instance of Runner.
     * @memberof Runner
     */
    constructor() {
        super('Runner');
    }
    /**
     * Tick method.
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @return {Constant} Always return `RUNNING`.
     **/
    tick(tick) {
        return constants_1.RUNNING;
    }
}
exports.default = Runner;
//# sourceMappingURL=Runner.js.map