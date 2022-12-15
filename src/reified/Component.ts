import { ACTIVATED_CSS_COLOR, DELAY, IS_MAC_OS, LOCKED_FOR_TESTING, TOAST_DURATION } from "../constants";
import { DraggingManager } from "../managers/DraggingManager";
import { KeybindsManager } from "../managers/KeybindsManager";
import { SandboxManager } from "../managers/SandboxManager";
import { TestingManager } from "../managers/TestingManager";
import { ToastManager } from "../managers/ToastManager";
import { NewWireContext, Wiring, WiringManager } from "../managers/WiringManager";
import { Chip } from "./chips";
import { computeTransformOrigin, html, Reified } from "./Reified";

export class Component<I extends number, O extends number> extends Reified {
    readonly element;

    readonly inputs;
    readonly outputs;
    readonly name;

    readonly #observers = new Map<Element, MutationObserver>();
    readonly #mouseups = new Map<Element, () => void>();
    readonly #contextmenus = new Map<Element, () => void>();
    readonly #clicks = new Map<Element, () => void>();

    readonly chip: Chip<I, O>;

    #angle = 0;

    #complementary = false;

    constructor(
        chip: Chip<I, O>,
        pos:
            | { x: number; y: number; centered?: boolean }
            | ((comp: Component<I, O>) => { x: number; y: number; centered?: boolean }),
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

        this.inputs.forEach((input) => {
            this.#observers.set(input, new MutationObserver(this.update.bind(this)));

            this.#mouseups.set(input, () => input.blur());

            this.#contextmenus.set(input, () => {
                SandboxManager.queueNewContext(() => [
                    {
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                                const deleted: Element[] = [];

                                return SandboxManager.pushHistory(
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
                ]);
            });
        });

        this.outputs.forEach((output) => {
            this.#mouseups.set(output, () => output.blur());

            this.#contextmenus.set(output, () => {
                SandboxManager.queueNewContext(() => [
                    {
                        "create-connection": {
                            label: "Create connection",
                            keybind: "Q",
                            callback: () => {
                                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                                NewWireContext.from = output;

                                return undefined;
                            },
                        },
                        "delete-connections": {
                            label: "Delete connections",
                            keybind: IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                            callback: () => {
                                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                                const deleted: Element[] = [];

                                return SandboxManager.pushHistory(
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
                ]);
            });

            this.#clicks.set(output, () => {
                if (KeybindsManager.isKeyDown("KeyQ")) NewWireContext.from = output;
            });
        });

        this.#contextmenus.set(this.name, () => {
            SandboxManager.queueNewContext(() => [
                {
                    "delete-component": {
                        label: "Delete component",
                        keybind: IS_MAC_OS ? "⌘ X" : "Ctrl X",
                        callback: () => {
                            if (this.PERMANENT)
                                return void ToastManager.toast({
                                    message: "This component is permanent and cannot be deleted.",
                                    color: ACTIVATED_CSS_COLOR,
                                    duration: TOAST_DURATION,
                                });

                            if (TestingManager.testing) return LOCKED_FOR_TESTING();

                            const deleted: [from: Element, to: Element][] = [];

                            return SandboxManager.pushHistory(
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
                        keybind: IS_MAC_OS ? "⬆ ⌘ X" : "Ctrl Shift X",
                        callback: () => {
                            if (TestingManager.testing) return LOCKED_FOR_TESTING();

                            const deleted: [from: Element, to: Element][] = [];

                            return SandboxManager.pushHistory(
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
                {
                    "rotate-component": {
                        label: "Rotate component",
                        keybind: "R",
                        callback: () => {
                            if (TestingManager.testing) return LOCKED_FOR_TESTING();

                            return SandboxManager.pushHistory(
                                () => {
                                    this.angle += 90;
                                },
                                () => {
                                    this.angle -= 90;
                                },
                            );
                        },
                    },
                },
            ]);
        });

        setTimeout(() => this.update(), 0);

        this.move(typeof pos === "function" ? pos.call(undefined, this) : pos);
    }

    async update() {
        const out = this.chip.evaluate(this.inputs.map((i) => i.classList.contains("activated")));

        await DELAY(100 + Math.random() * 50 - 25);

        this.outputs.forEach((output, i) => {
            output.classList.toggle("activated", out[i]);
        });

        return this;
    }

    get angle() {
        return this.#angle;
    }

    set angle(v: number) {
        this.#angle = v % 360;

        this.element.style.transform = `rotateZ(${v}deg)`;

        if (v === 180) {
            this.name.style.transform = `rotateZ(${v}deg)`;
        } else {
            this.name.style.transform = "";
        }

        this.element.style.transformOrigin = computeTransformOrigin(this.element);
    }

    get complementary() {
        return this.#complementary;
    }

    set complementary(v: boolean) {
        this.#complementary = v;
    }

    rotate(angle: number) {
        this.angle = angle;

        return this;
    }

    attach() {
        super.attach();

        this.inputs.forEach((input) => {
            this.#observers.get(input)!.observe(input, {
                attributes: true,
                attributeFilter: ["class"],
            });

            input.addEventListener("mouseup", this.#mouseups.get(input)!);

            input.addEventListener("contextmenu", this.#contextmenus.get(input)!);
        });

        this.outputs.forEach((output) => {
            output.addEventListener("mouseup", this.#mouseups.get(output)!);

            output.addEventListener("contextmenu", this.#contextmenus.get(output)!);

            output.addEventListener("click", this.#clicks.get(output)!);
        });

        this.name.addEventListener("contextmenu", this.#contextmenus.get(this.name)!);

        DraggingManager.watch(this.element, this.name);

        return this;
    }

    detach() {
        super.detach();

        this.#observers.forEach((o) => o.disconnect());

        this.#mouseups.forEach((listener, element) => element.removeEventListener("mouseup", listener));

        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));

        this.#clicks.forEach((listener, element) => element.removeEventListener("click", listener));

        this.name.removeEventListener("contextmenu", this.#contextmenus.get(this.name)!);

        DraggingManager.forget(this.element, true);

        return this;
    }
}
