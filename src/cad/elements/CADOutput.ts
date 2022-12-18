import { html } from "../../reified/Reified";

// nothing special just a custom element that wraps a div
// in case there is any special behavior to add
export class CADOutput extends HTMLElement {
    readonly element;

    constructor() {
        super();

        this.appendChild(html`<div class="cad-output"></div>`);

        this.element = this.querySelector<HTMLElement>(".cad-output")!;
    }
}

customElements.define("cad-output", CADOutput);
