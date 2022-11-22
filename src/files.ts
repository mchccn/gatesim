import { Component } from "./Component";
import { Input } from "./Input";
import { Output } from "./Output";
import { Reified } from "./Reified";
import { Wiring } from "./WiringManager";

function* gen() {
    let i = 0;

    while (true) yield i++;
}

//TODO: make this work
export function saveDiagram(components: Reified[], wires: Wiring[]) {
    const id = gen();

    const elementIds = new Map<Element, number>();

    const preparedComponents = components.map((component, componentId) => {
        if (component instanceof Input) {
            elementIds.set(component.element, id.next().value!);

            return {
                componentId,
                type: "INPUT",
                activated: component.element.classList.contains("activated"),
                x: parseFloat(component.element.style.left),
                y: parseFloat(component.element.style.top),
            };
        }

        if (component instanceof Output) {
            elementIds.set(component.element, id.next().value!);

            return {
                componentId,
                type: "OUTPUT",
                activated: component.element.classList.contains("activated"),
                x: parseFloat(component.element.style.left),
                y: parseFloat(component.element.style.top),
            };
        }

        if (component instanceof Component) {
            component.inputs.forEach((i) => elementIds.set(i, id.next().value!));
            component.outputs.forEach((o) => elementIds.set(o, id.next().value!));

            return {
                componentId,
                type: "COMPONENT",
                name: component.chip.name,
                inputs: component.inputs.map((i) => i.classList.contains("activated")),
                outputs: component.outputs.map((o) => o.classList.contains("activated")),
                x: parseFloat(component.element.style.left),
                y: parseFloat(component.element.style.top),
            };
        }

        throw new Error("Unknown Reified component type.");
    });

    console.log(preparedComponents);

    // const preparedWires = wires

    const data = {};

    return "";
}

//TODO: make this work
export function fromFile(file: string) {
    return [];
}
