import { html, Reified } from "./dom";

export class Input extends Reified {
    readonly element;

    //TODO: On attach/detach add/remove event listener to prevent memory leaks
    constructor({ x, y }: { x: number; y: number } = { x: 0, y: 0 }) {
        super();

        this.element = html`<button class="board-input">I</button>`;

        this.element.addEventListener("mousedown", (e) => {
            this.element.dataset.ox = e.clientX.toString();
            this.element.dataset.oy = e.clientY.toString();
        });

        this.element.addEventListener("mouseup", (e) => {
            this.element.dataset.nx = e.clientX.toString();
            this.element.dataset.ny = e.clientY.toString();
        });

        this.element.addEventListener("click", () => {
            if (
                this.element.dataset.nx !== this.element.dataset.ox ||
                this.element.dataset.ny !== this.element.dataset.oy
            )
                return;

            this.element.classList.toggle("activated");
        });

        this.move(x, y);
    }
}
