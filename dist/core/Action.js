"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseNode_1 = require("../core/BaseNode");
const constants_1 = require("../constants");
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
class Action extends BaseNode_1.default {
    /**
     * Creates an instance of Action.
     * @param {Object} options
     * @param {String} options.name Node name. Default to `Action`.
     * @param {String} options.title
     * @param {Object} options.properties
     * @memberof Action
     */
    constructor(name = 'Action', title = name, properties = {}) {
        super(constants_1.ACTION, name, title, '', properties);
    }
}
exports.default = Action;
//# sourceMappingURL=Action.js.map