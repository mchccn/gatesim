import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, TreePass, UnaryExpr, VariableExpr } from "../expr";
import { TokenType } from "../token";

// sort and re-order nodes to a standard so that later passes
// will have an easier time working with nested structures
export class ExpressionNormalizingPass implements TreePass {
    pass(expr: Expr): Expr {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): Expr {
        expr.left = expr.left.accept(this);
        expr.right = expr.right.accept(this);

        //

        return expr;
    }

    visitGroupingExpr(expr: GroupingExpr): Expr {
        expr.expression = expr.expression.accept(this);

        if (
            expr.expression instanceof GroupingExpr ||
            expr.expression instanceof VariableExpr ||
            expr.expression instanceof LiteralExpr ||
            // only applies to negation since it has high precedence
            (expr.expression instanceof UnaryExpr && expr.expression.operator.type === TokenType.Not)
        )
            return expr.expression;

        return expr;
    }

    visitLiteralExpr(expr: LiteralExpr): Expr {
        return expr;
    }

    visitUnaryExpr(expr: UnaryExpr): Expr {
        expr.right = expr.right.accept(this);

        return expr;
    }

    visitVariableExpr(expr: VariableExpr): Expr {
        return expr;
    }
}
