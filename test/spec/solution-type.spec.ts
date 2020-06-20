import { calculateSolutionType }    from '../../src/solution-type';
import assert                       from 'assert';

it('calculateSolutionType', () => assert.throws(() => calculateSolutionType(''), SyntaxError));
