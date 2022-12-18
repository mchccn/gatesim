import { ACTIVATED_CSS_COLOR, DELAY, TOAST_DURATION } from "../constants";
import { ToastManager } from "../managers/ToastManager";
import { html } from "../reified/Reified";
import { attachStyles } from "../styling/attacher";
import { Boss } from "./boss";
import "./elements/CADOutput";
import type { CADOutput } from "./elements/CADOutput";
import "./elements/TruthTable";
import type { TruthTable } from "./elements/TruthTable";
import { displayHeuristics } from "./output";
import { parseTable } from "./table";

await attachStyles(["style", "cad", "darkmode", "toast"]);

const table = html`<truth-table></truth-table>` as TruthTable;
const output = html`<cad-output></cad-output>` as CADOutput;

document.body.appendChild(table);
document.body.appendChild(output);
document.body.appendChild(html`<div class="toasts-container"></div>`);

await DELAY();

const hrefAsUrl = new URL(location.href);

const shouldLoadInline = hrefAsUrl.searchParams.get("inline");

if (shouldLoadInline) {
    try {
        const inlined = atob(shouldLoadInline);

        table.value = inlined;
    } catch {
        ToastManager.toast({
            message: "Table is not correctly encoded.",
            color: ACTIVATED_CSS_COLOR,
            duration: TOAST_DURATION,
        });

        hrefAsUrl.searchParams.delete("inline");

        history.pushState(undefined, "", hrefAsUrl);
    }
}

table.element.focus();

table.element.addEventListener("input", () => {
    displayHeuristics(table, output);
});

table.element.addEventListener("keypress", () => {
    if (!table.value.trim()) {
        output.element.innerHTML = "";
    }
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
                const link = new URL(location.href);

                link.search = "?inline=" + btoa(message);

                console.log(link.href);

                console.log(message);
            })
            .catch((e) => {
                output.element.textContent = e;
            })
            .finally(() => finished());

        control.textContent = "Stop";
    }
});
