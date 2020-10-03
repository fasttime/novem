import { SolutionType }                 from './solution-type';
import { createTypeSet, includesType }  from './type-set';
import type { TypeSet }                 from './type-set';

export interface Rule
{
    readonly typeSetList:   readonly TypeSet[];
    readonly overhead:      number;
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
        overhead: 6,
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
        overhead: 6,
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
        overhead: 4,
        replace: (r1: string, r2: string, r3: string): string => `${r1}+(${r2}+${r3})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.UNDEFINED),
        ],
        overhead: 4,
        replace: (r1: string, r2: string): string => `[]+${r1}+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.NUMERIC, SolutionType.WEAK_NUMERIC),
        ],
        overhead: 3,
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.UNDEFINED),
            createTypeSet(SolutionType.PREFIXED_STRING),
        ],
        overhead: 3,
        replace: (r1: string, r2: string): string => `${r1}+(${r2})`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList: [createTypeSet(SolutionType.UNDEFINED)],
        overhead: 0,
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
        overhead: 3,
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.NUMERIC),
            createTypeSet(SolutionType.WEAK_NUMERIC),
        ],
        overhead: 3,
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.PREFIXED_STRING,
    },
    {
        typeSetList: [createTypeSet(SolutionType.NUMERIC, SolutionType.PREFIXED_STRING)],
        overhead: 0,
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
        overhead: 3,
        replace: (r1: string, r2: string): string => `[${r1}]+${r2}`,
        solutionType: SolutionType.COMBINED_STRING,
    },
    {
        typeSetList:
        [
            createTypeSet(SolutionType.WEAK_NUMERIC),
            createTypeSet(SolutionType.WEAK_NUMERIC),
        ],
        overhead: 3,
        replace: (r1: string, r2: string): string => `${r1}+[${r2}]`,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },
    {
        typeSetList: [createTypeSet(SolutionType.WEAK_NUMERIC, SolutionType.WEAK_PREFIXED_STRING)],
        overhead: 0,
        replace: (r1: string): string => r1,
        solutionType: SolutionType.WEAK_PREFIXED_STRING,
    },

    // OBJECT, STRING, COMBINED_STRING
    {
        typeSetList:
        [createTypeSet(SolutionType.OBJECT, SolutionType.STRING, SolutionType.COMBINED_STRING)],
        overhead: 0,
        replace: (r1: string): string => r1,
        solutionType: SolutionType.COMBINED_STRING,
    },
];

export function findRule<ElementType>
(
    elements: readonly ElementType[],
    mapElementToSolutionType: (element: ElementType) => SolutionType,
):
Rule
{
    let returnValue: Rule;
    for (const rule of RULES)
    {
        if (matchSolutions(rule.typeSetList, elements, mapElementToSolutionType))
        {
            returnValue = rule;
            break;
        }
    }
    return returnValue!;
}

function matchSolutions<ElementType>
(
    typeSets: readonly TypeSet[],
    elements: readonly ElementType[],
    mapElementToSolutionType: (element: ElementType) => SolutionType,
):
boolean
{
    if (typeSets.length > elements.length)
        return false;
    const test =
    typeSets.every
    (
        (typeSet: TypeSet, index: number) =>
        {
            const element = elements[index];
            const solutionType = mapElementToSolutionType(element);
            const test = includesType(typeSet, solutionType);
            return test;
        },
    );
    return test;
}
