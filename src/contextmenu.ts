import { ACTIVATED_CSS_COLOR, INPUT_COMPONENT_CSS_SIZE, ORIGIN_POINT, OUTPUT_COMPONENT_CSS_SIZE } from "./constants";
import { fromFile, saveDiagram } from "./files";
import { DraggingManager } from "./managers/DraggingManager";
import { MenuManager } from "./managers/MenuManager";
import { ModalManager } from "./managers/ModalManager";
import { ToastManager } from "./managers/ToastManager";
import { WiringManager } from "./managers/WiringManager";
import { chips } from "./reified/chips";
import { Component } from "./reified/Component";
import { Input } from "./reified/Input";
import { Output } from "./reified/Output";
import { Reified } from "./reified/Reified";

export const [queueNewContext] = MenuManager.use(Reified.root, [
    {
        "insert-chip": {
            label: "Insert chip",
            callback: async (e) => {
                const name = await ModalManager.prompt("Enter the chip's name:");

                if (typeof name !== "string") return;

                const chip = chips.get(name.toUpperCase());

                if (!chip) return ModalManager.alert("No chip was found with that name.");

                const component = new Component(Reflect.construct(chip, []), ORIGIN_POINT);

                Reified.active.add(component);

                component.attach();

                DraggingManager.watch(component.element, component.name);

                const { width, height } = getComputedStyle(component.element);

                component.move({
                    x: e.clientX - parseFloat(width) / 2,
                    y: e.clientY - parseFloat(height) / 2,
                });

                return;
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
    // {
    //     "new-chip": {
    //         label: "New chip from diagram",
    //         callback: async () => {
    //             const name = await ModalManager.prompt("Enter the name of the chip:");

    //             if (!name) return;

    //             if (
    //                 chips.has(name.trim().toUpperCase()) &&
    //                 !(await ModalManager.confirm(
    //                     "A chip already exists with this name.\nAre you sure you want to replace it?",
    //                 ))
    //             )
    //                 return;

    //             if (!/^\w+$/.test(name.trim().toUpperCase()))
    //                 return ModalManager.alert("Chip name must consist of only alphanumeric characters.");

    //             const inputs = [...Reified.active.values()].filter((v) => v instanceof Input).length;
    //             const outputs = [...Reified.active.values()].filter((v) => v instanceof Output).length;

    //             chips.set(
    //                 name.trim().toUpperCase(),
    //                 class _ extends Chip<number, number> {
    //                     static readonly NAME = name!.trim().toUpperCase();
    //                     static readonly INPUTS = inputs;
    //                     static readonly OUTPUTS = outputs;

    //                     constructor() {
    //                         super(name!, inputs, outputs);
    //                     }

    //                     output(inputs: boolean[]): boolean[] {
    //                         //TODO: SOMEHOW COMPILE THE DIAGRAM
    //                         //TODO: SORT INPUTS/OUTPUTS BY Y-COORD

    //                         return [];
    //                     }
    //                 },
    //             );

    //             Reified.active.forEach((component) => component.detach());

    //             WiringManager.wires.forEach((wire) => wire.destroy());
    //         },
    //     },
    // },
    {
        "save-as": {
            label: "Save as file",
            callback: () => {
                Object.assign(document.createElement("a"), {
                    href: URL.createObjectURL(
                        new Blob([saveDiagram([...Reified.active], [...WiringManager.wires])], {
                            type: "application/json",
                        }),
                    ),
                    download: `gatesim-${Date.now()}.json`,
                }).click();
            },
        },
        "import-from": {
            label: "Import from file",
            callback: async () => {
                const input = Object.assign(document.createElement("input"), { type: "file" });

                input.click();

                const file = await new Promise<File | undefined>((resolve) => {
                    input.onchange = () => resolve(input.files?.[0] ?? undefined);

                    input.onerror = () => resolve(undefined);
                });

                if (!file)
                    return ToastManager.toast({
                        message: "No file was provided.",
                        color: ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });

                const reader = new FileReader();

                reader.readAsText(file);

                const raw = await new Promise<string | undefined>((resolve) => {
                    reader.onload = () => resolve(reader.result?.toString() ?? undefined);

                    reader.onerror = () => resolve(undefined);
                });

                if (!raw)
                    return ToastManager.toast({
                        message: "Unable to read the file.",
                        color: ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });

                const {
                    error,
                    result: [components, wires],
                } = fromFile(raw);

                if (error) return ToastManager.toast({ message: error, color: ACTIVATED_CSS_COLOR, duration: 2500 });

                Reified.active.forEach((component) => component.detach());

                Reified.active = new Set(components);

                Reified.active.forEach((component) => component.attach());

                WiringManager.wires.forEach((wire) => wire.destroy());

                WiringManager.wires = new Set(wires);
            },
        },
    },
]);
