import { html } from "../../reified/Reified";

export class CADOutput extends HTMLElement {
    readonly element;

    constructor() {
        super();

        this.appendChild(html`<div class="cad-output"></div>`);

        this.element = this.querySelector<HTMLElement>(".cad-output")!;
    }
}

customElements.define("cad-output", CADOutput);
