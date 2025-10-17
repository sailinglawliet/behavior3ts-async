"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_1 = require("../core/Action");
const constants_1 = require("../constants");
/**
 * Wait a few seconds.
 *
 * @module b3
 * @class Wait
 * @extends Action
 **/
class Wait extends Action_1.default {
    endTime;
    /**
     * Creates an instance of Wait.
     * @param {Object} settings Object with parameters
     * @param {Number} settings.milliseconds Maximum time, in milliseconds, a child can execute.
     * @memberof Wait
     */
    constructor(milliseconds = 0) {
        super('Wait', 'Wait <milliseconds>ms', { milliseconds: 0 });
        this.endTime = milliseconds;
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
    tick(tick) {
        let currTime = (new Date()).getTime();
        let startTime = tick.blackboard.get('startTime', tick.tree.id, this.id);
        if (currTime - startTime > this.endTime) {
            return constants_1.SUCCESS;
        }
        return constants_1.RUNNING;
    }
}
exports.default = Wait;
//# sourceMappingURL=Wait.js.map