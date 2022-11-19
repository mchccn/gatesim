import { html, Reified } from "./dom";

export class Output extends Reified {
    readonly element;

    constructor({ x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-output">O</button>`;

        this.move(x, y);
    }
}
