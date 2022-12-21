import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, TreePass, UnaryExpr, VariableExpr } from "../expr";
import { Scanner } from "../scanner";
import { Token, TokenType } from "../token";
import { areTreesExactlyEqual } from "../trees/equal";
import { ExpressionNormalizingPass } from "./normalizer";

enum Precedence {
    OrNor,
    AndNand,
    XorXnor,
    Not,
}

const precedence: ReadonlyMap<TokenType, Precedence> = new Map([
    [TokenType.Not, Precedence.Not],
    [TokenType.Xor, Precedence.XorXnor],
    [TokenType.Xnor, Precedence.XorXnor],
    [TokenType.And, Precedence.AndNand],
    [TokenType.Nand, Precedence.AndNand],
    [TokenType.Or, Precedence.OrNor],
    [TokenType.Nor, Precedence.OrNor],
]);

const inverseGateLookup: ReadonlyMap<TokenType, TokenType> = new Map(
    [
        [TokenType.Xor, TokenType.Xnor],
        [TokenType.And, TokenType.Nand],
        [TokenType.Or, TokenType.Nor],
    ].flatMap(([k, v]) => [
        [k, v],
        [v, k],
    ]),
);

// only recognizes direct representations of some gates and simplifies them
export class ExpressionSimplificationPass implements TreePass {
    pass(expr: Expr): Expr {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): Expr {
        expr.left = expr.left.accept(this);
        expr.right = expr.right.accept(this);

        if (expr.operator.type === TokenType.Or) {
            // a or not a -> 1
            if (expr.right instanceof UnaryExpr && expr.right.operator.type === TokenType.Not) {
                if (
                    areTreesExactlyEqual(
                        new ExpressionNormalizingPass().pass(expr.left),
                        new ExpressionNormalizingPass().pass(expr.right.right),
                    )
                ) {
                    return new LiteralExpr(true);
                }
            }

            // ((a and not b) or (b and not a)) -> a xor b
            if (
                expr.left instanceof GroupingExpr &&
                expr.left.expression instanceof BinaryExpr &&
                expr.left.expression.operator.type === TokenType.And &&
                expr.left.expression.right instanceof UnaryExpr &&
                expr.left.expression.right.operator.type === TokenType.Not &&
                expr.right instanceof GroupingExpr &&
                expr.right.expression instanceof BinaryExpr &&
                expr.right.expression.operator.type === TokenType.And &&
                expr.right.expression.right instanceof UnaryExpr &&
                expr.right.expression.right.operator.type === TokenType.Not
            ) {
                const a = expr.left.expression.left;
                const b = expr.right.expression.left;

                if (
                    areTreesExactlyEqual(
                        new ExpressionNormalizingPass().pass(a),
                        new ExpressionNormalizingPass().pass(expr.right.expression.right.right),
                    ) &&
                    areTreesExactlyEqual(
                        new ExpressionNormalizingPass().pass(b),
                        new ExpressionNormalizingPass().pass(expr.left.expression.right.right),
                    )
                ) {
                    return new GroupingExpr(
                        new BinaryExpr(
                            a,
                            new Token(
                                TokenType.Xor,
                                Scanner.lexemeForKeyword.get(TokenType.Xor)!,
                                expr.operator.line,
                                expr.operator.col,
                            ),
                            b,
                        ),
                    );
                }
            }

            // ((a and b) or (not a and not b)) -> a xnor b
            if (
                expr.left instanceof GroupingExpr &&
                expr.left.expression instanceof BinaryExpr &&
                expr.left.expression.operator.type === TokenType.And &&
                expr.right instanceof GroupingExpr &&
                expr.right.expression instanceof BinaryExpr &&
                expr.right.expression.operator.type === TokenType.And &&
                expr.right.expression.left instanceof UnaryExpr &&
                expr.right.expression.left.operator.type === TokenType.Not &&
                expr.right.expression.right instanceof UnaryExpr &&
                expr.right.expression.right.operator.type === TokenType.Not
            ) {
                const a = expr.left.expression.left;
                const b = expr.left.expression.right;

                if (
                    areTreesExactlyEqual(
                        new ExpressionNormalizingPass().pass(a),
                        new ExpressionNormalizingPass().pass(expr.right.expression.left.right),
                    ) &&
                    areTreesExactlyEqual(
                        new ExpressionNormalizingPass().pass(b),
                        new ExpressionNormalizingPass().pass(expr.right.expression.right.right),
                    )
                ) {
                    return new GroupingExpr(
                        new BinaryExpr(
                            a,
                            new Token(
                                TokenType.Xnor,
                                Scanner.lexemeForKeyword.get(TokenType.Xnor)!,
                                expr.operator.line,
                                expr.operator.col,
                            ),
                            b,
                        ),
                    );
                }
            }

            // not a or not b -> a nand b
            if (
                expr.left instanceof UnaryExpr &&
                expr.left.operator.type === TokenType.Not &&
                expr.right instanceof UnaryExpr &&
                expr.right.operator.type === TokenType.Not
            ) {
                return new GroupingExpr(
                    new BinaryExpr(
                        expr.left.right,
                        new Token(
                            TokenType.Nand,
                            Scanner.lexemeForKeyword.get(TokenType.Nand)!,
                            expr.operator.line,
                            expr.operator.col,
                        ),
                        expr.right.right,
                    ),
                );
            }

            // (a nand b) or not c -> a nand b nand c
            if (
                expr.left instanceof GroupingExpr &&
                expr.left.expression instanceof BinaryExpr &&
                expr.left.expression.operator.type === TokenType.Nand &&
                expr.right instanceof UnaryExpr &&
                expr.right.operator.type === TokenType.Not
            ) {
                return new GroupingExpr(
                    new BinaryExpr(
                        expr.left,
                        new Token(
                            TokenType.Nand,
                            Scanner.lexemeForKeyword.get(TokenType.Nand)!,
                            expr.operator.line,
                            expr.operator.col,
                        ),
                        expr.right.right,
                    ),
                );
            }
        }

        if (expr.operator.type === TokenType.And) {
            // a and not a -> 0
            if (expr.right instanceof UnaryExpr && expr.right.operator.type === TokenType.Not) {
                if (
                    areTreesExactlyEqual(
                        new ExpressionNormalizingPass().pass(expr.left),
                        new ExpressionNormalizingPass().pass(expr.right.right),
                    )
                ) {
                    return new LiteralExpr(false);
                }
            }

            // not a and not b -> a nor b
            if (
                expr.left instanceof UnaryExpr &&
                expr.left.operator.type === TokenType.Not &&
                expr.right instanceof UnaryExpr &&
                expr.right.operator.type === TokenType.Not
            ) {
                return new GroupingExpr(
                    new BinaryExpr(
                        expr.left.right,
                        new Token(
                            TokenType.Nor,
                            Scanner.lexemeForKeyword.get(TokenType.Nor)!,
                            expr.operator.line,
                            expr.operator.col,
                        ),
                        expr.right.right,
                    ),
                );
            }

            // (a nor b) and not c -> a nor b nor c
            if (
                expr.left instanceof GroupingExpr &&
                expr.left.expression instanceof BinaryExpr &&
                expr.left.expression.operator.type === TokenType.Nor &&
                expr.right instanceof UnaryExpr &&
                expr.right.operator.type === TokenType.Not
            ) {
                return new GroupingExpr(
                    new BinaryExpr(
                        expr.left,
                        new Token(
                            TokenType.Nor,
                            Scanner.lexemeForKeyword.get(TokenType.Nor)!,
                            expr.operator.line,
                            expr.operator.col,
                        ),
                        expr.right.right,
                    ),
                );
            }
        }

        // checking if left side has unnecessary nesting
        if (
            expr.left instanceof GroupingExpr &&
            expr.left.expression instanceof BinaryExpr &&
            precedence.get(expr.left.expression.operator.type)! >= precedence.get(expr.operator.type)!
        ) {
            expr.left = expr.left.expression;
        }

        // checking if right side has unnecessary nesting
        if (
            expr.right instanceof GroupingExpr &&
            expr.right.expression instanceof BinaryExpr &&
            precedence.get(expr.right.expression.operator.type)! >= precedence.get(expr.operator.type)!
        ) {
            expr.right = expr.right.expression;
        }

        return expr;
    }

    visitGroupingExpr(expr: GroupingExpr): Expr {
        expr.expression = expr.expression.accept(this);

        return expr;
    }

    visitLiteralExpr(expr: LiteralExpr): Expr {
        return expr;
    }

    visitUnaryExpr(expr: UnaryExpr): Expr {
        expr.right = expr.right.accept(this);

        // reducing unnecessary nested negations
        if (expr.operator.type === TokenType.Not) {
            if (expr.right instanceof UnaryExpr && expr.right.operator.type === TokenType.Not) {
                return expr.right.right;
            }

            if (expr.right instanceof GroupingExpr) {
                if (expr.right.expression instanceof BinaryExpr) {
                    // converting negation of negated gates into normal gates
                    if ([TokenType.Xnor, TokenType.Nand, TokenType.Nor].includes(expr.right.expression.operator.type)) {
                        const normalGate = inverseGateLookup.get(expr.right.expression.operator.type)!;

                        return new GroupingExpr(
                            new BinaryExpr(
                                expr.right.expression.left,
                                new Token(
                                    normalGate,
                                    Scanner.lexemeForKeyword.get(normalGate)!,
                                    expr.right.expression.operator.line,
                                    expr.right.expression.operator.col,
                                ),
                                expr.right.expression.right,
                            ),
                        );
                    }

                    if (expr.right.expression.operator.type === TokenType.Xor) {
                        // not (a xor not b) -> a xor b
                        if (
                            expr.right.expression.right instanceof UnaryExpr &&
                            expr.right.expression.right.operator.type === TokenType.Not
                        ) {
                            return new GroupingExpr(
                                new BinaryExpr(
                                    expr.right.expression.left,
                                    expr.right.expression.operator,
                                    expr.right.expression.right.right,
                                ),
                            );
                        }
                    }
                }
            }
        }

        return expr;
    }

    visitVariableExpr(expr: VariableExpr): Expr {
        return expr;
    }
}
