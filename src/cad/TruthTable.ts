import { StorageManager } from "../managers/StorageManager";
import { html } from "../reified/Reified";
import { downloadFile, fileInput } from "./files";
import { typeInTextarea } from "./table";

export class TruthTable extends HTMLElement {
    #input;
    #highlight;

    #control;
    #import;
    #export;

    #value = "";

    constructor() {
        super();

        this.appendChild(html`
            <div class="truth-table">
                <pre>
                    <code class="input-highlight"></code>
                </pre>
                <textarea class="table-input" spellcheck="false" autocapitalize="off"></textarea>
                <div class="buttons">
                    <button class="cad-control">Go</button>
                    <button class="import-table">Import table</button>
                    <button class="export-table">Export table</button>
                </div>
            </div>
        `);

        this.#input = this.querySelector<HTMLTextAreaElement>(".table-input")!;
        this.#highlight = this.querySelector<HTMLTextAreaElement>(".input-highlight")!;

        this.#control = this.querySelector<HTMLButtonElement>(".cad-control")!;
        this.#import = this.querySelector<HTMLButtonElement>(".import-table")!;
        this.#export = this.querySelector<HTMLButtonElement>(".export-table")!;

        this.#control;

        this.#import.addEventListener("click", async () => {
            const txt = await fileInput();

            if (txt) this.value = txt;
        });

        this.#export.addEventListener("click", () => {
            downloadFile([this.value]);
        });

        setTimeout(() => {
            if (!StorageManager.has("cad:input")) StorageManager.set("cad:input", "");

            this.value = StorageManager.get("cad:input")!;

            this.#highlightInput();

            this.#syncSizes();

            this.#input.addEventListener("keypress", (e) => {
                if (!["0", "1", ":", " "].includes(e.key) && e.code !== "Enter") return e.preventDefault();
            });

            this.#input.addEventListener("paste", async (e) => {
                e.preventDefault();

                const text = await navigator.clipboard.readText();

                if (!/[^01:\s]/.test(text)) {
                    typeInTextarea(text, this.#input);

                    this.#update();

                    this.#input.blur();
                    this.#input.focus();
                }
            });

            this.#input.addEventListener("input", () => {
                this.#update();
            });

            this.#input.addEventListener("scroll", () => {
                this.#syncSizes();

                this.#highlight.scrollTop = this.#input.scrollTop;
                this.#highlight.scrollLeft = this.#input.scrollLeft;
            });

            window.addEventListener("resize", () => {
                this.#syncSizes();
            });
        });
    }

    #update() {
        this.value = this.#input.value;

        StorageManager.set("cad:input", this.#value);

        this.#highlightInput();

        this.#syncSizes();
    }

    #syncSizes() {
        const style = getComputedStyle(this.#input);

        this.#highlight.style.width = style.width;
        this.#highlight.style.maxHeight = style.height;
    }

    #highlightInput() {
        this.#highlight.innerHTML = this.#input.value
            .replaceAll(":", '<span style="color: gray;">:</span>')
            .replaceAll("0", '<span style="color: red;">0</span>')
            .replaceAll("1", '<span style="color: blue;">1</span>');

        if (this.#input.value.endsWith("\n"))
            this.#highlight.innerHTML += `<span style="display: block; height: 16px;"></span>`;
    }

    get value() {
        return this.#value;
    }

    set value(v: string) {
        this.#value = v;

        this.#input.value = v;
    }
}

customElements.define("truth-table", TruthTable);
