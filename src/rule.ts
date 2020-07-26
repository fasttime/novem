import { SolutionType }             from './solution-type';
import { TypeSet, createTypeSet }   from './type-set';

export interface Rule
{
    readonly typeSet: readonly TypeSet[];
    readonly replace: (...replacements: string[]) => string;
    readonly solutionType: SolutionType;
}

export const RULES: readonly Rule[] =
[
    // UNDEFINED
    {
        typeSet:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+[${r3}])`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSet:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.WEAK_PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+(${r3}))`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSet:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.OBJECT, SolutionType.STRING, SolutionType.COMBINED_STRING),
        ],
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+${r3})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSet:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
        ],
        replace: (r1: string, r2: string): string => `[]+${r1}+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSet:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.NUMERIC, SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSet:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `${r1}+(${r2})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSet: [createTypeSet(SolutionType.UNDEFINED)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.PREFIXED_STRING,
    },

    // NUMERIC, PREFIXED_STRING
    {
        typeSet:
        [
            createTypeSet(SolutionType.NUMERIC),
            createTypeSet
            (SolutionType.UNDEFINED, SolutionType.NUMERIC, SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSet:
        [
            createTypeSet(SolutionType.NUMERIC),
            createTypeSet(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSet: [createTypeSet(SolutionType.NUMERIC, SolutionType.PREFIXED_STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.PREFIXED_STRING,
    },

    // WEAK_NUMERIC, WEAK_PREFIXED_STRING
    {
        typeSet:
        [
            createTypeSet(SolutionType.WEAK_NUMERIC),
            createTypeSet
            (SolutionType.UNDEFINED, SolutionType.NUMERIC, SolutionType.PREFIXED_STRING),
        ],
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSet:
        [
            createTypeSet(SolutionType.WEAK_NUMERIC),
            createTypeSet(SolutionType.WEAK_NUMERIC),
        ],
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },
    {
        typeSet: [createTypeSet(SolutionType.WEAK_NUMERIC, SolutionType.WEAK_PREFIXED_STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },

    // OBJECT, STRING, COMBINED_STRING
    {
        typeSet:
        [createTypeSet(SolutionType.OBJECT, SolutionType.STRING, SolutionType.COMBINED_STRING)],
        replace: (r1: string): string => r1,
        solutionType: SolutionType.COMBINED_STRING,
    },
];
