import {assert} from 'chai';
import TickStub from '../TickStub';
import Runner from '../../src/actions/Runner';
import {RUNNING} from '../../src/constants';

suite('Action: Runner', function() {
    test('Name', function() {
        assert.equal(new Runner().name, 'Runner');
    });

    test('Tick', function() {
        let failer = new Runner();

        let status = failer._execute(TickStub());
        assert.equal(status, RUNNING);
    });
});
