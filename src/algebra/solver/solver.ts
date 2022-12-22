import type { Expr, ExprHeuristic } from "../parser/expr";
import { ConstantExpressionEvaluationPass as ConstExprEvalPass } from "../parser/passes/constants";
import { ExpressionSimplificationPass as ExprSimpPass } from "../parser/passes/expressions";
import { ExpressionNormalizingPass as ExprNormPass } from "../parser/passes/normalizer";
import { pipeline } from "../parser/passes/pipeline";
import { printExpr } from "../parser/printer";
import { areTreesExactlyEqual } from "../parser/trees/equal";
import { factoringSteps } from "./factoring";
import { negationExtractionSteps } from "./negations";
import type { Step } from "./steps";

export const singlePass = pipeline(ExprNormPass, ConstExprEvalPass, ExprSimpPass);

export const applyPasses = (expr: Expr) => {
    let passed = singlePass(expr);

    // simplify until the passes do not change anything
    while (!areTreesExactlyEqual(expr, passed)) [expr, passed] = [passed, singlePass(expr)];

    // at least one pass should be executed
    expr = singlePass(expr);

    return expr;
};

export function simplifyExpr<T>(expr: Expr, heuristic: ExprHeuristic<T>) {
    const visited = new Map<string, T>([[printExpr(expr), heuristic.score(expr)]]);

    const intitialStep: Step = { description: "initial expression", expr };

    const getSteps = (step: Step) => [
        ...factoringSteps(step),
        ...negationExtractionSteps(step),
        {
            description: "simplify and reduce",
            expr: step.expr,
            from: step,
        },
    ];
}
