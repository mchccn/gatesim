import { ACTIVATED_CSS_COLOR, LOCKED_FOR_TESTING, TOAST_DURATION } from "../constants";
import { DraggingManager } from "../managers/DraggingManager";
import { SandboxManager } from "../managers/SandboxManager";
import { TestingManager } from "../managers/TestingManager";
import { ToastManager } from "../managers/ToastManager";
import { Wiring, WiringManager } from "../managers/WiringManager";
import { html, Reified } from "./Reified";

export class Output extends Reified {
    readonly element;

    readonly #mouseup = () => {
        this.element.blur();
    };

    readonly #contextmenu = () => {
        SandboxManager.queueNewContext((prev) => [
            {
                "delete-output": {
                    label: "Delete output",
                    callback: () => {
                        if (this.PERMANENT)
                            return void ToastManager.toast({
                                message: "This output is permanent and cannot be deleted.",
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
                                    if (wire.to === this.element) {
                                        wire.destroy();

                                        deleted.push(wire.from);
                                    }
                                });

                                this.element.classList.remove("activated");
                            },
                            () => {
                                Reified.active.add(this);

                                this.attach();

                                WiringManager.wires.addAll(
                                    deleted.splice(0, deleted.length).map((from) => new Wiring(from, this.element)),
                                );
                            },
                        );
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    callback: () => {
                        if (TestingManager.testing) return LOCKED_FOR_TESTING();

                        const deleted: Element[] = [];

                        return SandboxManager.pushHistory(
                            () => {
                                WiringManager.wires.forEach((wire) => {
                                    if (wire.to === this.element) {
                                        wire.destroy();

                                        deleted.push(wire.from);
                                    }
                                });

                                this.element.classList.remove("activated");
                            },
                            () => {
                                WiringManager.wires.addAll(
                                    deleted.splice(0, deleted.length).map((from) => new Wiring(from, this.element)),
                                );
                            },
                        );
                    },
                },
            },
            ...prev.slice(2),
        ]);
    };

    constructor(pos: { x: number; y: number; centered?: boolean } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-output">O</button>`;

        this.move(pos);
    }

    attach() {
        super.attach();

        this.element.addEventListener("mouseup", this.#mouseup);
        this.element.addEventListener("contextmenu", this.#contextmenu);

        DraggingManager.watch(this.element);

        return this;
    }

    detach() {
        super.detach();

        this.element.removeEventListener("mouseup", this.#mouseup);
        this.element.removeEventListener("contextmenu", this.#contextmenu);

        DraggingManager.forget(this.element, true);

        return this;
    }
}
