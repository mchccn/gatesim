export type BossOnGen = (diagram: string) => void;

export class Boss {
    #table;
    #worker;
    #ongens = new Set<BossOnGen>();

    constructor(table: readonly boolean[][][]) {
        this.#table = table;

        // using ts extension because of webpack things
        this.#worker = new Worker(new URL("./employee.ts", import.meta.url));
    }

    ongen(run: BossOnGen) {
        this.#ongens.add(run);

        return this;
    }

    offgen(run: BossOnGen) {
        this.#ongens.delete(run);

        return this;
    }

    async work() {
        // send table to worker
        this.#worker.postMessage(this.#table);

        return new Promise<string>((resolve, reject) => {
            this.#worker.addEventListener("message", (e) => {
                const data = e.data;

                if (data.code === "ERROR") {
                    this.#worker.terminate();

                    return reject(data.error);
                }

                if (data.code === "GENERATION") {
                    return this.#ongens.forEach((run) => run.call(undefined, data.message));
                }

                // promise is resolved when the worker is done
                if (data.code === "FINISHED") {
                    this.fired();

                    return resolve(data.message);
                }
            });
        });
    }

    async fired() {
        this.#worker.terminate();
    }
}
