"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Decorator_1 = require("../core/Decorator");
const constants_1 = require("../constants");
/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
 **/
class Inverter extends Decorator_1.default {
    /**
     * Creates an instance of Inverter.
     * @param {Object} params
     * @param {BaseNode} params.child The child node.
     * @memberof Inverter
     */
    constructor(child = null) {
        super(child, 'Inverter');
    }
    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    async tick(tick) {
        if (!this.child) {
            return constants_1.ERROR;
        }
        let status = await this.child._execute(tick);
        if (status == constants_1.SUCCESS) {
            status = constants_1.FAILURE;
        }
        else if (status == constants_1.FAILURE) {
            status = constants_1.SUCCESS;
        }
        return status;
    }
}
exports.default = Inverter;
//# sourceMappingURL=Inverter.js.map