import { doEval }                               from '../../src/eval';
import { DynamicSolution, SimpleSolution }      from '../../src/solution';
import { SolutionType, calculateSolutionType }  from '../../src/solution-type';
import assert                                   from 'assert';
import type { ParamCollection }                 from 'ebdd';

type SolutionInfo = [string, string, SolutionType];

interface MixedSolutionTestInfo
{
    readonly subSolutions:          SolutionInfo[];
    readonly expectedReplacement:   string;
    readonly expectedType:          SolutionType;
}

const MIXED_SOLUTION_TEST_INFOS: ParamCollection<MixedSolutionTestInfo> =
[
    // UNDEFINED + UNDEFINED
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[][[]]+[][[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['false', '![]', SolutionType.NUMERIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[][[]]+[][[]]+![]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['0', '+[]', SolutionType.WEAK_NUMERIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+[+[]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['true', '[!![]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+[!![]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['f', '([]+![])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+([]+![])[+[]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined0', '[][[]]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[][[]]+[][[]]+[][[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+(+[]+[+[]]))',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['f0', '([]+![])[+[]]+(+[])', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+([]+![])[+[]]+(+[]))',
    },

    // UNDEFINED
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[][[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['true', '!![]', SolutionType.NUMERIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+[!![]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['2', '!![]+!![]', SolutionType.WEAK_NUMERIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+[!![]+!![]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['1', '[+!![]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+[+!![]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['t', '([]+!![])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([]+!![])[+[]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+(!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['10', '+!![]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+(+!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['tfalse', '([]+!![])[+[]]+![]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([]+!![])[+[]]+![]',
    },

    // NUMERIC
    {
        subSolutions:
        [
            ['true', '!![]', SolutionType.NUMERIC],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[!![]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.NUMERIC],
            ['true', '!![]', SolutionType.NUMERIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+!![]',
    },
    {
        subSolutions:
        [
            ['0', '[+[]][+[]]', SolutionType.NUMERIC],
            ['0', '+[]', SolutionType.WEAK_NUMERIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[+[]][+[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.NUMERIC],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.NUMERIC],
            ['a', '([]+![])[+!![]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+([]+![])[+!![]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.NUMERIC],
            ['falsefalse', '![]+[![]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+![]+[![]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.NUMERIC],
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+(+[]+[+[]])',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.NUMERIC],
            ['aa', '([]+![])[+!![]]+([]+![])[+!![]]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+([]+![])[+!![]]+([]+![])[+!![]]',
    },

    // WEAK_NUMERIC
    {
        subSolutions:
        [
            ['0', '+[]', SolutionType.WEAK_NUMERIC],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['0', '+[]', SolutionType.WEAK_NUMERIC],
            ['true', '!![]', SolutionType.NUMERIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+!![]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_NUMERIC],
            ['0', '+[]', SolutionType.WEAK_NUMERIC],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_NUMERIC],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_NUMERIC],
            ['f', '([]+![])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+([]+![])[+[]]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_NUMERIC],
            ['false', '![]+[]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+!![]]+![]+[]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_NUMERIC],
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+(+[]+[+[]])',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_NUMERIC],
            ['falsefalse', '[![]]+![]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+[![]]+![]',
    },

    // OBJECT
    {
        subSolutions:
        [
            ['1', '[+!![]]', SolutionType.OBJECT],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+!![]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['false', '[![]]', SolutionType.OBJECT],
            ['false', '![]', SolutionType.NUMERIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+![]',
    },
    {
        subSolutions:
        [
            ['false', '[![]]', SolutionType.OBJECT],
            ['2', '!![]+!![]', SolutionType.WEAK_NUMERIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+(!![]+!![])',
    },
    {
        subSolutions:
        [
            ['false', '[![]]', SolutionType.OBJECT],
            ['true', '[!![]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+[!![]]',
    },
    {
        subSolutions:
        [
            ['0', '[+[]]', SolutionType.OBJECT],
            ['t', '(!![]+[])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+(!![]+[])[+[]]',
    },
    {
        subSolutions:
        [
            ['0', '[+[]]', SolutionType.OBJECT],
            ['truefalse', '!![]+[![]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+!![]+[![]]',
    },
    {
        subSolutions:
        [
            ['0', '[+[]]', SolutionType.OBJECT],
            ['12', '+!![]+[!![]+!![]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+(+!![]+[!![]+!![]])',
    },
    {
        subSolutions:
        [
            ['0', '[+[]]', SolutionType.OBJECT],
            ['12', '[+!![]]+(!![]+!![])', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+[+!![]]+(!![]+!![])',
    },

    // STRING
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['0', '[[]][+[]]++', SolutionType.NUMERIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+[[]][+[]]++',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['0', '+[]', SolutionType.WEAK_NUMERIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+(+[])',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['f', '(![]+[])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+(![]+[])[+[]]',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['false0', '![]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['10', '+!![]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+(+!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['ff', '(![]+[])[+[]]+(![]+[])[+[]]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+(![]+[])[+[]]+(![]+[])[+[]]',
    },

    // PREFIXED_STRING
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['true', '!![]', SolutionType.NUMERIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+!![]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['0', '+[]', SolutionType.WEAK_NUMERIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+(+[])',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['', '[]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+[]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['', '[[]+[]][+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+[[]+[]][+[]]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['false0', '![]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['0false', '+[]+[![]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+(+[]+[![]])',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['', '[]+[]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+[]+[]',
    },

    // WEAK_PREFIXED_STRING
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['false', '![]', SolutionType.NUMERIC],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+![]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['0', '+[]', SolutionType.WEAK_NUMERIC],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+(+[])',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['f', '(![]+[])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+(![]+[])[+[]]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['undefined0', '[][[]]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+[][[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['10', '+!![]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+(+!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['00', '[+[]]+(+[])', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+[+[]]+(+[])',
    },
];

describe
(
    'DynamicSolution',
    () =>
    {
        it
        (
            'when empty',
            () =>
            {
                const solution = new DynamicSolution();

                assert.strictEqual(solution.length, 2);
                assert.strictEqual(solution.replacement, '[]');
                assert.strictEqual(solution.source, '');
                assert.strictEqual(solution.type, SolutionType.OBJECT);
            },
        );

        it
        (
            'when containing one solution',
            () =>
            {
                const solution = new DynamicSolution();
                solution.append(new SimpleSolution('Infinity', '1/0', SolutionType.NUMERIC));

                assert.strictEqual(solution.length, 3);
                assert.strictEqual(solution.replacement, '1/0');
                assert.strictEqual(solution.source, 'Infinity');
                assert.strictEqual(solution.type, SolutionType.NUMERIC);
            },
        );

        it
        (
            'when containing multiple solutions',
            () =>
            {
                const solution = new DynamicSolution();
                ['+![]', '+!![]', '!![]+!![]'].forEach
                (
                    (expr: string, index: number) =>
                    solution.append
                    (new SimpleSolution(String(index), expr, SolutionType.WEAK_NUMERIC)),
                );
                for (const char of 'abc')
                    solution.prepend(new SimpleSolution(char, `"${char}"`, SolutionType.STRING));
                const expectedReplacement = '"c"+"b"+"a"+(+![])+(+!![])+(!![]+!![])';

                assert.strictEqual(solution.length, expectedReplacement.length);
                assert.strictEqual(solution.replacement, expectedReplacement);
                assert.strictEqual(solution.source, 'cba012');
                assert.strictEqual(solution.type, SolutionType.COMBINED_STRING);
            },
        );

        describe
        (
            'source',
            () =>
            {
                it
                (
                    'is a string when all contained solutions have a source',
                    () =>
                    {
                        const solution = new DynamicSolution();
                        solution.append(new SimpleSolution('0', '+[]', SolutionType.WEAK_NUMERIC));
                        solution.append(new SimpleSolution('', '[]', SolutionType.OBJECT));
                        assert.strictEqual(solution.source, '0');
                    },
                );

                it
                (
                    'is undefined when not all contained solutions have a source',
                    () =>
                    {
                        const solution = new DynamicSolution();
                        solution.append(new SimpleSolution('0', '+[]', SolutionType.WEAK_NUMERIC));
                        solution.append(new SimpleSolution(undefined, '[]', SolutionType.OBJECT));
                        assert.strictEqual(solution.source, undefined);
                    },
                );
            },
        );

        describe
        (
            'when containing mixed solutions',
            () =>
            {
                it.per
                (
                    MIXED_SOLUTION_TEST_INFOS,
                    (info: MixedSolutionTestInfo) =>
                    {
                        const title =
                        info
                        .subSolutions
                        .map(([,, type]: SolutionInfo) => SolutionType[type])
                        .join(' + ');
                        const returnValue = { ...info, title };
                        return returnValue;
                    },
                )
                (
                    '#.title',
                    ({ subSolutions, expectedReplacement, expectedType }: MixedSolutionTestInfo) =>
                    {
                        const solution = new DynamicSolution();
                        for (const [source, replacement, type] of subSolutions)
                        {
                            assert.strictEqual(calculateSolutionType(replacement), type);
                            solution.append(new SimpleSolution(source, replacement, type));
                        }

                        assert.strictEqual(solution.replacement, expectedReplacement);
                        assert.strictEqual(solution.source, doEval(expectedReplacement));
                        assert.strictEqual(solution.type, expectedType);
                        assert.strictEqual
                        (calculateSolutionType(solution.replacement), expectedType);
                    },
                );
            },
        );
    },
);
