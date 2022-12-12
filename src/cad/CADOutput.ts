import { html } from "../reified/Reified";

export class CADOutput extends HTMLElement {
    constructor() {
        super();

        this.appendChild(html`<div class="cad-output"></div>`);
    }
}

customElements.define("cad-output", CADOutput);
