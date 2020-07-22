import { RULES, Rule }                                                          from './rule';
import { SolutionType }
from './solution-type';
import { TypeSet, includesType, isArithmetic, isString, isUndefined, isWeak }   from './type-set';

export interface Solution
{
    readonly isArithmetic:  boolean;
    readonly isString:      boolean;
    readonly isUndefined:   boolean;
    readonly isWeak:        boolean;
    readonly length:        number;
    readonly replacement:   string;
    readonly source:        string | undefined;
    readonly type:          SolutionType;
}

abstract class AbstractSolution implements Solution
{
    public get isArithmetic(): boolean
    {
        return isArithmetic(this.type);
    }

    public get isString(): boolean
    {
        return isString(this.type);
    }

    public get isUndefined(): boolean
    {
        return isUndefined(this.type);
    }

    public get isWeak(): boolean
    {
        return isWeak(this.type);
    }

    public get length(): number
    {
        return this.replacement.length;
    }

    public abstract get replacement():  string;
    public abstract get source():       string | undefined;
    public abstract get type():         SolutionType;
}

export class DynamicSolution extends AbstractSolution
{
    private _replacement?:          string;
    private readonly _solutions:    Solution[] = [];

    public constructor()
    {
        super();
    }

    public append(solution: Solution): void
    {
        this._replacement = undefined;
        this._solutions.push(solution);
    }

    public prepend(solution: Solution): void
    {
        this._replacement = undefined;
        this._solutions.unshift(solution);
    }

    public get replacement(): string
    {
        const replacement =
        this._replacement ?? (this._replacement = calculateReplacement(this._solutions));
        return replacement;
    }

    public get source(): string | undefined
    {
        const sources = [];
        for (const { source } of this._solutions)
        {
            if (source === undefined)
                return undefined;
            sources.push(source);
        }
        const source = sources.join('');
        return source;
    }

    public get type(): SolutionType
    {
        const solutions = this._solutions;
        switch (solutions.length)
        {
            case 0:
                return EMPTY_SOLUTION.type;
            case 1:
                return solutions[0].type;
            default:
                {
                    const { solutionType } = findRule(solutions);
                    return solutionType;
                }
        }
    }
}

export class SimpleSolution extends AbstractSolution
{
    public constructor
    (
        public readonly source:         string | undefined,
        public readonly replacement:    string,
        public readonly type:           SolutionType,
    )
    {
        super();
    }
}

export const EMPTY_SOLUTION: Solution = new SimpleSolution('', '[]', SolutionType.OBJECT);

function calculateReplacement(solutions: readonly Solution[]): string
{
    switch (solutions.length)
    {
        case 0:
            return EMPTY_SOLUTION.replacement;
        case 1:
            return solutions[0].replacement;
        default:
        {
            const { typeSet, replace } = findRule(solutions);
            const typeSetCount = typeSet.length;
            const replacements = solutions.slice(0, typeSetCount).map(getReplacement);
            const replacement =
            replace(...replacements) +
            solutions.slice(typeSetCount).map
            (
                ({ replacement, type }: Solution): string =>
                isWeak(type) ? `+(${replacement})` : `+${replacement}`,
            )
            .join('');
            return replacement;
        }
    }
}

function findRule(solutions: readonly Solution[]): Rule
{
    const rule = RULES.find(({ typeSet }: Rule): boolean => includesTypeSet(typeSet, solutions))!;
    return rule;
}

const getReplacement = ({ replacement }: Solution): string => replacement;

function includesTypeSet(typeSets: readonly TypeSet[], solutions: readonly Solution[]): boolean
{
    if (typeSets.length > solutions.length)
        return false;
    const test =
    typeSets.every
    (
        (typeSet: TypeSet, index: number) =>
        {
            const solution = solutions[index];
            const test = includesType(typeSet, solution.type);
            return test;
        },
    );
    return test;
}
