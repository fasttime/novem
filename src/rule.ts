import { SolutionType } from './solution-type';

export type Matcher = number;

export interface Rule
{
    readonly match: readonly Matcher[];
    readonly replace: (...replacements: string[]) => string;
    readonly solutionType: SolutionType;
}

export const RULES: readonly Rule[] =
[
    // UNDEFINED
    {
        match:
        [
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+[${r3}])`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match:
        [
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.WEAK_PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+(${r3}))`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match:
        [
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.OBJECT, SolutionType.STRING),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+${r3})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match:
        [
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.UNDEFINED),
        ],
        replace: (r1: string, r2: string): string => `[]+${r1}+${r2}`,
        solutionType: SolutionType.STRING,
    },
    {
        match:
        [
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.NUMERIC, SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match:
        [
            createMatcher(SolutionType.UNDEFINED),
            createMatcher(SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `${r1}+(${r2})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match: [createMatcher(SolutionType.UNDEFINED)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.PREFIXED_STRING,
    },

    // NUMERIC, PREFIXED_STRING
    {
        match:
        [
            createMatcher(SolutionType.NUMERIC),
            createMatcher
            (SolutionType.UNDEFINED, SolutionType.NUMERIC, SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.STRING,
    },
    {
        match:
        [
            createMatcher(SolutionType.NUMERIC),
            createMatcher(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        match: [createMatcher(SolutionType.NUMERIC, SolutionType.PREFIXED_STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.PREFIXED_STRING,
    },

    // WEAK_NUMERIC, WEAK_PREFIXED_STRING
    {
        match:
        [
            createMatcher(SolutionType.WEAK_NUMERIC),
            createMatcher
            (SolutionType.UNDEFINED, SolutionType.NUMERIC, SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.STRING,
    },
    {
        match:
        [
            createMatcher(SolutionType.WEAK_NUMERIC),
            createMatcher(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },
    {
        match: [createMatcher(SolutionType.WEAK_NUMERIC, SolutionType.WEAK_PREFIXED_STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },

    // OBJECT, STRING
    {
        match: [createMatcher(SolutionType.OBJECT, SolutionType.STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.STRING,
    },
];

export const WEAK_MATCHER: Matcher =
createMatcher(SolutionType.WEAK_NUMERIC, SolutionType.WEAK_PREFIXED_STRING);

function createMatcher(...types: SolutionType[]): Matcher
{
    let matcher: Matcher = 0;
    for (const type of types)
        matcher |= type;
    return matcher;
}

export const testType = (matcher: Matcher, type: SolutionType): boolean => (matcher & type) !== 0;
