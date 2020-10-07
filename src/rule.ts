import type { Solution }                from './solution';
import { SolutionType }                 from './solution-type';
import { createTypeSet, includesType }  from './type-set';
import type { TypeSet }                 from './type-set';

export interface Rule
{
    readonly typeSetList:   readonly TypeSet[];
    readonly replace:       (...replacements: string[]) => string;
    readonly solutionType:  SolutionType;
}

export const RULES: readonly Rule[] =
[
    // UNDEFINED
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+[${r3}])`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.WEAK_PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+(${r3}))`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.OBJECT, SolutionType.STRING, SolutionType.COMBINED_STRING),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+${r3})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
        ],
        replace: (r1: string, r2: string): string => `[]+${r1}+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.NUMERIC, SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `${r1}+(${r2})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList: [createTypeSet(SolutionType.UNDEFINED)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.PREFIXED_STRING,
    },

    // NUMERIC, PREFIXED_STRING
    {
        typeSetList:
        [
            createTypeSet(SolutionType.NUMERIC),
            createTypeSet
            (SolutionType.UNDEFINED, SolutionType.NUMERIC, SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.NUMERIC),
            createTypeSet(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList: [createTypeSet(SolutionType.NUMERIC, SolutionType.PREFIXED_STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.PREFIXED_STRING,
    },

    // WEAK_NUMERIC, WEAK_PREFIXED_STRING
    {
        typeSetList:
        [
            createTypeSet(SolutionType.WEAK_NUMERIC),
            createTypeSet
            (SolutionType.UNDEFINED, SolutionType.NUMERIC, SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.WEAK_NUMERIC),
            createTypeSet(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },
    {
        typeSetList: [createTypeSet(SolutionType.WEAK_NUMERIC, SolutionType.WEAK_PREFIXED_STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },

    // OBJECT, STRING, COMBINED_STRING
    {
        typeSetList:
        [createTypeSet(SolutionType.OBJECT, SolutionType.STRING, SolutionType.COMBINED_STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.COMBINED_STRING,
    },
];

export function findRule(solutions: readonly Solution[]):
// @ts-expect-error
Rule
{
    for (const rule of RULES)
    {
        if (matchSolutions(rule.typeSetList, solutions))
            return rule;
    }
}

function matchSolutions(typeSets: readonly TypeSet[], solutions: readonly Solution[]): boolean
{
    if (typeSets.length > solutions.length)
        return false;
    const test =
    typeSets.every
    (
        (typeSet: TypeSet, index: number) =>
        {
            const { type } = solutions[index];
            const test = includesType(typeSet, type);
            return test;
        },
    );
    return test;
}
