import type { Token } from "./token";

export interface TreePass extends ExprVisitor<Expr> {
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

    abstract clone(): Expr;
}

export class BinaryExpr extends Expr {
    constructor(public left: Expr, public operator: Token, public right: Expr) {
        super();
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }

    clone(): BinaryExpr {
        return new BinaryExpr(this.left.clone(), this.operator.clone(), this.right.clone());
    }
}

export class GroupingExpr extends Expr {
    constructor(public expression: Expr) {
        super();
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }

    clone(): GroupingExpr {
        return new GroupingExpr(this.expression.clone());
    }
}

export class LiteralExpr extends Expr {
    constructor(public value: boolean) {
        super();
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }

    clone(): LiteralExpr {
        return new LiteralExpr(this.value);
    }
}

export class UnaryExpr extends Expr {
    constructor(public operator: Token, public right: Expr) {
        super();
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }

    clone(): UnaryExpr {
        return new UnaryExpr(this.operator.clone(), this.right.clone());
    }
}

export class VariableExpr extends Expr {
    constructor(public name: Token) {
        super();
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }

    clone(): VariableExpr {
        return new VariableExpr(this.name.clone());
    }
}
