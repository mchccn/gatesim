import { Chip } from "./chips";
import { queueNewContext } from "./contextmenu";
import { DraggingManager } from "./DraggingManager";
import { NewWireContext } from "./NewWireContext";
import { html, Reified } from "./Reified";
import { WiringManager } from "./WiringManager";

export class Component<I extends number, O extends number> extends Reified {
    readonly element;

    readonly inputs;
    readonly outputs;
    readonly name;

    readonly #observers = new Map<Element, MutationObserver>();
    readonly #contextmenus = new Map<Element, () => void>();

    readonly chip: Chip<I, O>;

    constructor(
        chip: Chip<I, O>,
        pos: { x: number; y: number } | ((comp: Component<I, O>) => { x: number; y: number })
    ) {
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

        this.inputs = Array.from(this.element.querySelectorAll<HTMLElement>(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll<HTMLElement>(".component-output-button"));
        this.name = this.element.querySelector<HTMLElement>(".component-name")!;

        this.update();

        this.inputs.forEach((input) => {
            this.#observers.set(input, new MutationObserver(this.update.bind(this)));

            this.#contextmenus.set(input, () => {
                queueNewContext((prev) => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            callback: () => {
                                WiringManager.wires = new Set(
                                    [...WiringManager.wires].filter((wire) => wire.to !== input)
                                );
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
                        "create-connection": {
                            label: "Create connection",
                            callback: () => {
                                NewWireContext.from = output;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            callback: () => {
                                WiringManager.wires = new Set(
                                    [...WiringManager.wires].filter((wire) => wire.from !== output)
                                );
                            },
                        },
                    },
                    ...prev,
                ]);
            });
        });

        this.#contextmenus.set(this.name, () => {
            queueNewContext((prev) => [
                {
                    "delete-component": {
                        label: "Delete component",
                        callback: () => {
                            this.detach();
                            WiringManager.wires = new Set(
                                [...WiringManager.wires].filter(
                                    (wire) =>
                                        this.inputs.every((i) => wire.to !== i) &&
                                        this.outputs.every((o) => wire.from !== o)
                                )
                            );
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        callback: () => {
                            WiringManager.wires = new Set(
                                [...WiringManager.wires].filter(
                                    (wire) =>
                                        this.inputs.every((i) => wire.to !== i) &&
                                        this.outputs.every((o) => wire.from !== o)
                                )
                            );
                        },
                    },
                },
                ...prev,
            ]);
        });

        this.move(typeof pos === "function" ? pos.call(undefined, this) : pos);
    }

    update() {
        const out = this.chip.evaluate(this.inputs.map((i) => i.classList.contains("activated")));

        this.outputs.forEach((output, i) => {
            output.classList.toggle("activated", out[i]);
        });

        return this;
    }

    attach() {
        super.attach();

        this.inputs.forEach((input) => {
            this.#observers.get(input)!.observe(input, {
                attributeFilter: ["class"],
                attributes: true,
            });

            input.addEventListener("contextmenu", this.#contextmenus.get(input)!);
        });

        this.outputs.forEach((output) => {
            output.addEventListener("contextmenu", this.#contextmenus.get(output)!);
        });

        this.name.addEventListener("contextmenu", this.#contextmenus.get(this.name)!);

        return this;
    }

    detach() {
        super.detach();

        this.#observers.forEach((o) => o.disconnect());

        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));

        this.name.removeEventListener("contextmenu", this.#contextmenus.get(this.name)!);

        DraggingManager.forget(this.element, true);

        return this;
    }
}
