import { BinaryExpr, Expr, ExprWalker, GroupingExpr, LiteralExpr, UnaryExpr, VariableExpr } from "../parser/expr";
import { compareExprLexographically, printExpr } from "../parser/printer";
import { Token, TokenType } from "../parser/token";
import { areTreesExactlyEqual } from "../parser/trees/equal";
import type { Step } from "./steps";

// picks out adjacent expressions of the same type
// a and b and c -> [a, b, c]
export function getAdjacentBinaryExprs(expr: BinaryExpr) {
    const adjacent: Expr[] = [];
    const queue = [expr.left, expr.right];

    while (queue.length) {
        const o = queue.pop()!;

        if (o instanceof BinaryExpr && o.operator.type === expr.operator.type) {
            queue.push(o.left, o.right);
        } else {
            adjacent.unshift(o);
        }
    }

    return adjacent;
}

// joins expressions with a specific operator
// [a, b, c], and -> a and b and c
export function joinAdjacentExprs(exprs: Expr[], type: TokenType) {
    if (exprs.length < 2) return exprs[0];

    exprs = [...exprs];

    let expr = new BinaryExpr(exprs.pop()!, Token.spoofed(type), exprs.pop()!);

    while (exprs.length) expr = new BinaryExpr(expr, Token.spoofed(type), exprs.pop()!);

    return expr;
}

// generates all combinations from an array
export function combinations<T>(arr: T[]): T[][];
export function combinations<T>(arr: T[]) {
    return (function rec(active: T[], rest: T[], a: T[][]) {
        if (!active.length && !rest.length) return;

        if (!rest.length) return a.push(active);

        rec([...active, rest[0]], rest.slice(1), a);

        rec(active, rest.slice(1), a);

        return a;
    })([], arr, []);
}

// tries to create factoring steps
// ab + ac -> a(b + c)
export function factoringSteps(step: Step): Step[] {
    return new (class FactoringStepsWalker implements ExprWalker<Step[]> {
        #steps: Step[] = [];
        #stack: Expr[] = [];

        walk(expr: Expr): Step[] {
            expr.accept(this);

            return this.#steps;
        }

        visitBinaryExpr(expr: BinaryExpr): void {
            this.#stack.push(expr);

            expr.left.accept(this);
            expr.right.accept(this);

            if (expr.operator.type === TokenType.Or) {
                const terms = getAdjacentBinaryExprs(expr);

                if (terms.length > 2) {
                    const productTerms: Expr[][] = [];

                    terms.forEach((term) => {
                        if (term instanceof BinaryExpr && term.operator.type === TokenType.And) {
                            const factors = getAdjacentBinaryExprs(term);

                            productTerms.push(factors);
                        }

                        if (term instanceof VariableExpr || term instanceof GroupingExpr) {
                            productTerms.push([term]);
                        }
                    });

                    // get all factors that are shared between the terms
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

                    // TODO: NEED TO LIST COMBINATIONS OF COMMON FACTORS
                    // CURRENTLY IT CANNOT SEE "bc" AS A COMMON FACTOR
                    // IT CAN ONLY FACTOR OUT SINGLE VARIABLES LIKE "a" OR "b"

                    commonFactors.forEach((factor) => {
                        const possiblyAffected = productTerms.filter((term) =>
                            term.some((x) => areTreesExactlyEqual(x, factor)),
                        );

                        // get all combinations of the possible affected terms
                        // so we aren't being greedy with factoring
                        combinations(possiblyAffected).forEach((affected) => {
                            const unaffected = productTerms.filter((term) => {
                                const b = [...term].sort(compareExprLexographically);

                                return !affected.some((a) =>
                                    [...a]
                                        .sort(compareExprLexographically)
                                        .every((expr, index) =>
                                            index in b ? areTreesExactlyEqual(expr, b[index]) : false,
                                        ),
                                );
                            });

                            // join the affected terms into a product, leaving out the factored part
                            // if the result is undefined then that means the whole term is the factor and we replace it with true
                            const factored = affected.map(
                                (term) =>
                                    joinAdjacentExprs(
                                        term.filter((x) => !areTreesExactlyEqual(x, factor)),
                                        TokenType.And,
                                    ) ?? new LiteralExpr(true),
                            );

                            // join back unaffected terms into a product
                            const unfactored = unaffected.map((term) => joinAdjacentExprs(term, TokenType.And));

                            const builtFactoredExpr = joinAdjacentExprs(
                                [
                                    new BinaryExpr(
                                        factor,
                                        Token.spoofed(TokenType.And),
                                        joinAdjacentExprs(factored, TokenType.Or),
                                    ),
                                    ...unfactored,
                                ],
                                TokenType.Or,
                            ) as BinaryExpr;

                            // keep track of original expression
                            const original = expr.clone();

                            // mutate this one into the factored version
                            expr.left = builtFactoredExpr.left;
                            expr.operator = builtFactoredExpr.operator;
                            expr.right = builtFactoredExpr.right;

                            // add to possible steps
                            this.#steps.push({
                                description: "factor out " + printExpr(factor),
                                expr: this.#stack[0].clone(),
                                from: step,
                            });

                            // reset to original
                            expr.left = original.left;
                            expr.operator = original.operator;
                            expr.right = original.right;
                        });
                    });
                }
            }

            this.#stack.pop();
        }

        visitGroupingExpr(expr: GroupingExpr): void {
            this.#stack.push(expr);

            expr.expression.accept(this);

            this.#stack.pop();
        }

        visitLiteralExpr(): void {}

        visitUnaryExpr(expr: UnaryExpr): void {
            this.#stack.push(expr);

            expr.right.accept(this);

            this.#stack.pop();
        }

        visitVariableExpr(): void {}
    })().walk(step.expr);
}
