"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseNode_1 = require("./BaseNode");
const constants_1 = require("../constants");
/**
 * 异步兼容 Decorator 基类
 *
 * 装饰器节点只有一个 child。
 * 子类应重写 async tick(tick) 方法，并在内部使用
 * `await this.child._execute(tick)` 以实现异步逻辑。
 */
class Decorator extends BaseNode_1.default {
    constructor(child = null, name = 'Decorator', title = name, properties = {}) {
        super(constants_1.DECORATOR, name, title, '', properties);
        this.child = child;
    }
    /**
     * 异步 tick 函数。
     * 默认实现仅简单执行 child。
     * 子类可重写该逻辑（如 Inverter, Limiter, Repeater 等）。
     */
    async tick(tick) {
        if (!this.child) {
            // 没有 child 的装饰器一般直接返回 SUCCESS 或 FAILURE
            return constants_1.SUCCESS;
        }
        // Propagate tick to child
        const status = await this.child._execute(tick);
        return status;
    }
}
exports.default = Decorator;
//# sourceMappingURL=Decorator.js.map