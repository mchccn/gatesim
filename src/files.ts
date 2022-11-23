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

export function fromFile(file: string) {
    try {
        const data = JSON.parse(file);

        validate(data);

        //TODO: make this work

        return { result: [], error: undefined };
    } catch ({ message: error = "" }) {
        return { error, result: [] };
    }
}

function validate(data: unknown) {
    if (!data || typeof data !== "object") throw new Error("Data is not an object.");

    if (!("components" in data)) throw new Error("Data is missing components.");

    if (!("wires" in data)) throw new Error("Data is missing wires.");

    if (!Array.isArray(data.components)) throw new Error("Components data is not an array.");

    if (!Array.isArray(data.wires)) throw new Error("Wires data is not an array.");

    for (const component of data.components as unknown[]) {
        if (!component || typeof component !== "object") throw new Error("Component data must an object.");

        if (!("reified" in component)) throw new Error("Components data is missing reified id.");

        if (typeof component.reified !== "number") throw new Error("Reified id must be a number.");

        if (!("type" in component)) throw new Error("Components data is missing a type.");

        if (typeof component.type !== "string" || !["INPUT", "OUTPUT", "COMPONENT"].includes(component.type))
            throw new Error("Invalid component type.");

        if (!("x" in component)) throw new Error("Components data is missing a x coordinate.");

        if (typeof component.x !== "number") throw new Error("Component x coordinate must be a number.");

        if (!("y" in component)) throw new Error("Components data is missing a y coordinate.");

        if (typeof component.y !== "number") throw new Error("Component y coordinate must be a number.");

        switch (component.type) {
            case "INPUT":
            case "OUTPUT": {
                if (!("id" in component)) throw new Error("I/O data is missing ids.");

                if (typeof component.id !== "number") throw new Error("I/O id must be a number.");

                if (!("activated" in component)) throw new Error("I/O data is missing activation status.");

                if (typeof component.activated !== "boolean") throw new Error("Activation status must be a boolean.");

                break;
            }
            case "COMPONENT": {
                if (!("inputs" in component)) throw new Error("Component data is missing inputs.");

                if (!Array.isArray(component.inputs)) throw new Error("Component inputs data must be an array.");

                if (!("outputs" in component)) throw new Error("Component data is missing outputs.");

                if (!Array.isArray(component.outputs)) throw new Error("Component outputs data must be an array.");

                for (const input of component.inputs as unknown[]) {
                    if (!input || typeof input !== "object") throw new Error("Input data must be an object");

                    if (!("id" in input)) throw new Error("Input data is missing id.");

                    if (typeof input.id !== "number") throw new Error("Input data id must be a number.");

                    if (!("activated" in input)) throw new Error("Input data is missing activation status.");

                    if (typeof input.activated !== "boolean") throw new Error("Activation status must be a boolean.");
                }

                for (const output of component.outputs as unknown[]) {
                    if (!output || typeof output !== "object") throw new Error("Input data must be an object");

                    if (!("id" in output)) throw new Error("Input data is missing id.");

                    if (typeof output.id !== "number") throw new Error("Input data id must be a number.");

                    if (!("activated" in output)) throw new Error("Input data is missing activation status.");

                    if (typeof output.activated !== "boolean") throw new Error("Activation status must be a boolean.");
                }

                break;
            }
        }
    }

    const ids = data.components.flatMap<number>((component) =>
        component.type === "COMPONENT"
            ? [
                  ...component.inputs.map(({ id }: { id: number }) => id),
                  ...component.outputs.map(({ id }: { id: number }) => id),
              ]
            : component.id
    );

    for (const wire of data.wires as unknown[]) {
        if (!wire || typeof wire !== "object") throw new Error("Wire data must be an object.");

        if (!("from" in wire)) throw new Error("Wire data is missing the component it starts from.");

        if (typeof wire.from !== "number") throw new Error("Wire data must reference numeric ids.");

        if (!("to" in wire)) throw new Error("Wire data is missing the target component.");

        if (typeof wire.to !== "number") throw new Error("Wire data must reference numeric ids.");

        if (!ids.includes(wire.from) || !ids.includes(wire.to)) throw new Error("Wire data references invalid ids.");
    }
}
