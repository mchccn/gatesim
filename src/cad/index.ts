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

document.body.appendChild(table);
document.body.appendChild(output);
document.body.appendChild(html`<div class="toasts-container"></div>`);

await DELAY();

table.element.addEventListener("input", () => {
    displayHeuristics(table, output);
});

table.asynconpaste = () => displayHeuristics(table, output);

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
        table.element.disabled = false;

        finished();
    } else {
        table.element.disabled = true;

        output.element.innerHTML = "";

        boss = new Boss(parseTable(table.value));

        boss.ongen((message) => {
            output.element.textContent += (output.element.textContent ? "\n" : "") + message;
        })
            .work()
            .then((message) => {
                console.log(message);
            })
            .catch((e) => {
                output.element.textContent = e;
            })
            .finally(() => finished());

        control.textContent = "Stop";
    }
});
