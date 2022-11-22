import { queueNewContext } from "./contextmenu";
import { html, Reified } from "./Reified";
import { WiringManager } from "./WiringManager";

export class Output extends Reified {
    readonly element;

    readonly #contextmenu = () => {
        queueNewContext((prev) => [
            {
                "delete-output": {
                    label: "Delete output",
                    callback: () => {
                        this.detach();
                    },
                },
                "delete-connections": {
                    label: "Delete connections",
                    callback: () => {
                        WiringManager.wires = WiringManager.wires.filter((wire) => wire.to !== this.element);
                    },
                },
            },
            ...prev,
        ]);
    };

    constructor(pos: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-output">O</button>`;

        this.move(pos);
    }

    attach() {
        super.attach();

        this.element.addEventListener("contextmenu", this.#contextmenu);

        return this;
    }

    detach() {
        super.detach();

        this.element.removeEventListener("contextmenu", this.#contextmenu);

        WiringManager.wires = WiringManager.wires.filter((wire) => wire.to !== this.element);

        return this;
    }
}
