export const INVALID_EXPR = { };

export function doEval(expr: string): unknown
{
    const value = tryEval(expr);
    if (value === INVALID_EXPR)
        throw SyntaxError(`Invalid expression ${expr}`);
    return value;
}

export function tryEval(expr: string): unknown
{
    let fn: Function;
    try
    {
        fn = Function(`return(${expr});`);
    }
    catch
    {
        return INVALID_EXPR;
    }
    const value = fn() as unknown;
    return value;
}
