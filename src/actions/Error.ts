import { ERROR, STATE } from '../constants';
import Action from '../core/Action';
import Tick from '../core/Tick';

/**
 * This action node returns `ERROR` always.
 *
 * @module b3
 * @class ErrorAction
 * @extends Action
 **/
export default class ErrorAction extends Action {

    /**
     * Creates an instance of ErrorAction.
     * @memberof ErrorAction
     */
    constructor() {
        super('Error');
    }

    /**
     * Tick method.
     * @method tick
     * @param {b3.Tick} tick A tick instance.
     * @return {STATE} Always return `ERROR`.
     **/
    tick(_tick: Tick): STATE {
        return ERROR;
    }
}
