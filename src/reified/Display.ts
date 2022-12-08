import { ACTIVATED_CSS_COLOR, DELAY, IS_MAC_OS, LOCKED_FOR_TESTING, TOAST_DURATION } from "../constants";
import { DraggingManager } from "../managers/DraggingManager";
import { KeybindsManager } from "../managers/KeybindsManager";
import { ModalManager } from "../managers/ModalManager";
import { SandboxManager } from "../managers/SandboxManager";
import { TestingManager } from "../managers/TestingManager";
import { ToastManager } from "../managers/ToastManager";
import { NewWireContext, Wiring, WiringManager } from "../managers/WiringManager";
import { html, Reified } from "./Reified";

export class Display extends Reified {
    readonly element;

    readonly inputs;
    readonly outputs;
    readonly display;

    readonly #observers = new Map<Element, MutationObserver>();
    readonly #mouseups = new Map<Element, () => void>();
    readonly #contextmenus = new Map<Element, () => void>();
    readonly #clicks = new Map<Element, () => void>();

    #bits;
    #radix;

    constructor(pos: { x: number; y: number; centered?: boolean } = { x: 0, y: 0 }, bits = 1, radix = 10) {
        super();

        this.#bits = bits;
        this.#radix = radix;

        this.element = html`
            <div class="display">
                <div class="component-inputs">
                    ${Array(bits).fill('<button class="component-input-button">I</button>').join("")}
                </div>
                <p class="display-content">0</p>
                <div class="component-outputs">
                    ${Array(bits).fill('<button class="component-output-button">O</button>').join("")}
                </div>
            </div>
        `;

        this.inputs = Array.from(this.element.querySelectorAll<HTMLElement>(".component-input-button"));
        this.outputs = Array.from(this.element.querySelectorAll<HTMLElement>(".component-output-button"));
        this.display = this.element.querySelector<HTMLElement>(".display-content")!;

        this.#updateListeners();

        setTimeout(() => this.update(), 0);

        this.move(pos);
    }

    async update() {
        const out = this.inputs.map((i) => i.classList.contains("activated"));

        await DELAY(100 + Math.random() * 50 - 25);

        this.display.textContent = out
            .reverse()
            .reduce((a, b, i, n) => a + +b * 2 ** (n.length - i - 1), 0)
            .toString(this.#radix);

        [...this.outputs].reverse().forEach((output, i) => {
            output.classList.toggle("activated", out[i]);
        });

        return this;
    }

    attach() {
        super.attach();

        this.#makeListeners();

        DraggingManager.watch(this.element, this.display);

        return this;
    }

    detach() {
        super.detach();

        this.#destroyListeners();

        DraggingManager.forget(this.element, true);

        return this;
    }

    #updateListeners() {
        this.#observers.clear();
        this.#mouseups.clear();
        this.#contextmenus.clear();

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

        this.#contextmenus.set(this.display, () => {
            SandboxManager.queueNewContext(() => [
                {
                    "set-bits": {
                        label: "Set bits",
                        callback: async () => {
                            const input = await ModalManager.prompt("Enter the number of bits:");

                            if (!input) return;

                            const bits = +input;

                            if (Number.isNaN(bits) || !Number.isInteger(bits) || bits < 1)
                                return ToastManager.toast({
                                    message: "Number of bits must be a positive integer.",
                                    color: ACTIVATED_CSS_COLOR,
                                    duration: TOAST_DURATION,
                                });

                            if (this.#bits === bits) return;

                            const previous = this.#bits;

                            const deleted: [from: Element, to: Element][] = [];

                            const inputs = [...this.inputs];
                            const outputs = [...this.outputs];

                            return SandboxManager.pushHistory(
                                () => {
                                    this.#bits = bits;

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

                                    this.#destroyListeners();

                                    this.inputs.forEach((i) => i.remove());
                                    this.outputs.forEach((o) => o.remove());

                                    this.inputs.splice(
                                        0,
                                        this.inputs.length,
                                        ...Array(bits)
                                            .fill(undefined)
                                            .map(() => html`<button class="component-input-button">I</button>`),
                                    );

                                    this.outputs.splice(
                                        0,
                                        this.outputs.length,
                                        ...Array(bits)
                                            .fill(undefined)
                                            .map(() => html`<button class="component-output-button">O</button>`),
                                    );

                                    const ic = this.element.querySelector<HTMLElement>(".component-inputs")!;
                                    const oc = this.element.querySelector<HTMLElement>(".component-outputs")!;

                                    this.inputs.forEach((i) => ic.appendChild(i));
                                    this.outputs.forEach((o) => oc.appendChild(o));

                                    this.#updateListeners();

                                    this.#makeListeners();

                                    this.update();

                                    SandboxManager.forceSave();
                                },
                                () => {
                                    this.#bits = previous;

                                    WiringManager.wires.addAll(
                                        deleted.splice(0, deleted.length).map(([from, to]) => new Wiring(from, to)),
                                    );

                                    this.#destroyListeners();

                                    this.inputs.forEach((i) => i.remove());
                                    this.outputs.forEach((o) => o.remove());

                                    this.inputs.splice(0, this.inputs.length, ...inputs);
                                    this.outputs.splice(0, this.outputs.length, ...outputs);

                                    const ic = this.element.querySelector<HTMLElement>(".component-inputs")!;
                                    const oc = this.element.querySelector<HTMLElement>(".component-outputs")!;

                                    this.inputs.forEach((i) => ic.appendChild(i));
                                    this.outputs.forEach((o) => oc.appendChild(o));

                                    this.#updateListeners();

                                    this.#makeListeners();

                                    this.update();

                                    SandboxManager.forceSave();
                                },
                            );
                        },
                    },
                    "set-radix": {
                        label: "Set radix",
                        callback: async () => {
                            const input = await ModalManager.prompt("Enter the number of bits:");

                            if (!input) return;

                            const radix = +input;

                            if (Number.isNaN(radix) || !Number.isInteger(radix) || radix < 1 || radix > 16)
                                return ToastManager.toast({
                                    message: "Display radix must be an integer from 1 to 16.",
                                    color: ACTIVATED_CSS_COLOR,
                                    duration: TOAST_DURATION,
                                });

                            const previous = this.#radix;

                            return SandboxManager.pushHistory(
                                () => {
                                    this.#radix = radix;

                                    this.update();

                                    SandboxManager.forceSave();
                                },
                                () => {
                                    this.#radix = previous;

                                    this.update();

                                    SandboxManager.forceSave();
                                },
                            );
                        },
                    },
                },
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
            ]);
        });
    }

    #makeListeners() {
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

        this.display.addEventListener("contextmenu", this.#contextmenus.get(this.display)!);
    }

    #destroyListeners() {
        this.#observers.forEach((o) => o.disconnect());

        this.#mouseups.forEach((listener, element) => element.removeEventListener("mouseup", listener));

        this.#contextmenus.forEach((listener, element) => element.removeEventListener("contextmenu", listener));

        this.#clicks.forEach((listener, element) => element.removeEventListener("click", listener));

        this.display.removeEventListener("contextmenu", this.#contextmenus.get(this.display)!);
    }

    get bits() {
        return this.#bits;
    }

    get radix() {
        return this.#radix;
    }
}
