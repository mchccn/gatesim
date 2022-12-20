import { Parser } from "./parser/parser";
import { ConstantsReducerPass } from "./parser/passes/constants";
import { Scanner } from "./parser/scanner";

const lines = String.raw`
a \neg b \neg c + \neg a b \neg c + \neg a \neg b c + a b c
(a+b+c)
1 + 0
`
    .split("\n")
    .filter(Boolean);

function show(source: string) {
    const tokens = new Scanner(source).scanTokens();

    console.log(source);

    console.log(tokens);

    console.log(tokens.map(({ lexeme }) => lexeme).join(" "));

    const expr = new Parser(tokens).parse();

    console.log(expr);

    const constantsReduced = new ConstantsReducerPass().pass(expr);

    console.log(constantsReduced);

    console.log("-".repeat(16));
}

lines.forEach(show);

//@ts-ignore
globalThis.show = show;
