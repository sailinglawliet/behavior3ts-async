import {assert} from 'chai';
import Condition from '../../src/core/Condition';
import {CONDITION} from '../../src/constants';

suite('Core: Condition', function() {
    test('Category', function() {
        assert.equal(new Condition().category, CONDITION);
    });

    test('Initialization', function() {
        let node = new Condition();

        assert.isOk(node.id);
        assert.isDefined(node.title);
        assert.isDefined(node.description);
        assert.equal(node.category, 'condition');
    });

});
