import { DELAY } from "../constants";
import { Input } from "../reified/Input";
import { Output } from "../reified/Output";
import { Reified } from "../reified/Reified";
import { ModalManager } from "./ModalManager";
import { WiringManager } from "./WiringManager";

export class TestingManager {
    static #testing = false;

    static async test(cases: [inputs: boolean[], outputs: boolean[]][], { timeout = 1000 }: { timeout?: number } = {}) {
        if (this.#testing) return ModalManager.alert("Diagram is already under testing.");

        this.#testing = true;

        Reified.active.lock();
        WiringManager.wires.lock();

        const inputs = [...Reified.active]
            .filter((component): component is Input => component instanceof Input)
            .sort((a, b) => parseFloat(a.element.style.top) - parseFloat(b.element.style.top));
        const outputs = [...Reified.active]
            .filter((component): component is Output => component instanceof Output)
            .sort((a, b) => parseFloat(a.element.style.top) - parseFloat(b.element.style.top));

        const originalActivations = inputs.map((input) => input.element.classList.contains("activated"));

        let failed = false;

        for (const [givenInputs, expectedOutputs] of cases) {
            if (inputs.length !== givenInputs.length) throw new Error("Mismatched input lengths.");
            if (outputs.length !== expectedOutputs.length) throw new Error("Mismatched output lengths.");

            for (const [index, input] of inputs.entries()) {
                input.element.classList.toggle("activated", givenInputs[index]);
            }

            await DELAY(timeout);

            const realOutputs = outputs.map((output) => output.element.classList.contains("activated"));

            if (!realOutputs.every((out, i) => out === expectedOutputs[i])) {
                failed = true;

                await ModalManager.alert(
                    `Diagram failed to pass the test with inputs "${expectedOutputs
                        .map((boolean) => +boolean)
                        .join(" ")}".`,
                );

                break;
            }

            await DELAY(0);
        }

        if (!failed) await ModalManager.alert("Diagram passed all the tests.");

        originalActivations.forEach((value, i) => inputs[i].element.classList.toggle("activated", value));

        Reified.active.unlock();
        WiringManager.wires.unlock();

        this.#testing = false;
    }

    static get testing() {
        return this.#testing;
    }
}
