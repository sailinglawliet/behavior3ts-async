import Composite from '../core/Composite';
import { SUCCESS } from '../constants';
import Tick from '../core/Tick';
import BaseNode from '../core/BaseNode';
import { STATE } from '../constants';
// import { Logger } from '@byted-service/logger';

// const logger = new Logger();
/**
 * 异步增强版 Sequence
 * 会依次执行每个子节点，遇到非 SUCCESS 就立即返回该状态；
 * 所有子节点都成功则返回 SUCCESS。
 */
export default class Sequence extends Composite {
  constructor(children: BaseNode[] = []) {
    super(children, 'Sequence');
  }

  /**
   * 异步 tick：顺序执行每个子节点并等待结果
   */
  async tick(tick: Tick): Promise<STATE> {
    for (let i = 0; i < this.children.length; i++) {
      const status = await this.children[i]._execute(tick);
      // logger.info(`[Sequence] 子节点 ${i} 执行状态: ${status}`);
      
      if (status !== SUCCESS) {
        return status; // FAILURE / RUNNING / ERROR
      }
    }

    return SUCCESS;
  }
}
