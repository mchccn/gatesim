import { html } from "../reified/Reified";
import { attachStyles } from "../styling/attacher";
import "./CADOutput";
import { CADOutput } from "./CADOutput";
import "./TruthTable";
import { TruthTable } from "./TruthTable";

await attachStyles(["style", "cad", "darkmode", "toast"]);

const table = html`<truth-table></truth-table>` as TruthTable;
const output = html`<cad-output></cad-output>` as CADOutput;

table.addEventListener("input", () => {});

document.body.appendChild(table);
document.body.appendChild(output);
document.body.appendChild(html`<div class="toasts-container"></div>`);
