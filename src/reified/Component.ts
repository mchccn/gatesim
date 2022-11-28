import { DraggingManager } from "../managers/DraggingManager";
import { SandboxManager } from "../managers/SandboxManager";
import { NewWireContext, Wiring, WiringManager } from "../managers/WiringManager";
import { Chip } from "./chips";
import { html, Reified } from "./Reified";

export class Component<I extends number, O extends number> extends Reified {
    readonly element;

    readonly inputs;
    readonly outputs;
    readonly name;

    readonly #observers = new Map<Element, MutationObserver>();
    readonly #mouseups = new Map<Element, () => void>();
    readonly #contextmenus = new Map<Element, () => void>();

    readonly chip: Chip<I, O>;

    constructor(
        chip: Chip<I, O>,
        pos: { x: number; y: number } | ((comp: Component<I, O>) => { x: number; y: number }),
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

            this.#mouseups.set(input, () => input.blur());

            this.#contextmenus.set(input, () => {
                SandboxManager.queueNewContext((prev) => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            callback: () => {
                                const deleted: Element[] = [];

                                SandboxManager.pushHistory(
                                    () => {
                                        WiringManager.wires.forEach((wire) => {
                                            if (wire.to === input) {
                                                wire.destroy();

                                                deleted.push(wire.from);
                                            }
                                        });

                                        input.classList.remove("activated");
                                    },
                                    () => {
                                        WiringManager.wires.addAll(
                                            deleted.splice(0, deleted.length).map((from) => new Wiring(from, input)),
                                        );
                                    },
                                );
                            },
                        },
                    },
                    ...prev,
                ]);
            });
        });

        this.outputs.forEach((output) => {
            this.#mouseups.set(output, () => output.blur());

            this.#contextmenus.set(output, () => {
                SandboxManager.queueNewContext((prev) => [
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
                                const deleted: Element[] = [];

                                SandboxManager.pushHistory(
                                    () => {
                                        WiringManager.wires.forEach((wire) => {
                                            if (wire.from === output) {
                                                wire.destroy();

                                                wire.to.classList.remove("activated");

                                                deleted.push(wire.to);
                                            }
                                        });
                                    },
                                    () => {
                                        WiringManager.wires.addAll(
                                            deleted.splice(0, deleted.length).map((to) => new Wiring(output, to)),
                                        );
                                    },
                                );
                            },
                        },
                    },
                    ...prev,
                ]);
            });
        });

        this.#contextmenus.set(this.name, () => {
            SandboxManager.queueNewContext((prev) => [
                {
                    "delete-component": {
                        label: "Delete component",
                        callback: () => {
                            const deleted: [from: Element, to: Element][] = [];

                            SandboxManager.pushHistory(
                                () => {
                                    Reified.active.delete(this);

                                    this.detach();

                                    WiringManager.wires.forEach((wire) => {
                                        if (
                                            this.inputs.some((i) => wire.to === i) ||
                                            this.outputs.some((o) => wire.from === o)
                                        ) {
                                            wire.destroy();

                                            wire.to.classList.remove("activated");

                                            deleted.push([wire.from, wire.to]);
                                        }
                                    });

                                    this.inputs.forEach((i) => i.classList.remove("activated"));
                                },
                                () => {
                                    Reified.active.add(this);

                                    this.attach();

                                    WiringManager.wires.addAll(
                                        deleted.splice(0, deleted.length).map(([from, to]) => new Wiring(from, to)),
                                    );
                                },
                            );
                        },
                    },
                    "delete-connections": {
                        label: "Delete connections",
                        callback: () => {
                            const deleted: [from: Element, to: Element][] = [];

                            SandboxManager.pushHistory(
                                () => {
                                    WiringManager.wires.forEach((wire) => {
                                        if (
                                            this.inputs.some((i) => wire.to === i) ||
                                            this.outputs.some((o) => wire.from === o)
                                        ) {
                                            wire.destroy();

                                            wire.to.classList.remove("activated");

                                            deleted.push([wire.from, wire.to]);
                                        }
                                    });

                                    this.inputs.forEach((i) => i.classList.remove("activated"));
                                },
                                () => {
                                    WiringManager.wires.addAll(
                                        deleted.splice(0, deleted.length).map(([from, to]) => new Wiring(from, to)),
                                    );
                                },
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

            input.addEventListener("mouseup", this.#mouseups.get(input)!);

            input.addEventListener("contextmenu", this.#contextmenus.get(input)!);
        });

        this.outputs.forEach((output) => {
            output.addEventListener("mouseup", this.#mouseups.get(output)!);

            output.addEventListener("contextmenu", this.#contextmenus.get(output)!);
        });

        this.name.addEventListener("contextmenu", this.#contextmenus.get(this.name)!);

        DraggingManager.watch(this.element, this.name);

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
