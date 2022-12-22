import type { BinaryExpr, Expr, ExprHeuristic, GroupingExpr, UnaryExpr } from "../expr";
import { TokenType } from "../token";

export class DeepestNestingHeuristic implements ExprHeuristic<number> {
    #depth = -1;
    #depths = new Array<number>();

    score(expr: Expr): number {
        this.#depth = 0;
        this.#depths = [];

        expr.accept(this);

        try {
            return Math.max(...this.#depths);
        } finally {
            this.#depth = -1;
            this.#depths = [];
        }
    }

    compare(a: number, b: number): number {
        return b - a;
    }

    visitBinaryExpr(expr: BinaryExpr): number {
        if (
            [TokenType.Or, TokenType.Nor, TokenType.And, TokenType.Nand, TokenType.Xor, TokenType.Xnor].includes(
                expr.operator.type,
            )
        ) {
            this.#depths.push(++this.#depth);

            expr.left.accept(this);
            expr.right.accept(this);

            this.#depth--;

            return 0;
        }

        return 0;
    }

    visitGroupingExpr(expr: GroupingExpr): number {
        this.#depths.push(++this.#depth);

        expr.expression.accept(this);

        this.#depth--;

        return 0;
    }

    visitLiteralExpr(): number {
        return 0;
    }

    visitUnaryExpr(expr: UnaryExpr): number {
        if (expr.operator.type === TokenType.Not) {
            this.#depths.push(++this.#depth);

            expr.right.accept(this);

            this.#depth--;

            return 0;
        }

        return 0;
    }

    visitVariableExpr(): number {
        return 0;
    }
}
