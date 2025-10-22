import BaseNode, { IProperties } from '../core/BaseNode';
import { COMPOSITE, STATE, SUCCESS } from '../constants';
import Tick from '../core/Tick';

/**
 * 异步兼容 Composite 基类
 * 
 * 所有子节点的 `_execute()` 调用都支持 async/await。
 * 子类（如 Sequence、Selector）只需在内部用 `await this.children[i]._execute(tick)`
 * 即可实现异步行为树节点。
 */
export default class Composite extends BaseNode {
  declare children: BaseNode[];

  constructor(children: BaseNode[] = [], name: string = 'Composite', title: string = name, properties: IProperties = {}) {
    super(COMPOSITE, name, title, '', properties);
    this.children = (children).slice(0);
  }

  /**
   * 异步 tick：子类应覆盖此方法，并且使用 async/await 调用子节点。
   * 默认实现仅示例性地顺序执行所有子节点。
   */
  async tick(tick: Tick): Promise<STATE> {
    for (const child of this.children) {
      const status = await child._execute(tick);
      if (status !== SUCCESS) {
        return status;
      }
    }
    return SUCCESS;
  }
}
