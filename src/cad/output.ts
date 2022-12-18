import { html } from "../reified/Reified";
import type { CADOutput } from "./elements/CADOutput";
import type { TruthTable } from "./elements/TruthTable";
import { validTable } from "./table";

export function displayHeuristics(table: TruthTable, output: CADOutput) {
    const heuristics = validTable(table.value);

    output.element.innerHTML = "";

    if (heuristics.length) {
        // heuristics are sorted by row and message length
        // heuristics about the table are prioritized
        heuristics
            .sort((a, b) => {
                if (typeof a.row === "undefined" && typeof b.row === "undefined") return a.message > b.message ? -1 : 1;

                if (typeof a.row === "number" && typeof b.row === "number") return a.row - b.row;

                return typeof a.row === "undefined" ? -1 : 1;
            })
            .forEach((h) => {
                output.element.appendChild(
                    Object.assign(html`<div class="cad-heuristic"></div>`, {
                        textContent: `${typeof h.row === "undefined" ? "Table:" : `Row ${h.row}`} ${h.message}`,
                    }),
                );
            });
    }

    // disable the button if there are problems with the input
    table.querySelector<HTMLButtonElement>(".cad-control")!.disabled = !!heuristics.length;
}
