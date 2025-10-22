import Decorator from '../core/Decorator';
import { FAILURE, SUCCESS, ERROR, STATE } from '../constants';
import Tick from '../core/Tick';
import BaseNode from '../core/BaseNode';
import type { IProperties } from '../core/BaseNode';

/**
 * This decorator limit the number of times its child can be called. After a
 * certain number of times, the Limiter decorator returns `FAILURE` without
 * executing the child.
 *
 * @module b3
 * @class Limiter
 * @extends Decorator
 **/

export default class Limiter extends Decorator {

    maxLoop: number;
    /**
     * Creates an instance of Limiter.
     *
     * Settings parameters:
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions.
     * - **child** (*BaseNode*) The child node.
     *
     * @param {BaseNode | null} child The child node.
     * @param {number} maxLoop Maximum number of repetitions.
     * @memberof Limiter
     */
    constructor(child: BaseNode | null = null, maxLoop: number = 1) {
        const properties: IProperties = { maxLoop: maxLoop };
        super(
            child || undefined,
            'Limiter',
            'Limit <maxLoop> Activations',
            properties
        );

        if (!maxLoop) {
            throw 'maxLoop parameter in Limiter decorator is an obligatory parameter';
        }

        this.maxLoop = maxLoop;
    }

    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     * @return {void}
     **/
    open(tick: Tick): void {
        if (!tick.blackboard || !tick.tree) {
            throw new Error('Limiter: tick.blackboard or tick.tree is null');
        }
        
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    async tick(tick: Tick): Promise<STATE> {
        if (!this.child) {
            return ERROR;
        }
        if (!tick.blackboard || !tick.tree) {
            return ERROR;
        }

        let i = tick.blackboard.get('i', tick.tree.id, this.id) as number;

        if (i < this.maxLoop) {
            let status = await this.child._execute(tick);

            if (status === SUCCESS || status === FAILURE)
                tick.blackboard.set('i', i + 1, tick.tree.id, this.id);

            return status;
        }

        return FAILURE;
    }
}
