import { Parser } from "./parser/parser";
import { ConstantExpressionEvaluationPass as ConstExprEvalPass } from "./parser/passes/constants";
import { ExpressionSimplificationPass as ExprSimpPass } from "./parser/passes/expressions";
import { ExpressionNormalizingPass as ExprNormPass } from "./parser/passes/normalizer";
import { pipeline } from "./parser/passes/pipeline";
import { ExpressionPrinter } from "./parser/printer";
import { Scanner } from "./parser/scanner";
import { areTreesExactlyEqual } from "./parser/trees/equal";

// const lines = String.raw`
// a \neg b \neg c + \neg a b \neg c + \neg a \neg b c + a b c
// (a+b+c)
// 1 + 0
// (a + not a)
// not a
// not not a
// not not not a
// not not not not a
// not not not not not a
// 1 + 0
// 10
// (1 + 0)
// (10)
// (a)
// ((a))
// ((a) or ((b and c)) xor (0))(11)
// (not (a nand b))
// (((not (a nand b)) xor 1) and (a or not a))
// % comment % 1
// (((    (a nand b)) xor 1) and (a or not a))
// `
//     .split("\n")
//     .filter(Boolean);

const lines = String.raw`
c0b1a % multiplication should be sorted alphabetically and move constants to back with 1 before 0 %
`
    .split("\n")
    .filter(Boolean);

function show(source: string) {
    console.log(source);

    const tokens = new Scanner(source).scanTokens();

    let expr = new Parser(tokens).parse();

    // simplify until the passes do not change anything
    const pass = pipeline(ExprNormPass, ConstExprEvalPass, ExprSimpPass);

    // ugly code
    let passed = pass(expr);

    do {
        expr = passed;
    } while (((passed = pass(expr)), !areTreesExactlyEqual(expr, passed)));

    console.log(new ExpressionPrinter().print(expr));

    console.log("-".repeat(16));
}

console.clear();

lines.forEach(show);
