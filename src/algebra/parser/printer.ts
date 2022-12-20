import type { BinaryExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, UnaryExpr, VariableExpr } from "./expr";

export class ExpressionPrinter implements ExprVisitor<string> {
    print(expr: Expr) {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): string {
        return `${expr.left.accept(this)} ${expr.operator.lexeme} ${expr.right.accept(this)}`;
    }

    visitGroupingExpr(expr: GroupingExpr): string {
        return `(${expr.expression.accept(this)})`;
    }

    visitLiteralExpr(expr: LiteralExpr): string {
        return expr.value.toString();
    }

    visitUnaryExpr(expr: UnaryExpr): string {
        return `${expr.operator.lexeme} ${expr.right.accept(this)}`;
    }

    visitVariableExpr(expr: VariableExpr): string {
        return expr.name.lexeme;
    }
}
