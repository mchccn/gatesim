import { chips } from "./chips";
import { Component } from "./Component";
import { INPUT_COMPONENT_CSS_SIZE, OUTPUT_COMPONENT_CSS_SIZE } from "./constants";
import { DraggingManager } from "./DraggingManager";
import { Input } from "./Input";
import { MenuManager } from "./MenuManager";
import { Output } from "./Output";
import { Reified } from "./Reified";

export const [queueNewContext] = MenuManager.use(Reified.root, [
    {
        "insert-chip": {
            label: "Insert chip",
            callback: (e) => {
                //TODO: add modal/toast system

                const name = prompt("Enter the chip's name:");

                if (!name) return;

                const chip = chips.get(name.toUpperCase());

                if (!chip) return;

                const component = new Component(Reflect.construct(chip, []), (component) => {
                    Reified.active.add(component);

                    component.attach();

                    DraggingManager.watch(component.element, component.name);

                    const { width, height } = getComputedStyle(component.element);

                    return {
                        x: e.clientX - parseFloat(width) / 2,
                        y: e.clientY - parseFloat(height) / 2,
                    };
                });
            },
        },
    },
    {
        "new-input": {
            label: "New input",
            callback: (e) => {
                const input = new Input({
                    x: e.clientX - INPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - INPUT_COMPONENT_CSS_SIZE / 2,
                });

                Reified.active.add(input);

                input.attach();
            },
        },
        "new-output": {
            label: "New output",
            callback: (e) => {
                const output = new Output({
                    x: e.clientX - OUTPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - OUTPUT_COMPONENT_CSS_SIZE / 2,
                });

                Reified.active.add(output);

                output.attach();
            },
        },
    },
    {
        "new-chip": {
            label: "New chip from diagram",
            callback: () => {},
        },
    },
    {
        "save-as": {
            label: "Save as file",
            callback: () => {},
        },
        "import-from": {
            label: "Import from file",
            callback: () => {},
        },
    },
]);
