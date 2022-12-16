import { IS_MAC_OS } from "../circular";
import { LIGHT_GRAY_CSS_COLOR, TOAST_DURATION } from "../constants";
import { saveDiagram } from "../files";
import { html, Reified } from "../reified/Reified";
import { MenuManagerActions } from "./MenuManager";
import { ToastManager } from "./ToastManager";
import { WiringManager } from "./WiringManager";

export class ToolsManager {
    static readonly #changes = new Set<() => void>();

    static readonly #listeners = new Map<Element, () => void>();

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
    ] satisfies MenuManagerActions;

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

        menu.innerHTML = this.actions
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

        this.actions.forEach((record) => {
            Object.keys(record).forEach((key) => {
                const click = record[key as keyof typeof record].callback.bind(undefined);

                const listener = () => {
                    click();

                    menu.style.display = "none";
                };

                const item = menu.querySelector<HTMLElement>("." + key)!;

                item.addEventListener("click", listener);
                item.addEventListener("contextmenu", listener);

                this.#listeners.set(item, listener);
            });
        });

        this.#element.after(menu);

        this.#element.addEventListener("click", this.#listener);

        return this;
    }

    static stop() {
        this.#listeners.forEach((listener, element) => {
            element.removeEventListener("click", listener);
            element.removeEventListener("contextmenu", listener);
        });

        this.#element.removeEventListener("click", this.#listener);

        return this;
    }
}
