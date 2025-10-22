import Composite from '../core/Composite';
import { FAILURE, STATE } from '../constants';
import Tick from '../core/Tick';
import BaseNode from '../core/BaseNode';
import type { IProperties } from '../core/BaseNode';

/**
 * Priority ticks its children sequentially until one of them returns
 * `SUCCESS`, `RUNNING` or `ERROR`. If all children return the failure state,
 * the priority also returns `FAILURE`.
 *
 * @module b3
 * @class Priority
 * @extends Composite
 **/

export default class Priority extends Composite {

    /**
     * Creates an instance of Priority.
     * @param {Object} params
     * @param {Array} params.children
     * @memberof Priority
     */
    constructor(children: BaseNode[] = []) {
        super(children, 'Priority', 'Priority', {} as IProperties);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    async tick(tick: Tick): Promise<STATE> {
        for (let i = 0; i < this.children.length; i++) {
            const status = await this.children[i]._execute(tick);

            if (status !== FAILURE) {
                return status;
            }
        }

        return FAILURE;
    }
}
