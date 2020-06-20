import { SolutionType } from './solution-type';

export interface Matcher extends ReadonlyArray<SolutionType>
{ }

export interface Rule
{
    readonly match: readonly Matcher[];
    readonly replace: (...replacements: string[]) => string;
    readonly solutionType: SolutionType;
}

const RULES: readonly Rule[] =
[
    // UNDEFINED
    {
        match:
        [
            [SolutionType.UNDEFINED],
            [SolutionType.UNDEFINED],
            [SolutionType.WEAK_NUMERIC],
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+[${r3}])`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match:
        [
            [SolutionType.UNDEFINED],
            [SolutionType.UNDEFINED],
            [SolutionType.WEAK_PREFIXED_STRING],
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+(${r3}))`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match:
        [
            [SolutionType.UNDEFINED],
            [SolutionType.UNDEFINED],
            [SolutionType.OBJECT, SolutionType.STRING],
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+${r3})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match:
        [
            [SolutionType.UNDEFINED],
            [SolutionType.UNDEFINED],
        ],
        replace: (r1: string, r2: string): string => `[]+${r1}+${r2}`,
        solutionType: SolutionType.STRING,
    },
    {
        match:
        [
            [SolutionType.UNDEFINED],
            [SolutionType.NUMERIC, SolutionType.WEAK_NUMERIC],
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match:
        [
            [SolutionType.UNDEFINED],
            [SolutionType.PREFIXED_STRING],
        ],
        replace: (r1: string, r2: string): string => `${r1}+(${r2})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match: [[SolutionType.UNDEFINED]],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.PREFIXED_STRING,
    },

    // NUMERIC, PREFIXED_STRING
    {
        match:
        [
            [SolutionType.NUMERIC],
            [SolutionType.UNDEFINED, SolutionType.NUMERIC, SolutionType.PREFIXED_STRING],
        ],
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.STRING,
    },
    {
        match:
        [
            [SolutionType.NUMERIC],
            [SolutionType.WEAK_NUMERIC],
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match: [[SolutionType.NUMERIC, SolutionType.PREFIXED_STRING]],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.PREFIXED_STRING,
    },

    // WEAK_NUMERIC, WEAK_PREFIXED_STRING
    {
        match:
        [
            [SolutionType.WEAK_NUMERIC],
            [SolutionType.UNDEFINED, SolutionType.NUMERIC, SolutionType.PREFIXED_STRING],
        ],
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.STRING,
    },
    {
        match:
        [
            [SolutionType.WEAK_NUMERIC],
            [SolutionType.WEAK_NUMERIC],
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },
    {
        match: [[SolutionType.WEAK_NUMERIC, SolutionType.WEAK_PREFIXED_STRING]],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },

    // OBJECT, STRING
    {
        match: [[SolutionType.OBJECT, SolutionType.STRING]],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.STRING,
    },
];

const WEAK_MATCHER: Matcher =
[SolutionType.WEAK_NUMERIC, SolutionType.WEAK_PREFIXED_STRING];

export { RULES, WEAK_MATCHER };
