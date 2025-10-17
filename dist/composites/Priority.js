"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Composite_1 = require("../core/Composite");
const constants_1 = require("../constants");
/**
 * Priority ticks its children sequentially until one of them returns
 * `SUCCESS`, `RUNNING` or `ERROR`. If all children return the failure state,
 * the priority also returns `FAILURE`.
 *
 * @module b3
 * @class Priority
 * @extends Composite
 **/
class Priority extends Composite_1.default {
    /**
     * Creates an instance of Priority.
     * @param {Object} params
     * @param {Array} params.children
     * @memberof Priority
     */
    constructor(children = new Array()) {
        super(children, 'Priority');
    }
    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    async tick(tick) {
        for (let i = 0; i < this.children.length; i++) {
            const status = await this.children[i]._execute(tick);
            if (status !== constants_1.FAILURE) {
                return status;
            }
        }
        return constants_1.FAILURE;
    }
}
exports.default = Priority;
//# sourceMappingURL=Priority.js.map