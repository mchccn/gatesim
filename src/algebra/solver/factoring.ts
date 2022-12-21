import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, UnaryExpr, VariableExpr } from "../parser/expr";
import { printExpr } from "../parser/printer";
import { Token, TokenType } from "../parser/token";
import { areTreesExactlyEqual } from "../parser/trees/equal";
import type { Step } from "./steps";

export function getAdjacentBinaryExprs(expr: BinaryExpr) {
    const adjacent: Expr[] = [];
    const queue = [expr.left, expr.right];

    while (queue.length) {
        const o = queue.pop()!;

        if (o instanceof BinaryExpr && o.operator.type === expr.operator.type) {
            queue.push(o.left, o.right);
        } else {
            adjacent.push(o);
        }
    }

    return adjacent;
}

export function joinAdjacentExprs(exprs: Expr[], type: TokenType) {
    if (exprs.length < 2) return exprs[0];

    exprs = [...exprs];

    let expr = new BinaryExpr(exprs.pop()!, Token.spoofed(type), exprs.pop()!);

    while (exprs.length) expr = new BinaryExpr(expr, Token.spoofed(type), exprs.pop()!);

    return expr;
}

// tries to create factoring steps
// ab + ac -> a(b + c)
export function factoringSteps(step: Step, steps: Step[] = []): Step[] {
    const { expr } = step;

    if (expr instanceof BinaryExpr) {
        if (expr.operator.type === TokenType.Or) {
            const terms = getAdjacentBinaryExprs(expr);

            const productTerms: Expr[][] = [];

            terms.forEach((term) => {
                if (term instanceof BinaryExpr && term.operator.type === TokenType.And) {
                    const factors = getAdjacentBinaryExprs(term);

                    productTerms.push(factors);
                }
            });

            const allCommonFactors = productTerms.flatMap((a, i) => {
                return productTerms.flatMap((b, j) => {
                    if (i === j) return [];

                    return [
                        ...a.filter((x) => b.some((y) => areTreesExactlyEqual(x, y))),
                        ...b.filter((x) => a.some((y) => areTreesExactlyEqual(x, y))),
                    ];
                });
            });

            // filter out duplicate common factors
            const commonFactors = allCommonFactors.filter(
                (x, i) => allCommonFactors.findIndex((y) => areTreesExactlyEqual(x, y)) === i,
            );

            commonFactors.forEach((factor) => {
                const affected = productTerms.filter((term) => term.some((x) => areTreesExactlyEqual(x, factor)));
                const unaffected = productTerms.filter((term) => term.every((x) => !areTreesExactlyEqual(x, factor)));

                // join the affected terms into a product, leaving out the factored part
                const factored = affected.map((term) =>
                    joinAdjacentExprs(
                        term.filter((x) => !areTreesExactlyEqual(x, factor)),
                        TokenType.And,
                    ),
                );

                // join back unaffected terms into a product
                const unfactored = unaffected.map((term) => joinAdjacentExprs(term, TokenType.And));

                const builtFactoredExpr = joinAdjacentExprs(
                    [
                        new BinaryExpr(factor, Token.spoofed(TokenType.And), joinAdjacentExprs(factored, TokenType.Or)),
                        ...unfactored,
                    ],
                    TokenType.Or,
                );

                // add to possible steps
                steps.push({
                    description: "factor out " + printExpr(factor),
                    expr: builtFactoredExpr,
                    from: step,
                });
            });

            steps.push(...terms.flatMap((term) => factoringSteps({ ...step, expr: term })));
        } else {
            steps.push(
                ...factoringSteps({ ...step, expr: expr.left }),
                ...factoringSteps({ ...step, expr: expr.right }),
            );
        }
    }

    if (expr instanceof GroupingExpr) {
        steps.push(...factoringSteps({ ...step, expr: expr.expression }));
    }

    if (expr instanceof LiteralExpr) {
    }

    if (expr instanceof UnaryExpr) {
        steps.push(...factoringSteps({ ...step, expr: expr.right }));
    }

    if (expr instanceof VariableExpr) {
    }

    return steps;
}
