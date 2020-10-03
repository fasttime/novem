import { findRule }                                             from './rule';
import type { Rule }                                            from './rule';
import { SolutionType }                                         from './solution-type';
import { isArithmetic, isLoose, isString, isUndefined, isWeak } from './type-set';

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

    public get isLoose(): boolean
    {
        return isLoose(this.type);
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
                    const { solutionType } = findRuleBySolutions(solutions);
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
            const { replace, typeSetList } = findRuleBySolutions(solutions);
            const typeSetCount = typeSetList.length;
            const replacements = solutions.slice(0, typeSetCount).map(getReplacement);
            const appendableReplacements =
            solutions.slice(typeSetCount).map(getAppendableReplacement);
            const replacement = [replace(...replacements), ...appendableReplacements].join('');
            return replacement;
        }
    }
}

const findRuleBySolutions = (solutions: readonly Solution[]): Rule => findRule(solutions, getType);

const getAppendableReplacement =
({ replacement, type }: Solution): string => isWeak(type) ? `+(${replacement})` : `+${replacement}`;

const getReplacement = ({ replacement }: Solution): string => replacement;

const getType = ({ type }: Solution): SolutionType => type;
