import { StorageManager } from "./StorageManager";

export class DarkmodeManager {
    static readonly #changes = new Set<() => void>();

    static readonly #darkmodeKey = "settings.darkmode";
    static readonly #darkmodeModalsKey = "settings.darkmodeModals";

    static get darkmodeEnabled() {
        return StorageManager.get(this.#darkmodeKey) ?? false;
    }

    static set darkmodeEnabled(value: boolean) {
        StorageManager.set(this.#darkmodeKey, value);

        this.#element.innerText = value ? "🌕" : "🌑";

        this.#changes.forEach((run) => run.call(undefined));

        document.body.classList.toggle("darkmode", value);
    }

    static get darkmodeModalsEnabled() {
        return StorageManager.get(this.#darkmodeModalsKey) ?? false;
    }

    static set darkmodeModalsEnabled(value: boolean) {
        StorageManager.set(this.#darkmodeModalsKey, value);

        this.#element.innerText = value ? "🌕" : "🌑";

        this.#changes.forEach((run) => run.call(undefined));

        document.body.classList.toggle("darkmode-modals", value);
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
        this.darkmodeEnabled = !this.darkmodeEnabled;

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
        // trigger setters to set up initial state
        this.darkmodeEnabled = this.darkmodeEnabled;
        this.darkmodeModalsEnabled = this.darkmodeModalsEnabled;

        this.#element.innerText = this.darkmodeEnabled ? "🌕" : "🌑";

        this.#element.addEventListener("click", this.#listener);

        return this;
    }

    static stop() {
        this.#element.removeEventListener("click", this.#listener);

        return this;
    }

    static toggleDarkmode(value?: boolean) {
        this.darkmodeEnabled = typeof value === "boolean" ? value : !this.darkmodeEnabled;
    }

    static toggleDarkmodeModals(value?: boolean) {
        this.darkmodeModalsEnabled = typeof value === "boolean" ? value : !this.darkmodeModalsEnabled;
    }
}
