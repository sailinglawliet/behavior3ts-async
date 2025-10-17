"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Composite_1 = require("../core/Composite");
const constants_1 = require("../constants");
const logger_1 = require("@byted-service/logger");
const logger = new logger_1.Logger();
/**
 * 异步增强版 Sequence
 * 会依次执行每个子节点，遇到非 SUCCESS 就立即返回该状态；
 * 所有子节点都成功则返回 SUCCESS。
 */
class Sequence extends Composite_1.default {
    constructor(children = []) {
        super(children, 'Sequence');
    }
    /**
     * 异步 tick：顺序执行每个子节点并等待结果
     */
    async tick(tick) {
        for (let i = 0; i < this.children.length; i++) {
            const status = await this.children[i]._execute(tick);
            logger.info(`[Sequence] 子节点 ${i} 执行状态: ${status}`);
            if (status !== constants_1.SUCCESS) {
                return status; // FAILURE / RUNNING / ERROR
            }
        }
        return constants_1.SUCCESS;
    }
}
exports.default = Sequence;
//# sourceMappingURL=Sequence.js.map