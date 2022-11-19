import { html, Reified } from "./dom";

export class Input extends Reified {
    readonly element;

    constructor({ x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-input">I</button>`;

        this.move(x, y);
    }

    click = () => {
        this.element.classList.toggle("activated");
    };

    attach() {
        super.attach();

        this.element.addEventListener("click", this.click);
    }

    detach() {
        super.detach();

        this.element.removeEventListener("click", this.click);
    }
}
