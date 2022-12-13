import { html } from "../reified/Reified";
import { CADOutput } from "./CADOutput";
import { validTable } from "./table";
import { TruthTable } from "./TruthTable";

export function displayHeuristics(table: TruthTable, output: CADOutput) {
    const heuristics = validTable(table.value);

    output.element.innerHTML = "";

    heuristics
        .sort((a, b) => {
            if (typeof a.row === "undefined" && typeof b.row === "undefined") return a.message > b.message ? -1 : 1;

            if (typeof a.row === "number" && typeof b.row === "number") return a.row - b.row;

            return typeof a.row === "undefined" ? -1 : 1;
        })
        .forEach((h) => {
            output.element.appendChild(html`
                <div class="cad-heuristic">
                    <p>${typeof h.row === "undefined" ? "Table" : `Row ${h.row}`}</p>
                    ${h.message}
                </div>
            `);
        });
}
