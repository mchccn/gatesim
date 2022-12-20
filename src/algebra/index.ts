import type { Expr } from "./parser/expr";
import { Parser } from "./parser/parser";
import { ConstantExpressionEvaluationPass as ConstExprEvalPass } from "./parser/passes/constants";
import { ExpressionSimplificationPass as ExprSimpPass } from "./parser/passes/expressions";
import { ExpressionPrinter } from "./parser/printer";
import { Scanner } from "./parser/scanner";
import { areTreesExactlyEqual } from "./parser/trees/equal";

const lines = String.raw`
a \neg b \neg c + \neg a b \neg c + \neg a \neg b c + a b c
(a+b+c)
1 + 0
(a + not a)
not a
not not a
not not not a
not not not not a
not not not not not a
1 + 0
10
(1 + 0)
(10)
(a)
((a))
((a) or ((b and c)) xor (0))(11)
`
    .split("\n")
    .filter(Boolean);

function show(source: string) {
    console.log(source);

    const tokens = new Scanner(source).scanTokens();

    let expr = new Parser(tokens).parse();

    // simplify until the passes do not change anything

    // ugly code
    const pass = (expr: Expr) => new ExprSimpPass().pass(new ConstExprEvalPass().pass(expr.clone()));

    let passed;
    while (((passed = pass(expr)), !areTreesExactlyEqual(expr, passed))) {
        expr = passed;
    }

    console.log(new ExpressionPrinter().print(expr));

    console.log("-".repeat(16));
}

lines.forEach(show);

//@ts-ignore
globalThis.show = show;
