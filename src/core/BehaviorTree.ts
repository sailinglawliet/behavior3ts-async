import { createUUID } from '../b3.functions';
import { COMPOSITE, DECORATOR, RUNNING, STATE } from '../constants';
import * as Decorators from '../decorators/index';
import * as Composites from '../composites/index';
import * as Actions from '../actions/index';
import Tick from './Tick';
import BaseNode from './BaseNode';
import Blackboard from './Blackboard';

export default class BehaviorTree {
  id = createUUID();
  title = 'The behavior tree';
  description = 'Default description';
  properties = {};
  root: BaseNode = null;
  debug: any = null;

  constructor() { }

  load(data: any, names: any = {}) {
    this.title = data.title || this.title;
    this.description = data.description || this.description;
    this.properties = data.properties || this.properties;

    let nodes: any = {};
    let id, spec, node;

    for (id in data.nodes) {
      spec = data.nodes[id];
      let Cls;

      if (spec.name in names) {
        Cls = names[spec.name];
      } else if (spec.name in Decorators) {
        Cls = (Decorators as any)[spec.name];
      } else if (spec.name in Composites) {
        Cls = (Composites as any)[spec.name];
      } else if (spec.name in Actions) {
        Cls = (Actions as any)[spec.name];
      } else {
        throw new EvalError(`BehaviorTree.load: Invalid node name "${spec.name}".`);
      }

      node = new Cls(spec.properties);
      node.id = spec.id || node.id;
      node.title = spec.title || node.title;
      node.description = spec.description || node.description;
      node.properties = spec.properties || node.properties;

      nodes[id] = node;
    }

    for (id in data.nodes) {
      spec = data.nodes[id];
      node = nodes[id];

      if (node.category === COMPOSITE && spec.children) {
        for (let i = 0; i < spec.children.length; i++) {
          let cid = spec.children[i];
          node.children.push(nodes[cid]);
        }
      } else if (node.category === DECORATOR && spec.child) {
        node.child = nodes[spec.child];
      }
    }

    this.root = nodes[data.root];
  }

  dump() {
    let data: { [key: string]: any } = {};
    let customNames = [];

    data.title = this.title;
    data.description = this.description;
    data.root = this.root ? this.root.id : null;
    data.properties = this.properties;
    data.nodes = {};
    data.custom_nodes = [];

    if (!this.root) return data;

    let stack = [this.root];
    while (stack.length > 0) {
      let node = stack.pop();

      let spec: { [key: string]: any } = {};
      spec.id = node.id;
      spec.name = node.name;
      spec.title = node.title;
      spec.description = node.description;
      spec.properties = node.properties;
      spec.parameters = node.parameters;

      let proto = node.constructor && node.constructor.prototype;
      let nodeName = (proto && proto.name) || node.name;
      if (
        !(Decorators as any)[nodeName] &&
        !(Composites as any)[nodeName] &&
        !(Actions as any)[nodeName] &&
        customNames.indexOf(nodeName) < 0
      ) {
        let subdata: { [key: string]: any } = {};
        subdata.name = nodeName;
        subdata.title = (proto && proto.title) || node.title;
        subdata.category = node.category;

        customNames.push(nodeName);
        data.custom_nodes.push(subdata);
      }

      if (node.category === COMPOSITE && node.children) {
        let children = [];
        for (let i = node.children.length - 1; i >= 0; i--) {
          children.push(node.children[i].id);
          stack.push(node.children[i]);
        }
        spec.children = children;
      } else if (node.category === DECORATOR && node.child) {
        stack.push(node.child);
        spec.child = node.child.id;
      }

      data.nodes[node.id] = spec;
    }

    return data;
  }

  /**
   * 异步增强版 tick()
   * 支持 async/await 节点
   */
  async tick(target: Object, blackboard: Blackboard): Promise<STATE> {
    if (!blackboard) {
      throw new Error(
        'The blackboard parameter is obligatory and must be an instance of b3.Blackboard'
      );
    }

    /* CREATE A TICK OBJECT */
    const tick = new Tick();
    tick.debug = this.debug;
    tick.target = target;
    tick.blackboard = blackboard;
    tick.tree = this;

    /* EXECUTE ROOT NODE */
    let state: STATE;
    try {
      const result = this.root._execute(tick);
      state = result instanceof Promise ? await result : result;
    } catch (e) {
      state = STATE.ERROR;
    }

    /* CLOSE NODES FROM LAST TICK, IF NEEDED */
    const lastOpenNodes = blackboard.get('openNodes', this.id) || [];
    const currOpenNodes = tick._openNodes.slice(0);

    let start = 0;
    for (let i = 0; i < Math.min(lastOpenNodes.length, currOpenNodes.length); i++) {
      start = i + 1;
      if (lastOpenNodes[i] !== currOpenNodes[i]) {
        break;
      }
    }

    for (let i = lastOpenNodes.length - 1; i >= start; i--) {
      await lastOpenNodes[i]._close(tick); // 支持 async close()
    }

    /* POPULATE BLACKBOARD */
    blackboard.set('openNodes', currOpenNodes, this.id);
    blackboard.set('nodeCount', tick._nodeCount, this.id);

    return state;
  }
}
