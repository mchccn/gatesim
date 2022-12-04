import {
    ACTIVATED_CSS_COLOR,
    INPUT_COMPONENT_CSS_SIZE,
    IN_DEBUG_MODE,
    LIGHT_GRAY_CSS_COLOR,
    LOCKED_FOR_TESTING,
    ORIGIN_POINT,
    OUTPUT_COMPONENT_CSS_SIZE,
    TOAST_DURATION,
} from "./constants";
import { fromFile, saveDiagram } from "./files";
import { keybinds } from "./keybinds";
import { MenuManagerActions } from "./managers/MenuManager";
import { ModalManager } from "./managers/ModalManager";
import { SandboxManager } from "./managers/SandboxManager";
import { SelectionManager } from "./managers/SelectionManager";
import { StorageManager } from "./managers/StorageManager";
import { TestingManager } from "./managers/TestingManager";
import { ToastManager } from "./managers/ToastManager";
import { WiringManager } from "./managers/WiringManager";
import { chips } from "./reified/chips";
import { Component } from "./reified/Component";
import { Display } from "./reified/Display";
import { Input } from "./reified/Input";
import { Output } from "./reified/Output";
import { Reified } from "./reified/Reified";

export const menu: MenuManagerActions = [
    {
        "insert-component": {
            label: "Insert component",
            callback: async (e) => {
                if (TestingManager.testing) return LOCKED_FOR_TESTING();

                const name = await ModalManager.prompt("Enter the component's name:");

                if (typeof name !== "string") return;

                const chip = chips.get(name.toUpperCase());

                const component = chip
                    ? new Component(Reflect.construct(chip, []), ORIGIN_POINT)
                    : name.toUpperCase() === "DISPLAY"
                    ? new Display()
                    : undefined;

                if (!component) return ModalManager.alert("No component was found with that name.");

                const selection = SelectionManager.selected.clone(true);

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

                            SelectionManager.select(component);
                        }
                    },
                    () => {
                        Reified.active.delete(component);

                        component.detach();

                        SelectionManager.selected = selection;
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

                const selection = SelectionManager.selected.clone(true);

                return SandboxManager.pushHistory(
                    () => {
                        Reified.active.add(input);

                        if (Reified.active.has(input)) {
                            input.attach();

                            SelectionManager.select(input);
                        }
                    },
                    () => {
                        Reified.active.delete(input);

                        input.detach();

                        SelectionManager.selected = selection;
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

                const selection = SelectionManager.selected.clone(true);

                return SandboxManager.pushHistory(
                    () => {
                        Reified.active.add(output);

                        if (Reified.active.has(output)) {
                            output.attach();

                            SelectionManager.select(output);
                        }
                    },
                    () => {
                        Reified.active.delete(output);

                        output.detach();

                        SelectionManager.selected = selection;
                    },
                );
            },
        },
    },
    {
        "copy-url": {
            label: "Copy link",
            callback: () => {
                const hrefAsUrl = new URL(location.href);

                hrefAsUrl.searchParams.set("inline", btoa(saveDiagram([...Reified.active], [...WiringManager.wires])));

                navigator.clipboard.writeText(hrefAsUrl.href);
            },
        },
        "save-to": {
            label: "Save with name",
            callback: async () => {
                const save = await ModalManager.prompt("What should be the name of this save?");

                if (typeof save !== "string") return;

                await SandboxManager.saveTo(save);

                const hrefAsUrl = new URL(location.href);

                hrefAsUrl.searchParams.set("save", save);

                history.pushState(undefined, "", hrefAsUrl);
            },
        },
        "load-from": {
            label: "Load from saves",
            callback: async () => {
                const save = await ModalManager.prompt("Which save would you like to load?");

                if (typeof save !== "string") return;

                if (!StorageManager.has("saves:" + save))
                    return ModalManager.alert("No save was found with that name.");

                SandboxManager.reset();

                SandboxManager.setup({ keybinds, menu, save });

                const hrefAsUrl = new URL(location.href);

                hrefAsUrl.searchParams.set("save", save);

                history.pushState(undefined, "", hrefAsUrl);
            },
        },
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
                        duration: TOAST_DURATION,
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
                        duration: TOAST_DURATION,
                    });

                const {
                    error,
                    result: [components, wires],
                } = fromFile(raw);

                if (error)
                    return ToastManager.toast({
                        message: error,
                        color: ACTIVATED_CSS_COLOR,
                        duration: TOAST_DURATION,
                    });

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
                  "test-alert": {
                      label: "Test alert",
                      callback: async () => {
                          console.log(await ModalManager.alert("This is an alert."));
                      },
                  },
                  "test-confirm": {
                      label: "Test confirm",
                      callback: async () => {
                          console.log(await ModalManager.confirm("This is a confirmation."));
                      },
                  },
                  "test-prompt": {
                      label: "Test prompt",
                      callback: async () => {
                          console.log(await ModalManager.prompt("This is a prompt."));
                      },
                  },
                  "test-toast": {
                      label: "Test toast",
                      callback: async () => {
                          console.log(
                              await ToastManager.toast({
                                  message: "This is a toast.",
                                  color: LIGHT_GRAY_CSS_COLOR,
                                  duration: TOAST_DURATION,
                              }),
                          );
                      },
                  },
              },
              {
                  "wipe-storage": {
                      label: "Wipe storage",
                      callback: () => {
                          StorageManager.storage.clear();
                      },
                  },
                  "wipe-save": {
                      label: "Wipe named save",
                      callback: async () => {
                          const save = await ModalManager.prompt("");

                          if (save) {
                              if (!StorageManager.has("saves:" + save))
                                  return ToastManager.toast({
                                      message: "No saves exist with that name.",
                                      color: ACTIVATED_CSS_COLOR,
                                      duration: TOAST_DURATION,
                                  });

                              StorageManager.delete("saves:" + save);

                              location.reload();
                          }
                      },
                  },
              },
              {
                  "stop-render": {
                      label: "Stop rendering wires",
                      callback: () => {
                          WiringManager.stop();
                      },
                  },
                  "start-render": {
                      label: "Start rendering wires",
                      callback: () => {
                          WiringManager.start();
                      },
                  },
              },
          ]
        : []),
];
