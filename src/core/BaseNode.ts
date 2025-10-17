import { createUUID } from '../b3.functions';
import { RUNNING, Category, STATE, ERROR } from '../constants';
import Tick from './Tick';

export type IProperties = { [key: string]: any };

/**
 * 异步增强版 BaseNode
 * 支持 async/await 节点（tick 可返回 Promise<STATE>）
 */
export default class BaseNode {
  id = createUUID();
  parameters = {};
  child: BaseNode;
  children: BaseNode[];

  constructor(
    public category = Category.NONE,
    public name = '',
    public title = name,
    public description = '',
    public properties: IProperties = {}
  ) { }

  /**
   * 支持异步的 _execute
   */
  async _execute(tick: Tick): Promise<STATE> {
    // ENTER
    this._enter(tick);

    // OPEN
    if (!tick.blackboard.get('isOpen', tick.tree.id, this.id)) {
      this._open(tick);
    }

    let status: STATE;
    try {
      // 允许 tick() 返回 Promise<STATE> 或 STATE
      const result = this._tick(tick);
      status = result instanceof Promise ? await result : result;
    } catch (e) {
      status = ERROR;
    }

    // CLOSE
    if (status !== RUNNING) {
      this._close(tick);
    }

    // EXIT
    this._exit(tick);

    return status;
  }

  _enter(tick: Tick) {
    tick._enterNode(this);
    this.enter(tick);
  }

  _open(tick: Tick) {
    tick._openNode(this);
    tick.blackboard.set('isOpen', true, tick.tree.id, this.id);
    this.open(tick);
  }

  _tick(tick: Tick): STATE | Promise<STATE> {
    tick._tickNode(this);
    return this.tick(tick);
  }

  _close(tick: Tick) {
    tick._closeNode(this);
    tick.blackboard.set('isOpen', false, tick.tree.id, this.id);
    this.close(tick);
  }

  _exit(tick: Tick) {
    tick._exitNode(this);
    this.exit(tick);
  }

  enter(tick: Tick) { }
  open(tick: Tick) { }
  tick(tick: Tick): STATE | Promise<STATE> {
    return STATE.NONE;
  }
  close(tick: Tick) { }
  exit(tick: Tick) { }
}
