import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, ParserPass, UnaryExpr, VariableExpr } from "../expr";
import { TokenType } from "../token";

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

// only recognizes direct representations of some gates and simplifies them
export class ExpressionSimplificationPass implements ParserPass {
    pass(expr: Expr): Expr {
        return expr.accept(this);
    }

    visitBinaryExpr(expr: BinaryExpr): Expr {
        expr.left = expr.left.accept(this);
        expr.right = expr.right.accept(this);

        //TODO: stuff
        precedence;

        return expr;
    }

    //TODO: determine if a grouping expr is unnecessary
    visitGroupingExpr(expr: GroupingExpr): Expr {
        expr.expression = expr.expression.accept(this);

        if (
            expr.expression instanceof GroupingExpr ||
            expr.expression instanceof VariableExpr ||
            expr.expression instanceof LiteralExpr
        )
            return expr.expression;

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

            // if (expr.right instanceof BinaryExpr )
        }

        return expr;
    }

    visitVariableExpr(expr: VariableExpr): Expr {
        return expr;
    }
}
