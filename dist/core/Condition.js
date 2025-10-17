"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseNode_1 = require("./BaseNode");
const constants_1 = require("../constants");
/**
 * Condition is the base class for all condition nodes. Thus, if you want to
 * create new custom condition nodes, you need to inherit from this class.
 *
 * @class Condition
 * @extends BaseNode
 **/
class Condition extends BaseNode_1.default {
    /**
     * Creates an instance of Condition.
     * @param {Object} options
     * @param {Object} options.name Node name. Default to `Condition`.
     * @param {String} options.title
     * @param {Object} options.properties
     * @memberof Condition
     */
    constructor(name = 'Condition', title = name, properties = {}) {
        super(constants_1.CONDITION, name, title, '', properties);
    }
}
exports.default = Condition;
//# sourceMappingURL=Condition.js.map