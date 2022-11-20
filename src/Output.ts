import { html, Reified } from "./Reified";
import { WiringManager } from "./WiringManager";

export class Output extends Reified {
    readonly element;

    readonly #contextmenu = (e: MouseEvent) => {
        e.preventDefault();

        e.stopImmediatePropagation();

        const index = WiringManager.wires.findIndex((w) => w.to === this.element);

        if (index >= 0) WiringManager.wires.splice(index, 1);
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
    }
}
