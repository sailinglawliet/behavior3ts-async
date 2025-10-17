"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Decorator_1 = require("../core/Decorator");
const constants_1 = require("../constants");
/**
 * RepeatUntilFailure is a decorator that repeats the tick signal until the
 * node child returns `FAILURE`, `RUNNING` or `ERROR`. Optionally, a maximum
 * number of repetitions can be defined.
 *
 * @module b3
 * @class RepeatUntilFailure
 * @extends Decorator
 **/
class RepeatUntilFailure extends Decorator_1.default {
    maxLoop;
    /**
     * Creates an instance of RepeatUntilFailure.
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @param {Object} params Object with parameters.
     * @param {Number} params.maxLoop Maximum number of repetitions. Default to -1 (infinite).
     * @param {BaseNode} params.child The child node.
     * @memberof RepeatUntilFailure
     **/
    constructor(maxLoop = -1, child = null) {
        super(child, 'RepeatUntilFailure', 'Repeat Until Failure', { maxLoop: -1 });
        this.maxLoop = maxLoop;
    }
    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    open(tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
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
        let i = tick.blackboard.get('i', tick.tree.id, this.id);
        let status = constants_1.ERROR;
        while (this.maxLoop < 0 || i < this.maxLoop) {
            status = await this.child._execute(tick);
            if (status == constants_1.SUCCESS) {
                i++;
            }
            else {
                break;
            }
        }
        i = tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    }
}
exports.default = RepeatUntilFailure;
//# sourceMappingURL=RepeatUntilFailure.js.map