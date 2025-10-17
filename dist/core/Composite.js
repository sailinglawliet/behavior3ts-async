"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseNode_1 = require("../core/BaseNode");
const constants_1 = require("../constants");
const constants_2 = require("../constants");
/**
 * 异步兼容 Composite 基类
 *
 * 所有子节点的 `_execute()` 调用都支持 async/await。
 * 子类（如 Sequence、Selector）只需在内部用 `await this.children[i]._execute(tick)`
 * 即可实现异步行为树节点。
 */
class Composite extends BaseNode_1.default {
    constructor(children = [], name = 'Composite', title = name, properties = {}) {
        super(constants_1.COMPOSITE, name, title, '', properties);
        this.children = (children).slice(0);
    }
    /**
     * 异步 tick：子类应覆盖此方法，并且使用 async/await 调用子节点。
     * 默认实现仅示例性地顺序执行所有子节点。
     */
    async tick(tick) {
        for (const child of this.children) {
            const status = await child._execute(tick);
            if (status !== constants_2.SUCCESS) {
                return status;
            }
        }
        return constants_2.SUCCESS;
    }
}
exports.default = Composite;
//# sourceMappingURL=Composite.js.map