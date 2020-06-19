import { doEval, tryEval } from './eval';

enum SolutionType
{
    UNDEFINED               = 0b1,
    NUMERIC                 = 0b10,
    WEAK_NUMERIC            = 0b100,
    OBJECT                  = 0b1000,
    STRING                  = 0b10000,
    PREFIXED_STRING         = 0b100000,
    WEAK_PREFIXED_STRING    = 0b1000000,
}

export const getSolutionType =
(replacement: string): SolutionType | undefined =>
{
    const value = doEval(replacement);
    if (value === undefined || value ===  null)
        return SolutionType.UNDEFINED;
    switch (typeof value as string)
    {
        case 'boolean':
            return SolutionType.NUMERIC;
        case 'number':
            {
                const type =
                isWeak(replacement, value) ? SolutionType.WEAK_NUMERIC : SolutionType.NUMERIC;
                return type;
            }
        case 'object':
        case 'function':
            return SolutionType.OBJECT;
        case 'string':
            {
                const type =
                isPrefixed(replacement, value) ?
                isWeak(replacement, value) ?
                SolutionType.WEAK_PREFIXED_STRING : SolutionType.PREFIXED_STRING :
                SolutionType.STRING;
                return type;
            }
    }
};

const isPrefixed =
(replacement: string, value: unknown): boolean => `0${value}` !== tryEval(`0+${replacement}`);

const isWeak =
(replacement: string, value: unknown): boolean => `${value}` !== tryEval(`""+${replacement}`);

export default SolutionType;
