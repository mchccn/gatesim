import { fromVariable, isInversion } from "./variables";

// Array.prototype.some represents an or gate
// Array.prototype.every represents an and gate
// thus, a product of sums is really .some followed by .every
// and a sum of products is really a .every followed by .some
/** evaluates a list of expressions with the given inputs */
export function substitute(exprs: string[], using: boolean[]) {
    return exprs.map((expr) => {
        // product of sums
        if (expr.startsWith("(") && expr.endsWith(")")) {
            // need to get each sum
            return expr
                .slice(1, -1)
                .split(")(")
                .map((o) =>
                    o
                        .split("+")
                        .map((v) => (isInversion(v) ? !using[fromVariable(v)] : using[fromVariable(v)]))
                        .some(Boolean),
                )
                .every(Boolean);
        }

        // sum of products
        // splitting by lookahead regex because of macro diacritic and primes or double primes
        return expr
            .split("+")
            .map((o) =>
                o
                    .split(/(?=\w)/)
                    .map((v) => (isInversion(v) ? !using[fromVariable(v)] : using[fromVariable(v)]))
                    .every(Boolean),
            )
            .some(Boolean);
    });
}
