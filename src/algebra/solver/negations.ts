import type { BinaryExpr, Expr, ExprWalker, GroupingExpr, UnaryExpr } from "../parser/expr";
import { TokenType } from "../parser/token";
import type { Step } from "./steps";

// tries to expand negated gates
// a xnor b -> not (a xor b)
export function negationExtractionSteps(step: Step): Step[] {
    return new (class NegationExtractionWalker implements ExprWalker<Step[]> {
        #steps: Step[] = [];
        #stack: Expr[] = [];

        walk(expr: Expr): Step[] {
            this.#stack.push(expr);

            expr.accept(this);

            this.#stack.pop();

            return this.#steps;
        }

        visitBinaryExpr(expr: BinaryExpr): void {
            this.#stack.push(expr);

            expr.left.accept(this);
            expr.right.accept(this);

            if ([TokenType.Xnor, TokenType.Nand, TokenType.Nor].includes(expr.operator.type)) {
                
            }

            this.#stack.pop();
        }

        visitGroupingExpr(expr: GroupingExpr): void {
            this.#stack.push(expr);

            expr.expression.accept(this);

            this.#stack.pop();
        }

        visitLiteralExpr(): void {}

        visitUnaryExpr(expr: UnaryExpr): void {
            this.#stack.push(expr);

            expr.right.accept(this);

            this.#stack.pop();
        }

        visitVariableExpr(): void {}
    })().walk(step.expr);
}
