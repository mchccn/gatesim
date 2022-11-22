import { Component } from "./Component";
import { Input } from "./Input";
import { Output } from "./Output";
import { Reified } from "./Reified";
import { Wiring } from "./WiringManager";

function* gen() {
    let i = 0;

    while (true) yield i++;
}

export function saveDiagram(components: Reified[], wires: Wiring[]) {
    const id = gen();

    const elementIds = new Map<Element, number>();

    const data = {
        components: components.map((component, reified) => {
            if (component instanceof Input) {
                elementIds.set(component.element, id.next().value!);

                return {
                    reified,
                    type: "INPUT",
                    activated: component.element.classList.contains("activated"),
                    id: elementIds.get(component.element)!,
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }

            if (component instanceof Output) {
                elementIds.set(component.element, id.next().value!);

                return {
                    reified,
                    type: "OUTPUT",
                    activated: component.element.classList.contains("activated"),
                    id: elementIds.get(component.element)!,
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }

            if (component instanceof Component) {
                return {
                    reified,
                    type: "COMPONENT",
                    name: component.chip.name,
                    inputs: component.inputs.map((i) => {
                        elementIds.set(i, id.next().value!);

                        return { id: elementIds.get(i)!, activated: i.classList.contains("activated") };
                    }),
                    outputs: component.outputs.map((o) => {
                        elementIds.set(o, id.next().value!);

                        return { id: elementIds.get(o)!, activated: o.classList.contains("activated") };
                    }),
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }

            throw new Error("Unknown Reified component type.");
        }),
        wires: wires.map((wire) => ({
            from: elementIds.get(wire.from)!,
            to: elementIds.get(wire.to)!,
        })),
    };

    return JSON.stringify(data, undefined, 4);
}

//TODO: make this work
export function fromFile(file: string) {
    try {
        const data = JSON.parse(file);

        return { result: [], error: undefined };
    } catch {
        return { error: "Failed to parse JSON file.", result: [] };
    }
}
