import { html, Reified } from "./dom";

export class Input extends Reified {
    readonly element;

    constructor({ x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-input">I</button>`;

        this.move(x, y);
    }

    mousedown = (e: MouseEvent) => {
        this.element.dataset.ox = e.clientX.toString();
        this.element.dataset.oy = e.clientY.toString();
    };

    mouseup = (e: MouseEvent) => {
        this.element.dataset.nx = e.clientX.toString();
        this.element.dataset.ny = e.clientY.toString();
    };

    click = () => {
        if (
            this.element.dataset.nx !== this.element.dataset.ox ||
            this.element.dataset.ny !== this.element.dataset.oy
        )
            return;

        this.element.classList.toggle("activated");
    };

    attach() {
        super.attach();

        this.element.addEventListener("mousedown", this.mousedown);
        this.element.addEventListener("mouseup", this.mouseup);
        this.element.addEventListener("click", this.click);
    }

    detach() {
        super.detach();

        this.element.removeEventListener("mousedown", this.mousedown);
        this.element.removeEventListener("mouseup", this.mouseup);
        this.element.removeEventListener("click", this.click);
    }
}
