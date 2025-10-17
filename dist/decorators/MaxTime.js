"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Decorator_1 = require("../core/Decorator");
const constants_1 = require("../constants");
/**
 * The MaxTime decorator limits the maximum time the node child can execute.
 * Notice that it does not interrupt the execution itself (i.e., the child
 * must be non-preemptive), it only interrupts the node after a `RUNNING`
 * status.
 *
 * @module b3
 * @class MaxTime
 * @extends Decorator
 **/
class MaxTime extends Decorator_1.default {
    maxTime;
    /**
     * Creates an instance of MaxTime.
     *
     * - **maxTime** (*Integer*) Maximum time a child can execute.
     * - **child** (*BaseNode*) The child node.

     * @param {Object} params Object with parameters.
     * @param {Number} params.maxTime Maximum time a child can execute.
     * @param {BaseNode} params.child The child node.
     * @memberof MaxTime
     */
    constructor(maxTime = 1, child = null) {
        super(child, 'MaxTime', 'Max <maxTime>ms', { maxTime: maxTime });
        if (!maxTime) {
            throw 'maxTime parameter in MaxTime decorator is an obligatory parameter';
        }
        this.maxTime = maxTime;
    }
    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    open(tick) {
        let startTime = (new Date()).getTime();
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id);
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
        let currTime = (new Date()).getTime();
        let startTime = tick.blackboard.get('startTime', tick.tree.id, this.id);
        let status = await this.child._execute(tick);
        if (currTime - startTime > this.maxTime) {
            return constants_1.FAILURE;
        }
        return status;
    }
}
exports.default = MaxTime;
//# sourceMappingURL=MaxTime.js.map