import { html, Reified } from "../reified/Reified";
import { DarkmodeManager } from "./DarkmodeManager";
import { DraggingManager } from "./DraggingManager";
import { ModalManager } from "./ModalManager";
import { WiringManager } from "./WiringManager";

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

                <div>
                    <label class="settings-control" for="darkmode">
                        <input name="darkmode" type="checkbox" ${DarkmodeManager.darkmodeEnabled ? "checked" : ""} />
                        dark mode
                    </label>

                    <label class="settings-control" for="darkmodeModals">
                        <input
                            name="darkmodeModals"
                            type="checkbox"
                            ${DarkmodeManager.darkmodeModalsEnabled ? "checked" : ""}
                        />
                        dark mode modals
                    </label>
                </div>

                <label class="settings-control" for="snapToGrid">
                    <input name="snapToGrid" type="checkbox" ${DraggingManager.snapToGrid ? "checked" : ""} />
                    snap to grid
                </label>

                <div>
                    <label class="settings-control" for="fancyWires">
                        <input name="fancyWires" type="checkbox" ${WiringManager.FANCY_WIRES ? "checked" : ""} />
                        fancy wires
                    </label>

                    <label class="settings-control" for="fancierWires">
                        <input name="fancierWires" type="checkbox" ${WiringManager.FANCIER_WIRES ? "checked" : ""} />
                        fancier wires
                    </label>
                </div>

                <div>
                    <label class="settings-control" for="gateDelay">
                        <input
                            name="gateDelay"
                            type="range"
                            min="0"
                            max="250"
                            step="25"
                            value="${Reified.GATE_DELAY}"
                        />
                        gate delay (0-250/25)
                    </label>

                    <label class="settings-control" for="gateDelayVariation">
                        <input
                            name="gateDelayVariation"
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value="${Reified.GATE_DELAY_VARIATION}"
                        />
                        gate delay variation (0-100/5)
                    </label>
                </div>

                <button style="width: 60px;">reset</button>
            </div>
        `;

        let reset = false;

        form.querySelector("button")!.addEventListener("click", () => {
            DarkmodeManager.darkmodeEnabled = false;
            DarkmodeManager.darkmodeModalsEnabled = false;
            DraggingManager.snapToGrid = false;
            Reified.GATE_DELAY = 100;
            Reified.GATE_DELAY_VARIATION = 25;

            reset = true;

            close();
        });

        const [closed, close] = await ModalManager.popup(form);

        await closed;

        if (!reset) {
            DarkmodeManager.darkmodeEnabled = form.querySelector<HTMLInputElement>("input[name=darkmode]")!.checked;
            DarkmodeManager.darkmodeModalsEnabled =
                form.querySelector<HTMLInputElement>("input[name=darkmodeModals]")!.checked;
            DraggingManager.snapToGrid = form.querySelector<HTMLInputElement>("input[name=snapToGrid]")!.checked;
            WiringManager.FANCY_WIRES = form.querySelector<HTMLInputElement>("input[name=fancyWires]")!.checked;
            Reified.GATE_DELAY = form.querySelector<HTMLInputElement>("input[name=gateDelay]")!.valueAsNumber;
            Reified.GATE_DELAY_VARIATION = form.querySelector<HTMLInputElement>(
                "input[name=gateDelayVariation]",
            )!.valueAsNumber;
        }

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
