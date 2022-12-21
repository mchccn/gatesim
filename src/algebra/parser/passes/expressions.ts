import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, TreePass, UnaryExpr, VariableExpr } from "../expr";
import { Scanner } from "../scanner";
import { Token, TokenType } from "../token";

enum Precedence {
    Not,
    XorXnor,
    AndNand,
    OrNor,
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

        //TODO: determine if a grouping expr is unnecessary
        //TODO: stuff
        precedence;

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

            // converting negation of negated gates into normal gates
            if (expr.right instanceof GroupingExpr) {
                if (expr.right.expression instanceof BinaryExpr) {
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
                }
            }
        }

        return expr;
    }

    visitVariableExpr(expr: VariableExpr): Expr {
        return expr;
    }
}
