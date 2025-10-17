"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Composite_1 = require("../core/Composite");
const constants_1 = require("../constants");
/**
 * MemSequence is similar to Sequence node, but when a child returns a
 * `RUNNING` state, its index is recorded and in the next tick the
 * MemPriority call the child recorded directly, without calling previous
 * children again.
 *
 * @module b3
 * @class MemSequence
 * @extends Composite
 **/
class MemSequence extends Composite_1.default {
    /**
     * Creates an instance of MemSequence.
     * @param {Object} params
     * @param {Array} params.children
     * @memberof MemSequence
     */
    constructor(children = new Array()) {
        super(children, 'MemSequence');
    }
    /**
     * Open method.
     * @method open
     * @param {b3.Tick} tick A tick instance.
     **/
    open(tick) {
        tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
    }
    /**
     * Tick method.
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    async tick(tick) {
        let child = tick.blackboard.get('runningChild', tick.tree.id, this.id);
        for (let i = child; i < this.children.length; i++) {
            const status = await this.children[i]._execute(tick);
            if (status !== constants_1.SUCCESS) {
                if (status === constants_1.RUNNING) {
                    tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
                }
                return status;
            }
        }
        return constants_1.SUCCESS;
    }
}
exports.default = MemSequence;
//# sourceMappingURL=MemSequence.js.map