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

    readonly #click = () => {
        this.element.classList.toggle("activated");
    };

    readonly #contextmenu = () => {
        queueNewContext((prev) => [
            {
                "create-connection": {
                    label: "Create connection",
                    callback: () => {
                        //
                        NewWireContext.from = this.element;
                    },
                },
                "delete-input": {
                    label: "Delete input",
                    callback: () => {
                        this.detach();
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    callback: () => {
                        WiringManager.wires = WiringManager.wires.filter((wire) => wire.from !== this.element);
                    },
                },
            },
            ...prev,
        ]);
    };

    attach() {
        super.attach();

        this.element.addEventListener("click", this.#click);
        this.element.addEventListener("contextmenu", this.#contextmenu);

        return this;
    }

    detach() {
        super.detach();

        this.element.removeEventListener("click", this.#click);
        this.element.removeEventListener("contextmenu", this.#contextmenu);

        WiringManager.wires = WiringManager.wires.filter((wire) => wire.from !== this.element);

        return this;
    }
}
