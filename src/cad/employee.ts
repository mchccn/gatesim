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
        code: "MESSAGE",
        message: "Received:\n" + table.map((row) => row.map((col) => col.map(Number).join(" ")).join(" | ")).join("\n"),
    });

    self.postMessage({
        code: "MESSAGE",
        message:
            "Expressions:\n" +
            stringify(table)
                .map((row, i) => `output ${i + 1}: ${row}`)
                .join("\n"),
    });

    self.postMessage({
        code: "MESSAGE",
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

    const generated = reify(table[0][0].length, table[0][1].length, stringify(table));

    const link = new URL(location.href);

    link.pathname = "";

    link.search = "?inline=" + btoa(JSON.stringify(generated));

    self.postMessage({
        code: "MESSAGE",
        message: "Link:\n" + link.href,
    });

    self.postMessage({
        code: "FINISHED",
        message: "Generated:\n" + JSON.stringify(generated, undefined, 4),
    });
} catch (e) {
    console.log(e);

    self.postMessage({ code: "ERROR", error: e });
}

export {};
