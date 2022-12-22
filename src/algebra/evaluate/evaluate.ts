import type { BinaryExpr, Expr, GroupingExpr, LiteralExpr, UnaryExpr, VariableExpr } from "../parser/expr";
import { TokenType } from "../parser/token";

export function evaluate(expr: Expr, values: Record<string, unknown>) {
    return new (class EvalExpr {
        eval(expr: Expr): boolean {
            return expr.accept(this);
        }

        visitBinaryExpr(expr: BinaryExpr): boolean {
            const lhs = expr.left.accept(this);
            const rhs = expr.right.accept(this);

            switch (expr.operator.type) {
                case TokenType.Or:
                    return lhs || rhs;
                case TokenType.Nor:
                    return !(lhs || rhs);
                case TokenType.And:
                    return lhs && rhs;
                case TokenType.Nand:
                    return !(lhs && rhs);
                case TokenType.Xor:
                    return !!(+lhs ^ +rhs);
                case TokenType.Xnor:
                    return !(+lhs ^ +rhs);
                default:
                    throw new SyntaxError();
            }
        }

        visitGroupingExpr(expr: GroupingExpr): boolean {
            return expr.expression.accept(this);
        }

        visitLiteralExpr(expr: LiteralExpr): boolean {
            return expr.value;
        }

        visitUnaryExpr(expr: UnaryExpr): boolean {
            if (expr.operator.type === TokenType.Not) return !expr.right.accept(this);

            throw new SyntaxError();
        }

        visitVariableExpr(expr: VariableExpr): boolean {
            if (expr.name.lexeme in values) return !!values[expr.name.lexeme];

            throw new SyntaxError();
        }
    })().eval(expr);
}
