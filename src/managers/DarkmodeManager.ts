import { StorageManager } from "./StorageManager";

export class DarkmodeManager {
    static readonly #key = "settings.darkmode";

    static get #enabled() {
        return StorageManager.get(this.#key) ?? false;
    }

    static set #enabled(value: boolean) {
        StorageManager.set(this.#key, value);

        this.#element.innerText = value ? "🌕" : "🌑";

        document.body.classList.toggle("darkmode", value);
    }

    static get #element() {
        return document.querySelector<HTMLElement>("button.darkmode")!;
    }

    static #listener = () => {
        this.#enabled = !this.#enabled;
    };

    static listen() {
        this.#enabled = this.#enabled;

        this.#element.innerText = this.#enabled ? "🌕" : "🌑";

        this.#element.addEventListener("click", this.#listener);
    }

    static stop() {
        this.#element.removeEventListener("click", this.#listener);
    }

    static toggle(value?: boolean) {
        this.#enabled = typeof value === "boolean" ? value : !this.#enabled;
    }
}
