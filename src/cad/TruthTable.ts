import { ACTIVATED_CSS_COLOR, TOAST_DURATION } from "../constants";
import { StorageManager } from "../managers/StorageManager";
import { ToastManager } from "../managers/ToastManager";
import { html } from "../reified/Reified";

export class TruthTable extends HTMLElement {
    #input;
    #highlight;
    #value = "";

    constructor() {
        super();

        this.appendChild(html`
            <div class="truth-table">
                <div class="input-highlight"></div>
                <textarea class="table-input" spellcheck="false" autocapitalize="off"></textarea>
                <div class="buttons">
                    <button class="import-table">Import table</button>
                    <button class="export-table">Export table</button>
                </div>
            </div>
        `);

        this.#input = this.querySelector<HTMLTextAreaElement>(".table-input")!;
        this.#highlight = this.querySelector<HTMLTextAreaElement>(".input-highlight")!;

        setTimeout(() => {
            if (!StorageManager.has("cad:input")) StorageManager.set("cad:input", "");

            this.#input.value = StorageManager.get("cad:input")!;

            this.#highlightInput();

            this.#syncSizes();

            this.#input.addEventListener("keypress", (e) => {
                if (!["0", "1", ":", " "].includes(e.key) && e.code !== "Enter") return e.preventDefault();
            });

            this.#input.addEventListener("paste", async (e) => {
                const text = await navigator.clipboard.readText();

                if (/[^01: ]/.test(text)) {
                    e.preventDefault();

                    return ToastManager.toast({
                        message: "Pasting text is disabled.",
                        color: ACTIVATED_CSS_COLOR,
                        duration: TOAST_DURATION,
                    });
                }
            });

            this.#input.addEventListener("input", () => {
                this.#value = this.#input.value;

                StorageManager.set("cad:input", this.#value);

                this.#highlightInput();

                this.#syncSizes();
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
}

customElements.define("truth-table", TruthTable);
