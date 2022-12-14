import { stringify } from "./algebra/stringify";

try {
    const table = await new Promise<boolean[][][]>((resolve, reject) => {
        self.onmessage = (e) => resolve(e.data);

        self.onerror = (e) => reject(e);
    });

    console.log(
        stringify([
            [
                [false, false, false, true],
                [false, true],
            ],
            [
                [false, true, false, false],
                [false, false],
            ],
            [
                [true, true, false, false],
                [false, false],
            ],
            [
                [true, true, true, true],
                [false, false],
            ],
        ]),
    );

    console.log(table);
} catch (e) {
    self.postMessage({ code: "ERROR", error: e });
}

export {};
