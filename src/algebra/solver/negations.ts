import { BinaryExpr, Expr, ExprWalker, GroupingExpr, UnaryExpr } from "../parser/expr";
import { inverseGateLookup } from "../parser/passes/expressions";
import { Token, TokenType } from "../parser/token";
import type { Step } from "./steps";

export function replaceChild(parent: Expr, disowned: Expr, adopted: Expr) {
    if (parent instanceof BinaryExpr) {
        if (parent.left === disowned) {
            const original = parent.left;

            return [
                () => {
                    parent.left = adopted;
                },
                () => {
                    parent.left = original;
                },
            ];
        }

        if (parent.right === disowned) {
            const original = parent.right;

            return [
                () => {
                    parent.right = adopted;
                },
                () => {
                    parent.right = original;
                },
            ];
        }
    }

    if (parent instanceof GroupingExpr) {
        const original = parent.expression;

        return [
            () => {
                parent.expression = adopted;
            },
            () => {
                parent.expression = original;
            },
        ];
    }

    if (parent instanceof UnaryExpr) {
        const original = parent.right;

        return [
            () => {
                parent.right = adopted;
            },
            () => {
                parent.right = original;
            },
        ];
    }

    throw new Error();
}

// tries to expand negated gates
// a xnor b -> not (a xor b)
export function negationExtractionSteps(step: Step): Step[] {
    return new (class NegationExtractionWalker implements ExprWalker<Step[]> {
        #steps: Step[] = [];
        #stack: Expr[] = [];

        walk(expr: Expr): Step[] {
            expr.accept(this);

            return this.#steps;
        }

        visitBinaryExpr(expr: BinaryExpr): void {
            this.#stack.push(expr);

            expr.left.accept(this);
            expr.right.accept(this);

            if ([TokenType.Xnor, TokenType.Nand, TokenType.Nor].includes(expr.operator.type)) {
                const a = expr.left;
                const b = expr.right;

                const extractedNegationExpr = new UnaryExpr(
                    Token.spoofed(TokenType.Not),
                    new BinaryExpr(a, Token.spoofed(inverseGateLookup.get(expr.operator.type)!), b),
                );

                const description = "extract not from " + expr.operator.type.toLowerCase();

                if (this.#stack.length > 1) {
                    // add in the expression to the tree
                    const [redo, undo] = replaceChild(
                        this.#stack.at(-1 - 1)!,
                        this.#stack.at(-1)!,
                        extractedNegationExpr,
                    );

                    redo();

                    this.#steps.push({
                        description,
                        expr: this.#stack[0].clone(),
                        from: step,
                    });

                    undo();
                } else {
                    // stack length is 1 so this is the root
                    this.#steps.push({
                        description,
                        expr: extractedNegationExpr,
                        from: step,
                    });
                }
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
