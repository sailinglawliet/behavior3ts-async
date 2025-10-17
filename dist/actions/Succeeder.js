"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../core/Action");
const constants_1 = require("../constants");
/**
 * This action node returns `SUCCESS` always.
 *
 * @module b3
 * @class Succeeder
 * @extends Action
 **/
class Succeeder extends Action_1.default {
    /**
     * Creates an instance of Succeeder.
     * @memberof Succeeder
     */
    constructor() {
        super('Succeeder');
    }
    /**
     * Tick method.
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @return {Constant} Always return `SUCCESS`.
     **/
    tick(tick) {
        return constants_1.SUCCESS;
    }
}
exports.default = Succeeder;
//# sourceMappingURL=Succeeder.js.map