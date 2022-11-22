import { queueNewContext } from "./contextmenu";
import { NewWireContext } from "./NewWireContext";
import { html, Reified } from "./Reified";
import { WiringManager } from "./WiringManager";

export class Input extends Reified {
    readonly element;

    constructor(pos: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-input">I</button>`;

        this.move(pos);
    }

    readonly #mousedown = (e: MouseEvent) => {
        this.element.dataset.x = e.clientX.toString();
        this.element.dataset.y = e.clientY.toString();
    };

    readonly #click = (e: MouseEvent) => {
        if (Math.hypot(e.clientX - +this.element.dataset.x!, e.clientY - +this.element.dataset.y!) > 2) return;

        this.element.classList.toggle("activated");
    };

    readonly #contextmenu = () => {
        queueNewContext((prev) => [
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
                        this.detach();

                        WiringManager.wires.forEach((wire) => {
                            if (wire.from === this.element) {
                                wire.destroy();

                                wire.to.classList.remove("activated");
                            }
                        });
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    callback: () => {
                        WiringManager.wires.forEach((wire) => {
                            if (wire.from === this.element) {
                                wire.destroy();

                                wire.to.classList.remove("activated");
                            }
                        });
                    },
                },
            },
            ...prev,
        ]);
    };

    attach() {
        super.attach();

        this.element.addEventListener("mousedown", this.#mousedown);
        this.element.addEventListener("click", this.#click);
        this.element.addEventListener("contextmenu", this.#contextmenu);

        return this;
    }

    detach() {
        super.detach();

        this.element.removeEventListener("mousedown", this.#mousedown);
        this.element.removeEventListener("click", this.#click);
        this.element.removeEventListener("contextmenu", this.#contextmenu);

        return this;
    }
}
