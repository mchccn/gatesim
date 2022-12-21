import type { Expr } from "../parser/expr";

export interface Step {
    description: string;
    expr: Expr;
    from?: Step;
}
