export type ConfigurableSettings = {
    ["DraggingManager.snapToGrid"]: boolean;
};

export class SettingsManager {
    static readonly #changes = new Set<() => void>();

    static get #element() {
        return document.querySelector<HTMLElement>("button.settings")!;
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
        // popup
    };

    static listen() {
        this.#element.innerText = "⚙️";

        this.#element.addEventListener("click", this.#listener);

        return this;
    }

    static stop() {
        this.#element.removeEventListener("click", this.#listener);

        return this;
    }
}
