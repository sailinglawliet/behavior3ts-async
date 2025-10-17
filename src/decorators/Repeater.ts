import Decorator from '../core/Decorator';
import { SUCCESS, ERROR, FAILURE, STATE } from '../constants';
import BaseNode from '../core/BaseNode';
import Tick from '../core/Tick';

/**
 * Repeater is a decorator that repeats the tick signal until the child node
 * return `RUNNING` or `ERROR`. Optionally, a maximum number of repetitions
 * can be defined.
 *
 * @module b3
 * @class Repeater
 * @extends Decorator
 **/

export default class Repeater extends Decorator {

    maxLoop: number;
    /**
     * Creates an instance of MaxTime.
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @param {Object} params Object with parameters.
     * @param {Number} params.maxLoop Maximum number of repetitions. Default to -1 (infinite).
     * @param {BaseNode} params.child The child node.
     * @memberof Repeater
     **/
    constructor(maxLoop = -1, child: BaseNode = null) {
        super(
            child,
            'Repeater',
            'Repeat <maxLoop>x',
            { maxLoop: -1 },
        );

        this.maxLoop = maxLoop;
    }

    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    open(tick: Tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     **/
    async tick(tick: Tick): Promise<STATE> {
        if (!this.child) {
            return ERROR;
        }

        let i = tick.blackboard.get('i', tick.tree.id, this.id);
        let status = SUCCESS;

        while (this.maxLoop < 0 || i < this.maxLoop) {
            status = await this.child._execute(tick);

            if (status == SUCCESS || status == FAILURE) {
                i++;
            } else {
                break;
            }
        }

        tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    }
}
