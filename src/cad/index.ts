import { DELAY } from "../constants";
import { html } from "../reified/Reified";
import { attachStyles } from "../styling/attacher";
import { Boss } from "./boss";
import "./elements/CADOutput";
import { CADOutput } from "./elements/CADOutput";
import "./elements/TruthTable";
import { TruthTable } from "./elements/TruthTable";
import { displayHeuristics } from "./output";
import { parseTable } from "./table";

await attachStyles(["style", "cad", "darkmode", "toast"]);

const table = html`<truth-table></truth-table>` as TruthTable;
const output = html`<cad-output></cad-output>` as CADOutput;

table.addEventListener("input", () => {
    displayHeuristics(table, output);
});

document.body.appendChild(table);
document.body.appendChild(output);
document.body.appendChild(html`<div class="toasts-container"></div>`);

await DELAY();

displayHeuristics(table, output);

const control = table.querySelector<HTMLButtonElement>(".cad-control")!;

let boss: Boss | undefined;

function finished() {
    if (boss) {
        boss.fired();

        boss = undefined;
    }

    control.textContent = "Go";
}

control.addEventListener("click", async () => {
    if (control.textContent === "Stop") {
        finished();
    } else {
        boss = new Boss(parseTable(table.value));

        boss.ongen((diagram) => {
            console.log(diagram);
        })
            .work()
            .then((diagram) => {
                console.log(diagram);
            })
            .catch((e) => {
                output.innerHTML = e;
            })
            .finally(() => finished());

        // boss.ongen(() => {})
        //     .work()
        //     .then((dna) => {
        //         console.log(dna);
        //     })
        //     .catch((e) => {
        //         output.innerHTML = e;
        //     })
        //     .finally(() => finished());

        control.textContent = "Stop";
    }
});
