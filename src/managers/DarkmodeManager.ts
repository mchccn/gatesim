import { StorageManager } from "./StorageManager";

export class DarkmodeManager {
    static readonly #changes = new Set<() => void>();

    static readonly #key = "settings.darkmode";

    static get #enabled() {
        return StorageManager.get(this.#key) ?? false;
    }

    static set #enabled(value: boolean) {
        StorageManager.set(this.#key, value);

        this.#element.innerText = value ? "🌕" : "🌑";

        this.#changes.forEach((run) => run.call(undefined));

        document.body.classList.toggle("darkmode", value);
    }

    static get enabled() {
        return this.#enabled;
    }

    static get #element() {
        return document.querySelector<HTMLElement>("button.darkmode")!;
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
        this.#enabled = !this.#enabled;

        const buttons = document.querySelectorAll<HTMLElement>("button.tools, button.settings, button.darkmode");

        buttons.forEach((b) => {
            b.style.transition = "none";
        });

        requestAnimationFrame(() => {
            buttons.forEach((b) => {
                b.style.transition = "";
            });
        });
    };

    static listen() {
        this.#enabled = this.#enabled;

        this.#element.innerText = this.#enabled ? "🌕" : "🌑";

        this.#element.addEventListener("click", this.#listener);

        return this;
    }

    static stop() {
        this.#element.removeEventListener("click", this.#listener);

        return this;
    }

    static toggle(value?: boolean) {
        this.#enabled = typeof value === "boolean" ? value : !this.#enabled;
    }
}
