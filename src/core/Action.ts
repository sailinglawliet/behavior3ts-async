import BaseNode, { IProperties } from './BaseNode';
import { ACTION } from '../constants';

/**
 * Action is the base class for all action nodes. Thus, if you want to create
 * new custom action nodes, you need to inherit from this class. For example,
 * take a look at the Runner action:
 *
 *     class Runner extends b3.Action {
 *       constructor(){
 *         super({name: 'Runner'});
 *       }
 *       tick(tick : Tick) {
 *         return b3.RUNNING;
 *       }
 *     };
 *
 * @module b3
 * @class Action
 * @extends BaseNode
 **/

export default class Action extends BaseNode {

    /**
     * Creates an instance of Action.
     * @param {string} name Node name. Default to `Action`.
     * @param {string} title
     * @param {IProperties} properties
     * @memberof Action
     */
    constructor(name: string = 'Action', title: string = name, properties: IProperties = {}) {
        super(
            ACTION,
            name,
            title,
            '',
            properties
        );
    }

}
