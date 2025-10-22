import Action from '../core/Action';
import { SUCCESS, RUNNING, STATE, ERROR } from '../constants';
import Tick from '../core/Tick';
import type { IProperties } from '../core/BaseNode';

/**
 * Wait a few seconds.
 *
 * @module b3
 * @class Wait
 * @extends Action
 **/

export default class Wait extends Action {

    endTime: number;
    /**
     * Creates an instance of Wait.
     * @param {Object} settings Object with parameters
     * @param {Number} settings.milliseconds Maximum time, in milliseconds, a child can execute.
     * @memberof Wait
     */
    constructor(milliseconds: number = 0) {
        const properties: IProperties = { milliseconds: 0 };
        super(
            'Wait',
            'Wait <milliseconds>ms',
            properties
        );

        this.endTime = milliseconds;
    }

    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     * @return {void}
     **/
    open(tick: Tick): void {
        if (!tick.blackboard || !tick.tree) {
            throw new Error('Wait: tick.blackboard or tick.tree is null');
        }
        const startTime: number = (new Date()).getTime();
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {STATE} A state constant.
     **/
    tick(tick: Tick): STATE {
        if (!tick.blackboard || !tick.tree) {
            return ERROR;
        }
        const currTime: number = (new Date()).getTime();
        const startTime: number = tick.blackboard.get('startTime', tick.tree.id, this.id) as number;

        if (currTime - startTime > this.endTime) {
            return SUCCESS;
        }

        return RUNNING;
    }
}
