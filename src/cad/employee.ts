import { stringify } from "./algebra/stringify";
import { substitute } from "./algebra/substitute";

try {
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
} catch (e) {
    self.postMessage({ code: "ERROR", error: e });
}

export {};
