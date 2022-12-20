import { assertNever } from "../../../circular";
import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, UnaryExpr, VariableExpr } from "../expr";

export function areTreesExactlyEqual(a: Expr, b: Expr): boolean {
    // compare by reference before doing expensive traversal
    if (a === b) return true;

    // not the same type of expression
    if (a.constructor !== b.constructor) return false;

    if (a instanceof BinaryExpr && b instanceof BinaryExpr) {
        if (a.operator.type !== b.operator.type) return false;

        return areTreesExactlyEqual(a.left, b.left) && areTreesExactlyEqual(a.right, b.right);
    }

    if (a instanceof GroupingExpr && b instanceof GroupingExpr) {
        return areTreesExactlyEqual(a.expression, b.expression);
    }

    if (a instanceof LiteralExpr && b instanceof LiteralExpr) {
        return a.value === b.value;
    }

    if (a instanceof UnaryExpr && b instanceof UnaryExpr) {
        if (a.operator.type !== b.operator.type) return false;

        return areTreesExactlyEqual(a.right, b.right);
    }

    if (a instanceof VariableExpr && b instanceof VariableExpr) {
        return a.name.lexeme === b.name.lexeme;
    }

    return assertNever();
}
