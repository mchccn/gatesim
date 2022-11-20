import { html, Reified } from "./Reified";

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

    contextmenu = (e: MouseEvent) => {
        e.preventDefault();

        this.element.classList.toggle("activated");
    };

    attach() {
        super.attach();

        this.element.addEventListener("click", this.click);
        this.element.addEventListener("contextmenu", this.contextmenu);
    }

    detach() {
        super.detach();

        this.element.removeEventListener("click", this.click);
    }
}
