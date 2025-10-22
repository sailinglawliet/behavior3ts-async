import Decorator from '../core/Decorator';
import { ERROR, FAILURE, STATE } from '../constants';
import BaseNode from '../core/BaseNode';
import type { IProperties } from '../core/BaseNode';
import Tick from '../core/Tick';

/**
 * RepeatUntilSuccess is a decorator that repeats the tick signal until the
 * node child returns `SUCCESS`, `RUNNING` or `ERROR`. Optionally, a maximum
 * number of repetitions can be defined.
 *
 * @module b3
 * @class RepeatUntilSuccess
 * @extends Decorator
 **/

export default class RepeatUntilSuccess extends Decorator {

    maxLoop: number;
    /**
     * Creates an instance of RepeatUntilSuccess.
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @param {number} maxLoop Maximum number of repetitions. Default to -1 (infinite).
     * @param {BaseNode | null} child The child node.
     * @memberof RepeatUntilSuccess
     **/
    constructor(maxLoop: number = -1, child: BaseNode | null = null) {
        const properties: IProperties = { maxLoop: maxLoop };
        super(
            child || undefined,
            'RepeatUntilSuccess',
            'Repeat Until Success',
            properties
        );

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
            throw new Error('RepeatUntilSuccess: tick.blackboard or tick.tree is null');
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
        let status: STATE = ERROR;

        while (this.maxLoop < 0 || i < this.maxLoop) {
            status = await this.child._execute(tick);

            if (status === FAILURE) {
                i++;
            } else {
                break;
            }
        }

        tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    }
}
