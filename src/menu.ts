import {
    ACTIVATED_CSS_COLOR,
    INPUT_COMPONENT_CSS_SIZE,
    IN_DEBUG_MODE,
    LOCKED_FOR_TESTING,
    ORIGIN_POINT,
    OUTPUT_COMPONENT_CSS_SIZE,
} from "./constants";
import { fromFile, saveDiagram } from "./files";
import { keybinds } from "./keybinds";
import { MenuManagerActions } from "./managers/MenuManager";
import { ModalManager } from "./managers/ModalManager";
import { SandboxManager } from "./managers/SandboxManager";
import { StorageManager } from "./managers/StorageManager";
import { TestingManager } from "./managers/TestingManager";
import { ToastManager } from "./managers/ToastManager";
import { WiringManager } from "./managers/WiringManager";
import { chips } from "./reified/chips";
import { Component } from "./reified/Component";
import { Input } from "./reified/Input";
import { Output } from "./reified/Output";
import { Reified } from "./reified/Reified";

export const menu: MenuManagerActions = [
    {
        "insert-chip": {
            label: "Insert chip",
            callback: async (e) => {
                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                const name = await ModalManager.prompt("Enter the chip's name:");

                if (typeof name !== "string") return;

                const chip = chips.get(name.toUpperCase());

                if (!chip) return ModalManager.alert("No chip was found with that name.");

                const component = new Component(Reflect.construct(chip, []), ORIGIN_POINT);

                return SandboxManager.pushHistory(
                    () => {
                        Reified.active.add(component);

                        if (Reified.active.has(component)) {
                            component.attach();

                            const { width, height } = getComputedStyle(component.element);

                            component.move({
                                x: e.clientX - parseFloat(width) / 2,
                                y: e.clientY - parseFloat(height) / 2,
                            });
                        }
                    },
                    () => {
                        Reified.active.delete(component);

                        component.detach();
                    },
                );
            },
        },
    },
    {
        "new-input": {
            label: "New input",
            callback: (e) => {
                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                const input = new Input({
                    x: e.clientX - INPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - INPUT_COMPONENT_CSS_SIZE / 2,
                });

                return SandboxManager.pushHistory(
                    () => {
                        Reified.active.add(input);

                        if (Reified.active.has(input)) {
                            input.attach();
                        }
                    },
                    () => {
                        Reified.active.delete(input);

                        input.detach();
                    },
                );
            },
        },
        "new-output": {
            label: "New output",
            callback: (e) => {
                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                const output = new Output({
                    x: e.clientX - OUTPUT_COMPONENT_CSS_SIZE / 2,
                    y: e.clientY - OUTPUT_COMPONENT_CSS_SIZE / 2,
                });

                return SandboxManager.pushHistory(
                    () => {
                        Reified.active.add(output);

                        if (Reified.active.has(output)) {
                            output.attach();
                        }
                    },
                    () => {
                        Reified.active.delete(output);

                        output.detach();
                    },
                );
            },
        },
    },
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

                SandboxManager.reset();

                SandboxManager.setup({
                    keybinds,
                    menu,
                    save: "sandbox",
                    initial: [components!, wires!],
                    overrideSaveIfExists: true,
                });

                StorageManager.set("saves:" + "sandbox", saveDiagram([...Reified.active], [...WiringManager.wires]));
            },
        },
    },
    ...(IN_DEBUG_MODE
        ? [
              {
                  STOP: {
                      label: "STOP RENDER",
                      callback: () => {
                          WiringManager.stop();
                      },
                  },
                  START: {
                      label: "START RENDER",
                      callback: () => {
                          WiringManager.start();
                      },
                  },
              },
          ]
        : []),
];
