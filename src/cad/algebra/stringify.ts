import { UNICODE_MACRON_DIACRITIC, variableFor, VARIABLE_NAMES } from "./variables";

function expression(input: boolean[], type: "PRODUCT_OF_SUMS" | "SUM_OF_PRODUCTS") {
    if (type === "PRODUCT_OF_SUMS") return input.map((_, i) => variableFor(i, _)).join("+");

    if (type === "SUM_OF_PRODUCTS") return input.map((_, i) => variableFor(i, !_)).join("");

    throw new TypeError(`Unknown type '${type}'.`);
}

export function stringify(table: boolean[][][]) {
    if (table.some(([inputs]) => inputs.length > VARIABLE_NAMES.length))
        throw new RangeError(`Table contains more than ${VARIABLE_NAMES.length} inputs.`);

    const outputs = table.map(([, outputs]) => outputs);
    const transposed = outputs[0].map((_, col) => outputs.map((row) => row[col]));

    return transposed.map((out, index) => {
        if (out.every(Boolean)) return `(a+a${UNICODE_MACRON_DIACRITIC})`;
        if (!out.some(Boolean)) return `aa${UNICODE_MACRON_DIACRITIC}`;

        const type = out.filter(Boolean).length > out.length / 2 ? "PRODUCT_OF_SUMS" : "SUM_OF_PRODUCTS";

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

        if (type === "SUM_OF_PRODUCTS") {
            return table
                .filter(([, outputs]) => outputs[index] === true)
                .map(([inputs]) => expression(inputs, type))
                .join("+");
        }

        throw new Error();
    });
}
