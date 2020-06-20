import { Matcher, RULES, Rule, WEAK_MATCHER }   from './rule';
import { SolutionType }                         from './solution-type';

export interface Solution
{
    readonly length:        number;
    readonly replacement:   string;
    readonly source:        string;
    readonly type:          SolutionType;
}

export abstract class AbstractSolution implements Solution
{
    public get length(): number
    {
        return this.replacement.length;
    }

    public abstract get replacement():  string;
    public abstract get source():       string;
    public abstract get type():         SolutionType;
}

export const EMPTY_SOLUTION: Solution =
{
    length:         2,
    replacement:    '[]',
    source:         '',
    type:           SolutionType.OBJECT,
};

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

    public get source(): string
    {
        const source = this._solutions.map(({ source }: Solution) => source).join('');
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
        public readonly source:         string,
        public readonly replacement:    string,
        public readonly type:           SolutionType,
    )
    {
        super();
    }
}

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
            const { match, replace } = findRule(solutions);
            const matcherCount = match.length;
            const replacements = solutions.slice(0, matcherCount).map(getReplacement);
            const replacement =
            replace(...replacements) +
            solutions.slice(matcherCount).map
            (
                ({ replacement, type }: Solution): string =>
                testType(WEAK_MATCHER, type) ? `+(${replacement})` : `+${replacement}`,
            )
            .join('');
            return replacement;
        }
    }
}

function findRule(solutions: readonly Solution[]): Rule
{
    let rule: Rule;
    for (rule of RULES)
    {
        if (testMatch(rule.match, solutions))
            break;
    }
    return rule!;
}

const getReplacement = ({ replacement }: Solution): string => replacement;

function testMatch(matchers: readonly Matcher[], solutions: readonly Solution[]): boolean
{
    if (matchers.length > solutions.length)
        return false;
    const test =
    matchers.every
    (
        (matcher: Matcher, index: number) =>
        {
            const solution = solutions[index];
            const test = testType(matcher, solution.type);
            return test;
        },
    );
    return test;
}

const testType = (matcher: Matcher, type: SolutionType): boolean => matcher.indexOf(type) >= 0;
