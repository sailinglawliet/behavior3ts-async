import {assert} from 'chai';
import BehaviorTree from '../../src/core/BehaviorTree';
import Priority from '../../src/composites/Priority';
import MemSequence from '../../src/composites/MemSequence';
import Inverter from '../../src/decorators/Inverter';
import MaxTime from '../../src/decorators/MaxTime';
import Condition from '../../src/core/Condition';
import Wait from '../../src/actions/Wait';
import {ACTION, CONDITION} from '../../src/constants';

// load and dump JSON model

suite('Core: Behavior Tree - Serialization', function() {
    test('Load JSON with default nodes', function() {
        let tree = new BehaviorTree();

        let data = {
            'title'       : 'A JSON Behavior Tree',
            'description' : 'This description',
            'root'        : '1',
            'properties'  : {
                'variable' : 'value'
            },
            'nodes' : {
                // Test properties and children
                '1': {
                    'id'          : '1',
                    'name'        : 'Priority',
                    'title'       : 'Root Node',
                    'description' : 'Root Description',
                    'children'    : ['2', '3'],
                    'properties'  : {
                        'var1' : 123,
                        'composite': {
                            'var2' : true,
                            'var3' : 'value'
                        }
                    }
                },
                // Test child
                '2': {
                    'name'        : 'Inverter',
                    'title'       : 'Node 1',
                    'description' : 'Node 1 Description',
                    'child'       : '4',
                },
                '3': {
                    'name'        : 'MemSequence',
                    'title'       : 'Node 2',
                    'description' : 'Node 2 Description',
                    'children'    : [],
                },
                // Test parameters
                '4': {
                    'name'        : 'MaxTime',
                    'title'       : 'Node 3',
                    'description' : 'Node 3 Description',
                    'child'       : null,
                    'properties'  : {
                        'maxTime' : 1 // works as constructor argument now
                    },
                    'parameters'  : {
                        'maxTime' : 999 // does not affect anymore
                    }
                }
            }
        };

        tree.load(data);

        // Tree information
        assert.equal(tree.title, 'A JSON Behavior Tree');
        assert.equal(tree.description, 'This description');
        assert.isDefined(tree.properties);
        assert.equal(tree.properties['variable'], 'value');

        // Root
        assert.instanceOf(tree.root, Priority);
        assert.equal(tree.root.id, '1');
        assert.equal(tree.root.title, 'Root Node');
        assert.equal(tree.root.description, 'Root Description');
        assert.equal(tree.root.children.length, 2);
        assert.isDefined(tree.root.properties);
        assert.equal(tree.root.properties['var1'], 123);
        assert.isDefined(tree.root.properties['composite']);
        assert.equal(tree.root.properties['composite']['var2'], true);
        assert.equal(tree.root.properties['composite']['var3'], 'value');

        // Node 1
        let node = tree.root.children[0];
        assert.instanceOf(node, Inverter);
        assert.equal(node.title, 'Node 1');
        assert.equal(node.description, 'Node 1 Description');
        assert.isDefined(node.child);

        // Node 2
        let node = tree.root.children[1];
        assert.instanceOf(node, MemSequence);
        assert.equal(node.title, 'Node 2');
        assert.equal(node.description, 'Node 2 Description');
        assert.equal(node.children.length, 0);

        // Node 3
        let node = tree.root.children[0].child;
        assert.instanceOf(node, MaxTime);
        assert.equal(node.title, 'Node 3');
        assert.equal(node.description, 'Node 3 Description');
        assert.notEqual(node.parameters['maxTime'], 999);
    });

    test('Load JSON model with custom nodes', function() {
        let tree = new BehaviorTree();

        let data = {
            'title'       : 'A JSON Behavior Tree',
            'description' : 'This descriptions',
            'root'        : '1',
            'nodes'       : {
                '1': {
                    'name'        : 'Priority',
                    'title'       : 'Root Node',
                    'description' : 'Root Description',
                    'children'    : ['2'],
                },
                '2': {
                    'name'        : 'Condition',
                    'title'       : 'Node 2',
                    'description' : 'Node 2 Description'
                }
            }
        };

        tree.load(data, {'Condition': Condition});

        // Root
        assert.instanceOf(tree.root, Priority);
        assert.equal(tree.root.title, 'Root Node');
        assert.equal(tree.root.description, 'Root Description');
        assert.equal(tree.root.children.length, 1);

        // Node 2
        let node = tree.root.children[0];
        assert.instanceOf(node, Condition);
        assert.equal(node.title, 'Node 2');
        assert.equal(node.description, 'Node 2 Description');
    });

    test('Dump JSON model', function() {
        let tree = new BehaviorTree();

        tree.properties = {
            'prop': 'value',
            'comp': {
                'val1': 234,
                'val2': 'value'
            }
        };

        let node5 = new Condition();
        node5.id = 'node-5';
        node5.title = 'Node5';
        node5.description = 'Node 5 Description';

        let node4 = new Wait();
        node4.id = 'node-4';
        node4.title = 'Node4';
        node4.description = 'Node 4 Description';

        let node3 = new MemSequence({children: [node5]});
        node3.id = 'node-3';
        node3.title = 'Node3';
        node3.description = 'Node 3 Description';

        let node2 = new Inverter({child: node4});
        node2.id = 'node-2';
        node2.title = 'Node2';
        node2.description = 'Node 2 Description';

        let node1 = new Priority({children: [node2, node3]});
        node1.id = 'node-1';
        node1.title = 'Node1';
        node1.description = 'Node 1 Description';
        node1.properties = {
            'key' : 'value'
        };

        tree.root = node1;
        tree.title = 'Title in Tree';
        tree.description = 'Tree Description';

        let data = tree.dump();

        assert.equal(data['title'], 'Title in Tree');
        assert.equal(data['description'], 'Tree Description');
        assert.equal(data['root'], 'node-1');
        assert.equal(data['properties']['prop'], 'value');
        assert.equal(data['properties']['comp']['val1'], 234);
        assert.equal(data['properties']['comp']['val2'], 'value');

        assert.isDefined(data['custom_nodes']);
        assert.equal(data['custom_nodes'].length, 1);
        assert.equal(data['custom_nodes'][0]['name'], 'Condition');
        assert.equal(data['custom_nodes'][0]['title'], 'Node5');
        assert.equal(data['custom_nodes'][0]['category'], CONDITION);

        assert.isDefined(data['nodes']['node-1']);
        assert.isDefined(data['nodes']['node-2']);
        assert.isDefined(data['nodes']['node-3']);
        assert.isDefined(data['nodes']['node-4']);
        assert.isDefined(data['nodes']['node-5']);

        assert.equal(data['nodes']['node-1']['id'], 'node-1');
        assert.equal(data['nodes']['node-1']['name'], 'Priority');
        assert.equal(data['nodes']['node-1']['title'], 'Node1');
        assert.equal(data['nodes']['node-1']['description'], 'Node 1 Description');
        assert.equal(data['nodes']['node-1']['children'][0], 'node-3');
        assert.equal(data['nodes']['node-1']['children'][1], 'node-2');
        assert.equal(data['nodes']['node-1']['properties']['key'], 'value');

        assert.equal(data['nodes']['node-2']['name'], 'Inverter');
        assert.equal(data['nodes']['node-2']['title'], 'Node2');
        assert.equal(data['nodes']['node-2']['description'], 'Node 2 Description');
        assert.isOk(data['nodes']['node-2']['child']);

        assert.equal(data['nodes']['node-3']['name'], 'MemSequence');
        assert.equal(data['nodes']['node-3']['title'], 'Node3');
        assert.equal(data['nodes']['node-3']['description'], 'Node 3 Description');
        assert.equal(data['nodes']['node-3']['children'].length, 1);

        assert.equal(data['nodes']['node-4']['name'], 'Wait');
        assert.equal(data['nodes']['node-4']['title'], 'Node4');
        assert.equal(data['nodes']['node-4']['description'], 'Node 4 Description');
        assert.isUndefined(data['nodes']['node-4']['children']);
        assert.isUndefined(data['nodes']['node-4']['child']);

        assert.equal(data['nodes']['node-5']['name'], 'Condition');
        assert.equal(data['nodes']['node-5']['title'], 'Node5');
        assert.equal(data['nodes']['node-5']['description'], 'Node 5 Description');
        assert.isUndefined(data['nodes']['node-5']['children']);
        assert.isUndefined(data['nodes']['node-5']['child']);
    });

});
