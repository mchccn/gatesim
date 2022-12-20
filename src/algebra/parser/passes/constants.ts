import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, ParserPass, UnaryExpr, VariableExpr } from "../expr";
import { Token, TokenType } from "../token";

// sole goal is to identify constant expressions and evaluate them beforehand
export class ConstantExpressionEvaluationPass implements ParserPass {
    pass(expr: Expr) {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): Expr {
        expr.left = expr.left.accept(this);
        expr.right = expr.right.accept(this);

        // both sides are constants so we just evaluate them here
        if (expr.left instanceof LiteralExpr && expr.right instanceof LiteralExpr) {
            const lhs = expr.left.value;
            const rhs = expr.right.value;

            switch (expr.operator.type) {
                case TokenType.Or:
                    return new LiteralExpr(lhs || rhs);
                case TokenType.Nor:
                    return new LiteralExpr(!(lhs || rhs));
                case TokenType.And:
                    return new LiteralExpr(lhs && rhs);
                case TokenType.Nand:
                    return new LiteralExpr(!(lhs && rhs));
                case TokenType.Xor:
                    return new LiteralExpr(!!(+lhs ^ +rhs));
                case TokenType.Xnor:
                    return new LiteralExpr(!(+lhs ^ +rhs));
                default:
                    throw new SyntaxError();
            }
        }

        // we want the literal expression to be on the right side
        if (expr.left instanceof LiteralExpr) [expr.left, expr.right] = [expr.right, expr.left];

        // simplify this expression if one side is a constant
        if (expr.right instanceof LiteralExpr) {
            const lhs = expr.left;
            const rhs = expr.right.value;

            switch (expr.operator.type) {
                case TokenType.Or:
                    // 1 or a is always 1
                    // 0 or a is always a
                    return rhs ? new LiteralExpr(true) : lhs;
                case TokenType.Nor:
                    // 1 nor a is always 0
                    // 0 nor a is always not a
                    return rhs
                        ? new LiteralExpr(false)
                        : new UnaryExpr(new Token(TokenType.Not, "not", expr.operator.line, expr.operator.col), lhs);
                case TokenType.And:
                    return rhs ? lhs : new LiteralExpr(false);
                case TokenType.Nand:
                    // 1 nand a is always not a
                    // 0 nand a is always 1
                    return rhs
                        ? new UnaryExpr(new Token(TokenType.Not, "not", expr.operator.line, expr.operator.col), lhs)
                        : new LiteralExpr(true);
                case TokenType.Xor:
                    // 1 xor a is always not a
                    // 0 xor a is always a
                    return rhs
                        ? new UnaryExpr(new Token(TokenType.Not, "not", expr.operator.line, expr.operator.col), lhs)
                        : lhs;
                case TokenType.Xnor:
                    // 1 xnor a is always a
                    // 0 xnor a is always not a
                    return rhs
                        ? lhs
                        : new UnaryExpr(new Token(TokenType.Not, "not", expr.operator.line, expr.operator.col), lhs);
                default:
                    throw new SyntaxError();
            }
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

        if (expr.operator.type === TokenType.Not && expr.right instanceof LiteralExpr)
            return new LiteralExpr(!expr.right.value);

        return expr;
    }

    visitVariableExpr(expr: VariableExpr): Expr {
        return expr;
    }
}
