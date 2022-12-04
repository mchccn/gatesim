import { ACTIVATED_CSS_COLOR, COUNTER_GENERATOR, IN_DEBUG_MODE, TOAST_DURATION } from "./constants";
import { ToastManager } from "./managers/ToastManager";
import { Wiring } from "./managers/WiringManager";
import { chips } from "./reified/chips";
import { Component } from "./reified/Component";
import { Display } from "./reified/Display";
import { Input } from "./reified/Input";
import { Output } from "./reified/Output";
import { Reified } from "./reified/Reified";

export type SerializedDiagram = {
    components: (
        | {
              reified: number;
              permanent: boolean;
              type: "INPUT";
              activated: boolean;
              id: number;
              x: number;
              y: number;
          }
        | {
              reified: number;
              permanent: boolean;
              type: "OUTPUT";
              activated: boolean;
              id: number;
              x: number;
              y: number;
          }
        | {
              reified: number;
              permanent: boolean;
              type: "COMPONENT";
              name: string;
              inputs: { id: number; activated: boolean }[];
              outputs: { id: number; activated: boolean }[];
              x: number;
              y: number;
          }
        | {
              reified: number;
              permanent: boolean;
              type: "DISPLAY";
              inputs: { id: number; activated: boolean }[];
              outputs: { id: number; activated: boolean }[];
              radix: number;
              x: number;
              y: number;
          }
    )[];
    wires: { from: number; to: number }[];
};

export function saveDiagram(components: Reified[], wires: Wiring[]) {
    const id = COUNTER_GENERATOR();

    const ids = new Map<Element, number>();

    const data: SerializedDiagram = {
        components: components.map((component, reified) => {
            if (component instanceof Input) {
                ids.set(component.element, id.next().value!);

                return {
                    reified,
                    permanent: component.permanence,
                    type: "INPUT",
                    activated: component.element.classList.contains("activated"),
                    id: ids.get(component.element)!,
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }

            if (component instanceof Output) {
                ids.set(component.element, id.next().value!);

                return {
                    reified,
                    permanent: component.permanence,
                    type: "OUTPUT",
                    activated: component.element.classList.contains("activated"),
                    id: ids.get(component.element)!,
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }

            if (component instanceof Component) {
                return {
                    reified,
                    permanent: component.permanence,
                    type: "COMPONENT",
                    name: component.chip.name,
                    inputs: component.inputs.map((i) => {
                        ids.set(i, id.next().value!);

                        return { id: ids.get(i)!, activated: i.classList.contains("activated") };
                    }),
                    outputs: component.outputs.map((o) => {
                        ids.set(o, id.next().value!);

                        return { id: ids.get(o)!, activated: o.classList.contains("activated") };
                    }),
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }

            if (component instanceof Display) {
                return {
                    reified,
                    permanent: component.permanence,
                    type: "DISPLAY",
                    inputs: component.inputs.map((i) => {
                        ids.set(i, id.next().value!);

                        return { id: ids.get(i)!, activated: i.classList.contains("activated") };
                    }),
                    outputs: component.outputs.map((o) => {
                        ids.set(o, id.next().value!);

                        return { id: ids.get(o)!, activated: o.classList.contains("activated") };
                    }),
                    radix: component.radix,
                    x: parseFloat(component.element.style.left),
                    y: parseFloat(component.element.style.top),
                };
            }

            ToastManager.toast({
                message: "Unable to serialize diagram.",
                color: ACTIVATED_CSS_COLOR,
                duration: TOAST_DURATION,
            });

            throw new Error("Unknown Reified component type.");
        }),
        wires: wires
            .filter((wire) => !wire.destroyed)
            .map((wire) => ({
                from: ids.get(wire.from)!,
                to: ids.get(wire.to)!,
            })),
    };

    return JSON.stringify(data, undefined, IN_DEBUG_MODE ? 4 : undefined);
}

export function fromFile(
    file: string,
): { error: string; result: [] } | { error: undefined; result: [components: Reified[], wires: Wiring[]] } {
    try {
        const data = JSON.parse(file);

        validate(data);

        const elements = new Map<number, Element>();

        const reified = data.components.map((raw) => {
            if (raw.type === "INPUT") {
                const input = new Input(raw);

                input.element.classList.toggle("activated", raw.activated);

                elements.set(raw.id, input.element);

                return raw.permanent ? input.permanent() : input;
            }

            if (raw.type === "OUTPUT") {
                const output = new Output(raw);

                output.element.classList.toggle("activated", raw.activated);

                elements.set(raw.id, output.element);

                return raw.permanent ? output.permanent() : output;
            }

            if (raw.type === "DISPLAY") {
                const display = new Display(raw, raw.inputs.length, raw.radix);

                display.inputs.forEach((input, index) => {
                    input.classList.toggle("activated", raw.inputs[index].activated);

                    elements.set(raw.inputs[index].id, input);
                });

                display.outputs.forEach((output, index) => {
                    output.classList.toggle("activated", raw.outputs[index].activated);

                    elements.set(raw.outputs[index].id, output);
                });

                return raw.permanent ? display.permanent() : display;
            }

            const component = new Component(new (chips.get(raw.name)!)(), raw);

            component.inputs.forEach((input, index) => {
                input.classList.toggle("activated", raw.inputs[index].activated);

                elements.set(raw.inputs[index].id, input);
            });

            component.outputs.forEach((output, index) => {
                output.classList.toggle("activated", raw.outputs[index].activated);

                elements.set(raw.outputs[index].id, output);
            });

            return raw.permanent ? component.permanent() : component;
        });

        const wires = data.wires.map(({ from, to }) => new Wiring(elements.get(from)!, elements.get(to)!));

        return { result: [reified, wires], error: undefined };
    } catch (e) {
        if (e instanceof Error) return { error: e.message, result: [] };

        return { error: "Failed to process file.", result: [] };
    }
}

function validate(data: unknown): asserts data is SerializedDiagram {
    if (!data || typeof data !== "object") throw new Error("Data is not an object.");

    if (!("components" in data)) throw new Error("Data is missing components.");

    if (!("wires" in data)) throw new Error("Data is missing wires.");

    if (!Array.isArray(data.components)) throw new Error("Components data is not an array.");

    if (!Array.isArray(data.wires)) throw new Error("Wires data is not an array.");

    for (const component of data.components as unknown[]) {
        if (!component || typeof component !== "object") throw new Error("Component data must an object.");

        if (!("reified" in component)) throw new Error("Components data is missing reified id.");

        if (typeof component.reified !== "number") throw new Error("Reified id must be a number.");

        if (!("permanent" in component)) throw new Error("Components data is missing permanence status.");

        if (typeof component.permanent !== "boolean") throw new Error("Component permanence must be a boolean.");

        if (!("type" in component)) throw new Error("Components data is missing a type.");

        if (typeof component.type !== "string" || !["INPUT", "OUTPUT", "COMPONENT", "DISPLAY"].includes(component.type))
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

                if (!("name" in component)) throw new Error("Component data is missing chip name.");

                if (typeof component.name !== "string") throw new Error("Chip name must be a string.");

                if (!chips.has(component.name.trim().toUpperCase())) throw new Error("Chip name doesn't exist.");

                const Chip = chips.get(component.name.trim().toUpperCase())!;

                if (component.inputs.length !== Chip.INPUTS)
                    throw new Error("Component inputs does not match chip inputs.");

                if (component.outputs.length !== Chip.OUTPUTS)
                    throw new Error("Component outputs does not match chip outputs.");

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
            case "DISPLAY": {
                if (!("radix" in component)) throw new Error("Display data is missing display radix.");

                if (typeof component.radix !== "number") throw new Error("Display radix must be a number.");

                if (!("inputs" in component)) throw new Error("Display data is missing inputs.");

                if (!Array.isArray(component.inputs)) throw new Error("Display inputs data must be an array.");

                if (!("outputs" in component)) throw new Error("Display data is missing outputs.");

                if (!Array.isArray(component.outputs)) throw new Error("Display outputs data must be an array.");

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
            }
        }
    }

    const ids = data.components.flatMap<number>((component) =>
        component.type === "COMPONENT" || component.type === "DISPLAY"
            ? [
                  ...component.inputs.map(({ id }: { id: number }) => id),
                  ...component.outputs.map(({ id }: { id: number }) => id),
              ]
            : component.id,
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
