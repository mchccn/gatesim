import { DraggingManager } from "../managers/DraggingManager";
import { SandboxManager } from "../managers/SandboxManager";
import { NewWireContext, Wiring, WiringManager } from "../managers/WiringManager";
import { html, Reified } from "./Reified";

export class Input extends Reified {
    readonly element;

    constructor(pos: { x: number; y: number } = { x: 0, y: 0 }) {
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

        const active = this.element.classList.contains("activated");

        SandboxManager.pushHistory(
            () => {
                this.element.classList.toggle("activated", !active);
            },
            () => {
                this.element.classList.toggle("activated", active);
            },
        );
    };

    readonly #contextmenu = () => {
        SandboxManager.queueNewContext((prev) => [
            {
                "create-connection": {
                    label: "Create connection",
                    callback: () => {
                        NewWireContext.from = this.element;
                    },
                },
                "delete-input": {
                    label: "Delete input",
                    callback: () => {
                        const deleted: Element[] = [];

                        SandboxManager.pushHistory(
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
                    callback: () => {
                        const deleted: Element[] = [];

                        SandboxManager.pushHistory(
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
            ...prev,
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
