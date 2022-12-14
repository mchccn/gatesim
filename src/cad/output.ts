import { html } from "../reified/Reified";
import { CADOutput } from "./elements/CADOutput";
import { TruthTable } from "./elements/TruthTable";
import { validTable } from "./table";

export function displayHeuristics(table: TruthTable, output: CADOutput) {
    const heuristics = validTable(table.value);

    output.element.innerHTML = "";

    if (heuristics.length) {
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

    table.querySelector<HTMLButtonElement>(".cad-control")!.disabled = !!heuristics.length;
}
