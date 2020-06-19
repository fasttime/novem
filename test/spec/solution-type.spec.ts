import { getSolutionType }  from '../../src/solution-type';
import assert               from 'assert';

it('getSolutionType', () => assert.throws(() => getSolutionType(''), SyntaxError));
