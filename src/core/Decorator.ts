import BaseNode, { IProperties } from './BaseNode';
import { DECORATOR, SUCCESS, STATE } from '../constants';
import Tick from './Tick';

/**
 * 异步兼容 Decorator 基类
 *
 * 装饰器节点只有一个 child。
 * 子类应重写 async tick(tick) 方法，并在内部使用
 * `await this.child._execute(tick)` 以实现异步逻辑。
 */
export default class Decorator extends BaseNode {
  declare child: BaseNode | null;

  constructor(child: BaseNode | null = null, name: string = 'Decorator', title: string = name, properties: IProperties = {}) {
    super(DECORATOR, name, title, '', properties);
    this.child = child;
  }

  /**
   * 异步 tick 函数。
   * 默认实现仅简单执行 child。
   * 子类可重写该逻辑（如 Inverter, Limiter, Repeater 等）。
   */
  async tick(tick: Tick): Promise<STATE> {
    if (!this.child) {
      // 没有 child 的装饰器一般直接返回 SUCCESS 或 FAILURE
      return SUCCESS;
    }

    // Propagate tick to child
    const status = await this.child._execute(tick);
    return status;
  }
}
