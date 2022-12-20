import type { Token } from "./token";

export interface ParserPass extends ExprVisitor<Expr> {
    pass(expr: Expr): Expr;
}

export interface ExprVisitor<R> {
    visitBinaryExpr(expr: BinaryExpr): R;
    visitGroupingExpr(expr: GroupingExpr): R;
    visitLiteralExpr(expr: LiteralExpr): R;
    visitUnaryExpr(expr: UnaryExpr): R;
    visitVariableExpr(expr: VariableExpr): R;
}

export abstract class Expr {
    abstract accept<R>(visitor: ExprVisitor<R>): R;
}

export class BinaryExpr extends Expr {
    left;
    operator;
    right;

    constructor(left: Expr, operator: Token, right: Expr) {
        super();

        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }
}

export class GroupingExpr extends Expr {
    expression;

    constructor(expression: Expr) {
        super();

        this.expression = expression;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }
}

export class LiteralExpr extends Expr {
    value;

    constructor(value: boolean) {
        super();

        this.value = value;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}

export class UnaryExpr extends Expr {
    operator;
    right;

    constructor(operator: Token, right: Expr) {
        super();

        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }
}

export class VariableExpr extends Expr {
    name;

    constructor(name: Token) {
        super();

        this.name = name;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }
}
