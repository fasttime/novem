import { findRule }             from './rule';
import type { SolutionType }    from './solution-type';
import { isWeak }               from './type-set';

export const calculateAppendOverhead =
(solutionTypes: readonly SolutionType[]): number =>
{
    const solutionTypeCount = solutionTypes.length;
    switch (solutionTypeCount)
    {
    case 0:
        return 2;
    case 1:
        return 0;
    default:
        {
            const rule = findRule(solutionTypes, identity);
            let { overhead } = rule;
            for (let index = rule.typeSetList.length; index < solutionTypeCount; ++index)
            {
                const solutionType = solutionTypes[index];
                overhead += isWeak(solutionType) ? 3 : 1;
            }
            return overhead;
        }
    }
};

const identity = <Type>(arg: Type): Type => arg;
