import Composite from '../core/Composite';
import { FAILURE, RUNNING, STATE, ERROR } from '../constants';
import BaseNode from '../core/BaseNode';
import type { IProperties } from '../core/BaseNode';
import Tick from '../core/Tick';

/**
 * MemPriority is similar to Priority node, but when a child returns a
 * `RUNNING` state, its index is recorded and in the next tick the,
 * MemPriority calls the child recorded directly, without calling previous
 * children again.
 *
 * @module b3
 * @class MemPriority
 * @extends Composite
 **/

export default class MemPriority extends Composite {

    /**
     * Creates an instance of MemPriority.
     * @param {Array<BaseNode>} children
     * @memberof MemPriority
     */
    constructor(children: BaseNode[] = []) {
        const properties: IProperties = {};
        super(
            children,
            'MemPriority',
            '',
            properties
        );
    }

    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     * @return {void}
     **/
    open(tick: Tick): void {
        if (!tick.blackboard || !tick.tree) {
            throw new Error('MemPriority: tick.blackboard or tick.tree is null');
        }

        tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    async tick(tick: Tick): Promise<STATE> {
        if (!tick.blackboard || !tick.tree) {
            return ERROR;
        }

        let child = tick.blackboard.get('runningChild', tick.tree.id, this.id);
        for (let i = child; i < this.children.length; i++) {
            const status = await this.children[i]._execute(tick);

            if (status !== FAILURE) {
                if (status === RUNNING) {
                    tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
                }

                return status;
            }
        }

        return FAILURE;
    }
}
