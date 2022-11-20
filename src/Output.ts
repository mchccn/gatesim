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
                "delete-connection": {
                    label: "Delete connection",
                    callback: () => {
                        WiringManager.wires = WiringManager.wires.filter((wire) => wire.to !== this.element);
                    },
                },
            },
            ...prev,
        ]);
    };

    constructor({ x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-output">O</button>`;

        this.move(x, y);
    }

    attach() {
        super.attach();

        this.element.addEventListener("contextmenu", this.#contextmenu);
    }

    detach() {
        super.detach();

        this.element.removeEventListener("contextmenu", this.#contextmenu);

        WiringManager.wires = WiringManager.wires.filter((wire) => wire.to !== this.element);
    }
}
