import { Chip } from "./chips";
import { queueNewContext } from "./contextmenu";
import { html, Reified } from "./Reified";
import { WiringManager } from "./WiringManager";

export class Component<I extends number, O extends number> extends Reified {
    readonly element;

    readonly inputs;
    readonly outputs;

    readonly #observers = new Map();
    readonly #contextmenus = new Map();

    readonly chip: Chip<I, O>;

    constructor(chip: Chip<I, O>, { x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.chip = chip;

        this.element = html`
            <div class="component">
                <div class="component-inputs">
                    ${Array(this.chip.inputs).fill('<button class="component-input-button">I</button>').join("")}
                </div>
                <p class="component-name">${this.chip.name}</p>
                <div class="component-outputs">
                    ${Array(this.chip.outputs).fill('<button class="component-output-button">O</button>').join("")}
                </div>
            </div>
        `;

        // add custom context menu on component-name

        this.inputs = Array.from(this.element.querySelectorAll(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll(".component-output-button"));

        this.inputs.forEach((input) => {
            this.#observers.set(
                input,
                new MutationObserver(() => {
                    const out = this.chip.evaluate(this.inputs.map((i) => i.classList.contains("activated")));

                    this.outputs.forEach((output, i) => {
                        output.classList.toggle("activated", out[i]);
                    });
                })
            );

            this.#contextmenus.set(input, () => {
                queueNewContext((prev) => [
                    {
                        "delete-connection": {
                            label: "Delete connection",
                            callback: () => {
                                WiringManager.wires = WiringManager.wires.filter((wire) => wire.to !== input);
                            },
                        },
                    },
                    ...prev,
                ]);
            });
        });

        this.outputs.forEach((output) => {
            this.#contextmenus.set(output, () => {
                queueNewContext((prev) => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            callback: () => {
                                WiringManager.wires = WiringManager.wires.filter((wire) => wire.from !== output);
                            },
                        },
                    },
                    ...prev,
                ]);
            });
        });

        this.move(x, y);
    }

    attach() {
        super.attach();

        this.inputs.forEach((input) => {
            this.#observers.get(input).observe(input, {
                attributeFilter: ["class"],
                attributes: true,
            });

            input.addEventListener("contextmenu", this.#contextmenus.get(input));
        });

        this.outputs.forEach((output) => {
            output.addEventListener("contextmenu", this.#contextmenus.get(output));
        });
    }

    detach() {
        super.detach();

        this.#observers.forEach((o) => o.disconnect());

        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));
    }
}
