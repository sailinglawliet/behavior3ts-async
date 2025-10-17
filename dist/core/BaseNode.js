"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const b3_functions_1 = require("../b3.functions");
const constants_1 = require("../constants");
/**
 * 异步增强版 BaseNode
 * 支持 async/await 节点（tick 可返回 Promise<STATE>）
 */
class BaseNode {
    category;
    name;
    title;
    description;
    properties;
    id = (0, b3_functions_1.createUUID)();
    parameters = {};
    child;
    children;
    constructor(category = constants_1.Category.NONE, name = '', title = name, description = '', properties = {}) {
        this.category = category;
        this.name = name;
        this.title = title;
        this.description = description;
        this.properties = properties;
    }
    /**
     * 支持异步的 _execute
     */
    async _execute(tick) {
        // ENTER
        this._enter(tick);
        // OPEN
        if (!tick.blackboard.get('isOpen', tick.tree.id, this.id)) {
            this._open(tick);
        }
        let status;
        try {
            // 允许 tick() 返回 Promise<STATE> 或 STATE
            const result = this._tick(tick);
            status = result instanceof Promise ? await result : result;
        }
        catch (e) {
            status = constants_1.ERROR;
        }
        // CLOSE
        if (status !== constants_1.RUNNING) {
            this._close(tick);
        }
        // EXIT
        this._exit(tick);
        return status;
    }
    _enter(tick) {
        tick._enterNode(this);
        this.enter(tick);
    }
    _open(tick) {
        tick._openNode(this);
        tick.blackboard.set('isOpen', true, tick.tree.id, this.id);
        this.open(tick);
    }
    _tick(tick) {
        tick._tickNode(this);
        return this.tick(tick);
    }
    _close(tick) {
        tick._closeNode(this);
        tick.blackboard.set('isOpen', false, tick.tree.id, this.id);
        this.close(tick);
    }
    _exit(tick) {
        tick._exitNode(this);
        this.exit(tick);
    }
    enter(tick) { }
    open(tick) { }
    tick(tick) {
        return constants_1.STATE.NONE;
    }
    close(tick) { }
    exit(tick) { }
}
exports.default = BaseNode;
//# sourceMappingURL=BaseNode.js.map