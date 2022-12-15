import { html } from "../reified/Reified";
import { DarkmodeManager } from "./DarkmodeManager";
import { DraggingManager } from "./DraggingManager";
import { ModalManager } from "./ModalManager";

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

    static #listener = async () => {
        const form = html`
            <div class="settings-form">
                <h1>settings</h1>

                <p>Settings are saved automatically.</p>

                <label class="settings-control" for="darkmode">
                    <input name="darkmode" type="checkbox" ${DarkmodeManager.enabled ? "checked" : ""} />
                    dark mode
                </label>

                <label class="settings-control" for="snapToGrid">
                    <input name="snapToGrid" type="checkbox" ${DraggingManager.snapToGrid ? "checked" : ""} />
                    snap to grid
                </label>
            </div>
        `;

        await ModalManager.popup(form);

        DarkmodeManager.enabled = form.querySelector<HTMLInputElement>("input[name=darkmode]")!.checked;
        DraggingManager.snapToGrid = form.querySelector<HTMLInputElement>("input[name=snapToGrid]")!.checked;

        form.remove();
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

    static bringUpForm() {
        return this.#listener();
    }
}
