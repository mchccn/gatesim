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

export function simplifyExpr<T>(expr: Expr, heuristic: ExprHeuristic<T>, depth = 10) {
    const visited = new Map<string, T>([[printExpr(expr, { explicitGrouping: true }), heuristic.score(expr)]]);

    const intitialStep: Step = { description: "initial expression", expr };

    const stepsFor = new Map<string, Step[]>([[printExpr(expr, { explicitGrouping: true }), [intitialStep]]]);

    const getSteps = (step: Step) => [...factoringSteps(step), ...negationExtractionSteps(step)];

    function performSteps(steps: Step[], path: Step[], depth: number) {
        if (depth <= 0) return;

        steps.forEach((step) => {
            // always simplify and reduce after every step
            const beforeSimplification = { ...step };

            step.expr = applyPasses(step.expr.clone());

            // insert a simplify and reduce step in between the generated steps
            const afterSimplification: Step = {
                description: "simplify and reduce",
                expr: step.expr,
                from: beforeSimplification,
            };

            const serialized = printExpr(step.expr, { explicitGrouping: true });

            // try not to overwrite the data if it already exists
            if (visited.has(serialized)) return;

            visited.set(serialized, heuristic.score(step.expr));

            // add before and after to the path
            const newPath = path.concat(beforeSimplification, afterSimplification);

            stepsFor.set(serialized, newPath);

            performSteps(getSteps(step), newPath, depth - 1);
        });
    }

    performSteps(getSteps(intitialStep), [intitialStep], depth);

    // get the best one according to the given heuristic
    const best = Array.from(visited).sort(([, a], [, b]) => heuristic.compare(a, b))[0][0];

    const stepsToBest = stepsFor.get(best)!;

    // removing the previous step from each step object
    // since it's unnecessary in an array
    stepsToBest.forEach((step) => delete step.from);

    return stepsToBest;
}
