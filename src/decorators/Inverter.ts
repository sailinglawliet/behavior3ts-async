import Decorator from '../core/Decorator';
import { FAILURE, SUCCESS, ERROR, STATE } from '../constants';
import Tick from '../core/Tick';
import BaseNode from '../core/BaseNode';
import type { IProperties } from '../core/BaseNode';

/**
 * The Inverter decorator inverts the result of the child, returning `SUCCESS`
 * for `FAILURE` and `FAILURE` for `SUCCESS`.
 *
 * @module b3
 * @class Inverter
 * @extends Decorator
 **/

export default class Inverter extends Decorator {

    /**
     * Creates an instance of Inverter.
     * @param {BaseNode | null} child The child node.
     * @memberof Inverter
     */
    constructor(child: BaseNode | null = null) {
        const properties: IProperties = {};
        super(
            child || undefined,
            'Inverter',
            '',
            properties
        );
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

        let status = await this.child._execute(tick);

        if (status === SUCCESS) {
            status = FAILURE;
        } else if (status === FAILURE) {
            status = SUCCESS;
        }

        return status;
    }
}
