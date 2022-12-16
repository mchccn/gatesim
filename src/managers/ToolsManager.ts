import { downloadFile } from "../cad/files";
import { IS_MAC_OS } from "../circular";
import { LIGHT_GRAY_CSS_COLOR, TOAST_DURATION } from "../constants";
import { saveDiagram } from "../files";
import { html, Reified } from "../reified/Reified";
import { MenuManagerActions } from "./MenuManager";
import { ModalManager } from "./ModalManager";
import { TestingManager } from "./TestingManager";
import { ToastManager } from "./ToastManager";
import { WiringManager } from "./WiringManager";

export class ToolsManager {
    static readonly #changes = new Set<() => void>();

    static readonly #listeners = new Map();

    static readonly actions = [
        {
            "copy-url": {
                label: "Copy link",
                keybind: IS_MAC_OS ? "⌘ K" : "Ctrl K",
                callback: async () => {
                    const hrefAsUrl = new URL(location.href);

                    hrefAsUrl.searchParams.set(
                        "inline",
                        btoa(saveDiagram([...Reified.active], [...WiringManager.wires])),
                    );

                    await navigator.clipboard.writeText(hrefAsUrl.href);

                    return ToastManager.toast({
                        message: "Copied diagram link to clipboard.",
                        color: LIGHT_GRAY_CSS_COLOR,
                        duration: TOAST_DURATION,
                    });
                },
            },
        },
        {
            "truth-table": {
                label: "Truth table from diagram",
                callback: async () => {
                    const table = await TestingManager.getTruthTable();

                    if (table) {
                        const pre = html`
                            <pre><button>Download</button><hr style="margin: 4px 0; border: 1px solid ${LIGHT_GRAY_CSS_COLOR}" /><code style="font-family: Fira Code, monospace;">${table
                                .map((row) => row.map((io) => io.map((v) => +v).join("")).join(":"))
                                .join("\n")
                                .replaceAll(":", '<span style="color: gray;">:</span>')
                                .replaceAll("0", '<span style="color: red;">0</span>')
                                .replaceAll("1", '<span style="color: blue;">1</span>')}</code></pre>
                        `;

                        pre.children[0].addEventListener("click", async () => {
                            await downloadFile([
                                table.map((row) => row.map((io) => io.map((v) => +v).join("")).join(":")).join("\n"),
                            ]);
                        });

                        await ModalManager.alert(pre);
                    }
                },
            },
        },
    ] as const satisfies Readonly<MenuManagerActions>;

    static readonly #actions: Readonly<MenuManagerActions> = this.actions;

    static get #element() {
        return document.querySelector<HTMLElement>("button.tools")!;
    }

    static onChange(run: () => void) {
        this.#changes.add(run);

        return this;
    }

    static offChange(run: () => void) {
        this.#changes.delete(run);

        return this;
    }

    static #listener = () => {
        const menu = document.querySelector<HTMLElement>(".tools-menu")!;

        menu.style.display = menu.style.display === "none" ? "" : "none";
    };

    static listen() {
        this.#element.innerText = "🛠";

        const menu = html`<div class="tools-menu" style="display: none;"></div>`;

        menu.innerHTML = this.#actions
            .map((record) =>
                Object.entries(record)
                    .map(([name, { label, keybind }]) =>
                        keybind
                            ? `<button class="${name}">${label}<p class="menu-keybind">${keybind
                                  .split(" ")
                                  .map((key) => `<span>${key}</span>`)
                                  .join("")}</p></button>`
                            : `<button class="${name}">${label}</button>`,
                    )
                    .join(""),
            )
            .join('<div class="br"></div>');

        this.#actions.forEach((record) => {
            Object.keys(record).forEach((key) => {
                const click = record[key].callback.bind(undefined);

                const item = menu.querySelector<HTMLElement>("." + key)!;

                item.addEventListener("mousedown", click);

                this.#listeners.set(item, click);
            });
        });

        this.#element.after(menu);

        this.#element.addEventListener("click", this.#listener);

        const body = () => {
            menu.style.display = "none";
        };

        document.body.addEventListener("mousedown", body);

        this.#listeners.set(document.body, body);

        return this;
    }

    static stop() {
        this.#listeners.forEach((listener, element) => {
            element.removeEventListener("mousedown", listener);
        });

        this.#element.removeEventListener("click", this.#listener);

        return this;
    }
}
