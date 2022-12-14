const ALPHABET = [..."qwertyuiopasdfghjklzxcvbnm"].sort();
const UNICODE_MACRON_DIACRITIC = "\u0304";

function expression(input: boolean[], type: "POS" | "SOP") {
    if (type === "POS")
        return input.map((_, i) => (!_ ? ALPHABET[i] : ALPHABET[i] + UNICODE_MACRON_DIACRITIC)).join("+");

    if (type === "SOP")
        return input.map((_, i) => (!_ ? ALPHABET[i] : ALPHABET[i] + UNICODE_MACRON_DIACRITIC)).join("");

    throw new TypeError(`Unknown type '${type}'.`);
}

export function stringify(table: boolean[][][]) {
    if (table.some(([inputs]) => inputs.length > 26)) throw new RangeError(`Table contains more than 26 inputs.`);

    const outputs = table.map(([, outputs]) => outputs);
    const transposed = outputs[0].map((_, col) => outputs.map((row) => row[col]));

    const type = transposed.map((list) => {
        if (list.every(Boolean)) return "SOP";

        if (!list.some(Boolean)) return "POS";

        return list.filter(Boolean).length > list.length / 2 ? "POS" : "SOP";
    });

    return transposed.map((_, i) => {
        if (type[i] === "POS")
            return "(" + table.map(([inputs]) => expression(inputs, type[i])).join(")(") + ")" + "=0";

        if (type[i] === "SOP") return table.map(([inputs]) => expression(inputs, type[i])).join("+") + "=1";

        throw new TypeError(`Unknown type '${type[i]}'.`);
    });
}
