import { ConstructorClone, ConstructorCloneSymbol } from "./derive/clone";
import { derive } from "./derive/decorator";
import { Token } from "./token";

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

export abstract class Expr implements ConstructorClone {
    abstract accept<R>(visitor: ExprVisitor<R>): R;

    clone(): this {
        return Reflect.construct(
            this.constructor,
            (Reflect.get(this, ConstructorCloneSymbol) as any[]).map((v) =>
                v instanceof Expr || v instanceof Token ? v.clone() : v,
            ),
        );
    }
}

@derive(ConstructorClone)
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

@derive(ConstructorClone)
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

@derive(ConstructorClone)
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

@derive(ConstructorClone)
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

@derive(ConstructorClone)
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
