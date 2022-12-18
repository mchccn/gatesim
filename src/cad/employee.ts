import { reify } from "./algebra/reify";
import { stringify } from "./algebra/stringify";
import { substitute } from "./algebra/substitute";

try {
    // wait for boss to give us the table
    const table = await new Promise<boolean[][][]>((resolve, reject) => {
        self.onmessage = (e) => resolve(e.data);

        self.onerror = (e) => reject(e);
    });

    self.postMessage({
        code: "GENERATION",
        message: "Received:\n" + table.map((row) => row.map((col) => col.map(Number).join(" ")).join(" | ")).join("\n"),
    });

    self.postMessage({
        code: "GENERATION",
        message:
            "Expressions:\n" +
            stringify(table)
                .map((row, i) => `output ${i + 1}: ${row}`)
                .join("\n"),
    });

    self.postMessage({
        code: "GENERATION",
        message:
            "Tests:\n" +
            table
                .map(
                    ([input]) =>
                        `input ${input.map(Number).join(" ")}: ` +
                        substitute(stringify(table), input).map(Number).join(" "),
                )
                .join("\n"),
    });

    self.postMessage({
        code: "FINISHED",
        message: JSON.stringify(reify(table[0][0].length, stringify(table))),
    });
} catch (e) {
    self.postMessage({ code: "ERROR", error: e });
}

export {};
