import { ACTIVATED_CSS_COLOR, IS_MAC_OS, LOCKED_FOR_TESTING, TOAST_DURATION } from "../constants";
import { DraggingManager } from "../managers/DraggingManager";
import { SandboxManager } from "../managers/SandboxManager";
import { TestingManager } from "../managers/TestingManager";
import { ToastManager } from "../managers/ToastManager";
import { NewWireContext, Wiring, WiringManager } from "../managers/WiringManager";
import { html, Reified } from "./Reified";

export class Input extends Reified {
    readonly element;

    constructor(pos: { x: number; y: number; centered?: boolean } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-input">I</button>`;

        this.move(pos);
    }

    readonly #mouseup = () => {
        this.element.blur();
    };

    readonly #mousedown = (e: MouseEvent) => {
        this.element.dataset.x = e.clientX.toString();
        this.element.dataset.y = e.clientY.toString();
    };

    readonly #click = (e: MouseEvent) => {
        if (Math.hypot(e.clientX - +this.element.dataset.x!, e.clientY - +this.element.dataset.y!) > 2) return;

        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        const active = this.element.classList.contains("activated");

        return SandboxManager.pushHistory(
            () => {
                this.element.classList.toggle("activated", !active);
            },
            () => {
                this.element.classList.toggle("activated", active);
            },
        );
    };

    readonly #contextmenu = () => {
        SandboxManager.queueNewContext(() => [
            {
                "create-connection": {
                    label: "Create connection",
                    callback: () => {
                        NewWireContext.from = this.element;
                    },
                },
                "delete-input": {
                    label: "Delete input",
                    keybind: IS_MAC_OS ? "⌘ X" : "Ctrl X",
                    callback: () => {
                        if (this.PERMANENT)
                            return void ToastManager.toast({
                                message: "This input is permanent and cannot be deleted.",
                                color: ACTIVATED_CSS_COLOR,
                                duration: TOAST_DURATION,
                            });

                        if (TestingManager.testing) return LOCKED_FOR_TESTING();

                        const deleted: Element[] = [];

                        return SandboxManager.pushHistory(
                            () => {
                                Reified.active.delete(this);

                                this.detach();

                                WiringManager.wires.forEach((wire) => {
                                    if (wire.from === this.element) {
                                        wire.destroy();

                                        wire.to.classList.remove("activated");

                                        deleted.push(wire.to);
                                    }
                                });
                            },
                            () => {
                                Reified.active.add(this);

                                this.attach();

                                WiringManager.wires.addAll(
                                    deleted.splice(0, deleted.length).map((to) => new Wiring(this.element, to)),
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

                        const deleted: Element[] = [];

                        return SandboxManager.pushHistory(
                            () => {
                                WiringManager.wires.forEach((wire) => {
                                    if (wire.from === this.element) {
                                        wire.destroy();

                                        wire.to.classList.remove("activated");

                                        deleted.push(wire.to);
                                    }
                                });
                            },
                            () => {
                                WiringManager.wires.addAll(
                                    deleted.splice(0, deleted.length).map((to) => new Wiring(this.element, to)),
                                );
                            },
                        );
                    },
                },
            },
        ]);
    };

    attach() {
        super.attach();

        this.element.addEventListener("mouseup", this.#mouseup);
        this.element.addEventListener("mousedown", this.#mousedown);
        this.element.addEventListener("click", this.#click);
        this.element.addEventListener("contextmenu", this.#contextmenu);

        DraggingManager.watch(this.element);

        return this;
    }

    detach() {
        super.detach();

        this.element.removeEventListener("mouseup", this.#mouseup);
        this.element.removeEventListener("mousedown", this.#mousedown);
        this.element.removeEventListener("click", this.#click);
        this.element.removeEventListener("contextmenu", this.#contextmenu);

        DraggingManager.forget(this.element, true);

        return this;
    }
}
