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

// const lines = String.raw`
// c0b1a % multiplication should be sorted alphabetically and prioritize constants to back with 1 before 0 %
// c+0+b+1+a % same rules as above %
// c0b+ba+a1c % ab + 1ac + 0bc %
// (cd+ba1)(ca+db1) % (1ab + cd)(ac + 1db) %
// `
//     .split("\n")
//     .filter(Boolean);

// const lines = String.raw`
// (b or not b) % 1 %
// (not c and c) % 0 %
// not (not b xor a) % a xor b %
// not (a xnor not b) % a xor not b %
// ((a and not b) or (not a and b)) % a xor b %
// ((a and b) or (not a and not b)) % a xnor b %
// (not a and not b and not c and not d) % a nor b nor c nor d %
// (not a or not b or not c or not d) % a nand b nand c nand d %
// `
//     .split("\n")
//     .filter(Boolean);

// const lines = String.raw`
// (a or b) and c % lower precedence %
// (a and b) and c % same precedence %
// (a xor b) and c % higher precedence %
// a and (b or c) % lower precedence %
// a and (b and c) % same precedence %
// a and (b xor c) % higher precedence %
// (a and b) and (c and d)
// `
//     .split("\n")
//     .filter(Boolean);

const lines = String.raw`
a \neg b \neg c + \neg a b \neg c + \neg a \neg b c + a b c
`
    .split("\n")
    .filter(Boolean);

function show(source: string) {
    console.log(source);

    const tokens = new Scanner(source).scanTokens();

    const pass = pipeline(ExprNormPass, ConstExprEvalPass, ExprSimpPass);

    let expr = new Parser(tokens).parse();

    let passed = pass(expr);

    // simplify until the passes do not change anything
    while (!areTreesExactlyEqual(expr, passed)) [expr, passed] = [passed, pass(expr)];

    console.log(new ExpressionPrinter().print(expr));

    console.log("-".repeat(16));
}

console.clear();

lines.forEach(show);
