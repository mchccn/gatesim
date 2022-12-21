import { Expr, GroupingExpr, TreePass } from "../expr";

export function pipeline(...passes: { new (): TreePass }[]) {
    return (expr: Expr) => {
        let result = passes.reduce((expr, Pass) => new Pass().pass(expr), expr);

        // remove root level parentheses
        while (result instanceof GroupingExpr) result = result.expression;

        return result;
    };
}
