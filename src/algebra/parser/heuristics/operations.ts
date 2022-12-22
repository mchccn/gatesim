import type { BinaryExpr, Expr, ExprHeuristic, GroupingExpr, UnaryExpr } from "../expr";
import { TokenType } from "../token";

export class TotalOperationsHeuristic implements ExprHeuristic<number> {
    score(expr: Expr): number {
        return expr.accept(this);
    }

    compare(a: number, b: number): number {
        return a - b;
    }

    visitBinaryExpr(expr: BinaryExpr): number {
        if (
            [TokenType.Or, TokenType.Nor, TokenType.And, TokenType.Nand, TokenType.Xor, TokenType.Xnor].includes(
                expr.operator.type,
            )
        )
            return 1 + expr.left.accept(this) + expr.right.accept(this);

        return 0;
    }

    visitGroupingExpr(expr: GroupingExpr): number {
        return expr.expression.accept(this);
    }

    visitLiteralExpr(): number {
        return 0;
    }

    visitUnaryExpr(expr: UnaryExpr): number {
        if (expr.operator.type === TokenType.Not) return 1 + expr.right.accept(this);

        return 0;
    }

    visitVariableExpr(): number {
        return 0;
    }
}
