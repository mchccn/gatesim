import { assertNever } from "../../circular";
import { UNICODE_MACRON_DIACRITIC, VARIABLE_NAMES, variableFor } from "./variables";

/** formats a list of inputs according to the method being used */
function expression(input: boolean[], type: "PRODUCT_OF_SUMS" | "SUM_OF_PRODUCTS") {
    // expression is a sum, join by '+' for "a+b+c"
    if (type === "PRODUCT_OF_SUMS") return input.map((_, i) => variableFor(i, _)).join("+");

    // otherwise it is a product, like "abc"
    if (type === "SUM_OF_PRODUCTS") return input.map((_, i) => variableFor(i, !_)).join("");

    return assertNever(type);
}

/** turns a truth table into a list of expressions that represent each output */
export function stringify(table: boolean[][][]) {
    // can't stringify correctly if there are too many inputs
    if (table.some(([inputs]) => inputs.length > VARIABLE_NAMES.length))
        throw new RangeError(`Table contains more than ${VARIABLE_NAMES.length} inputs.`);

    const outputs = table.map(([, outputs]) => outputs);
    // transpose outputs for easier processing
    const transposed = outputs[0].map((_, col) => outputs.map((row) => row[col]));

    return transposed.map((out, index) => {
        // always true, use (a+¬a)
        if (out.every(Boolean)) return `(a+a${UNICODE_MACRON_DIACRITIC})`;
        // always false, use a¬a
        if (!out.some(Boolean)) return `aa${UNICODE_MACRON_DIACRITIC}`;

        // determine what method to use
        // if there are more trues than falses, use product of sums
        // otherwise, use sum of products
        // this makes it so that there are less outputs to generate expressions for
        const type = out.filter(Boolean).length > out.length / 2 ? "PRODUCT_OF_SUMS" : "SUM_OF_PRODUCTS";

        // filter for false outputs
        if (type === "PRODUCT_OF_SUMS") {
            return (
                "(" +
                table
                    .filter(([, outputs]) => outputs[index] === false)
                    .map(([inputs]) => expression(inputs, type))
                    .join(")(") +
                ")"
            );
        }

        // filter for true outputs
        if (type === "SUM_OF_PRODUCTS") {
            return table
                .filter(([, outputs]) => outputs[index] === true)
                .map(([inputs]) => expression(inputs, type))
                .join("+");
        }

        return assertNever(type);
    });
}
