import { SimpleSolution }       from '../../src/solution';
import { SolutionType }         from '../../src/solution-type';
import assert                   from 'assert';
import type { ParamCollection } from 'ebdd';

interface IsAttrTestInfo
{
    readonly isAttrName:    'isArithmetic' | 'isLoose' | 'isString' | 'isUndefined' | 'isWeak';
    readonly solutionType:  SolutionType;
    readonly expectedValue: boolean;
}

const IS_TYPE_TEST_INFOS: ParamCollection<IsAttrTestInfo> =
[
    {
        isAttrName:     'isArithmetic',
        solutionType:   SolutionType.UNDEFINED,
        expectedValue:  true,
    },
    {
        isAttrName:     'isArithmetic',
        solutionType:   SolutionType.NUMERIC,
        expectedValue:  true,
    },
    {
        isAttrName:     'isArithmetic',
        solutionType:   SolutionType.WEAK_NUMERIC,
        expectedValue:  true,
    },
    {
        isAttrName:     'isArithmetic',
        solutionType:   SolutionType.OBJECT,
        expectedValue:  false,
    },
    {
        isAttrName:     'isArithmetic',
        solutionType:   SolutionType.STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isArithmetic',
        solutionType:   SolutionType.PREFIXED_STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isArithmetic',
        solutionType:   SolutionType.WEAK_PREFIXED_STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isArithmetic',
        solutionType:   SolutionType.COMBINED_STRING,
        expectedValue:  false,
    },

    {
        isAttrName:     'isLoose',
        solutionType:   SolutionType.UNDEFINED,
        expectedValue:  false,
    },
    {
        isAttrName:     'isLoose',
        solutionType:   SolutionType.NUMERIC,
        expectedValue:  false,
    },
    {
        isAttrName:     'isLoose',
        solutionType:   SolutionType.WEAK_NUMERIC,
        expectedValue:  true,
    },
    {
        isAttrName:     'isLoose',
        solutionType:   SolutionType.OBJECT,
        expectedValue:  false,
    },
    {
        isAttrName:     'isLoose',
        solutionType:   SolutionType.STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isLoose',
        solutionType:   SolutionType.PREFIXED_STRING,
        expectedValue:  true,
    },
    {
        isAttrName:     'isLoose',
        solutionType:   SolutionType.WEAK_PREFIXED_STRING,
        expectedValue:  true,
    },
    {
        isAttrName:     'isLoose',
        solutionType:   SolutionType.COMBINED_STRING,
        expectedValue:  true,
    },

    {
        isAttrName:     'isString',
        solutionType:   SolutionType.UNDEFINED,
        expectedValue:  false,
    },
    {
        isAttrName:     'isString',
        solutionType:   SolutionType.NUMERIC,
        expectedValue:  false,
    },
    {
        isAttrName:     'isString',
        solutionType:   SolutionType.WEAK_NUMERIC,
        expectedValue:  false,
    },
    {
        isAttrName:     'isString',
        solutionType:   SolutionType.OBJECT,
        expectedValue:  false,
    },
    {
        isAttrName:     'isString',
        solutionType:   SolutionType.STRING,
        expectedValue:  true,
    },
    {
        isAttrName:     'isString',
        solutionType:   SolutionType.PREFIXED_STRING,
        expectedValue:  true,
    },
    {
        isAttrName:     'isString',
        solutionType:   SolutionType.WEAK_PREFIXED_STRING,
        expectedValue:  true,
    },
    {
        isAttrName:     'isString',
        solutionType:   SolutionType.COMBINED_STRING,
        expectedValue:  true,
    },

    {
        isAttrName:     'isUndefined',
        solutionType:   SolutionType.UNDEFINED,
        expectedValue:  true,
    },
    {
        isAttrName:     'isUndefined',
        solutionType:   SolutionType.NUMERIC,
        expectedValue:  false,
    },
    {
        isAttrName:     'isUndefined',
        solutionType:   SolutionType.WEAK_NUMERIC,
        expectedValue:  false,
    },
    {
        isAttrName:     'isUndefined',
        solutionType:   SolutionType.OBJECT,
        expectedValue:  false,
    },
    {
        isAttrName:     'isUndefined',
        solutionType:   SolutionType.STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isUndefined',
        solutionType:   SolutionType.PREFIXED_STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isUndefined',
        solutionType:   SolutionType.WEAK_PREFIXED_STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isUndefined',
        solutionType:   SolutionType.COMBINED_STRING,
        expectedValue:  false,
    },

    {
        isAttrName:     'isWeak',
        solutionType:   SolutionType.UNDEFINED,
        expectedValue:  false,
    },
    {
        isAttrName:     'isWeak',
        solutionType:   SolutionType.NUMERIC,
        expectedValue:  false,
    },
    {
        isAttrName:     'isWeak',
        solutionType:   SolutionType.WEAK_NUMERIC,
        expectedValue:  true,
    },
    {
        isAttrName:     'isWeak',
        solutionType:   SolutionType.OBJECT,
        expectedValue:  false,
    },
    {
        isAttrName:     'isWeak',
        solutionType:   SolutionType.STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isWeak',
        solutionType:   SolutionType.PREFIXED_STRING,
        expectedValue:  false,
    },
    {
        isAttrName:     'isWeak',
        solutionType:   SolutionType.WEAK_PREFIXED_STRING,
        expectedValue:  true,
    },
    {
        isAttrName:     'isWeak',
        solutionType:   SolutionType.COMBINED_STRING,
        expectedValue:  false,
    },
];

describe
(
    'AbstractSolution',
    () =>
    {
        it
        .per
        (
            IS_TYPE_TEST_INFOS,
            (info: IsAttrTestInfo) =>
            {
                const solutionTypeName = SolutionType[info.solutionType];
                const returnValue = { ...info, solutionTypeName };
                return returnValue;
            },
        )
        (
            '#.isAttrName with type #.solutionTypeName',
            ({ isAttrName, solutionType, expectedValue }: IsAttrTestInfo) =>
            {
                const solution = new SimpleSolution(undefined, '', solutionType);
                assert.strictEqual(solution[isAttrName], expectedValue);
            },
        );
    },
);
