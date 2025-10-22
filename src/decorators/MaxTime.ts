import Decorator from '../core/Decorator';
import { FAILURE, ERROR, STATE } from '../constants';
import BaseNode from '../core/BaseNode';
import type { IProperties } from '../core/BaseNode';
import Tick from '../core/Tick';

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

export default class MaxTime extends Decorator {

    maxTime: number;
    /**
     * Creates an instance of MaxTime.
     *
     * - **maxTime** (*Integer*) Maximum time a child can execute.
     * - **child** (*BaseNode*) The child node.

     * @param {number} maxTime Maximum time a child can execute.
     * @param {BaseNode | null} child The child node.
     * @memberof MaxTime
     */
    constructor(maxTime: number = 1, child: BaseNode | null = null) {
        const properties: IProperties = { maxTime: maxTime };
        super(
            child || undefined,
            'MaxTime',
            'Max <maxTime>ms',
            properties
        );

        if (!maxTime) {
            throw 'maxTime parameter in MaxTime decorator is an obligatory parameter';
        }

        this.maxTime = maxTime;
    }

    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     * @return {void}
     **/
    open(tick: Tick): void {
        if (!tick.blackboard || !tick.tree) {
            throw new Error('MaxTime: tick.blackboard or tick.tree is null');
        }
        const startTime: number = (new Date()).getTime();
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    async tick(tick: Tick): Promise<STATE> {
        if (!tick.blackboard || !tick.tree) {
            return ERROR;
        }

        if (!this.child) {
            return ERROR;
        }

        const currTime: number = (new Date()).getTime();
        const startTime: number = tick.blackboard.get('startTime', tick.tree.id, this.id) as number;

        let status = await this.child._execute(tick);
        if (currTime - startTime > this.maxTime) {
            return FAILURE;
        }

        return status;
    }
}
