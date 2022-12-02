import { IS_MAC_OS } from "./constants";
import { SandboxManager } from "./managers/SandboxManager";
import { SelectionManager } from "./managers/SelectionManager";
import { Wiring, WiringManager } from "./managers/WiringManager";
import { Component } from "./reified/Component";
import { Input } from "./reified/Input";
import { Output } from "./reified/Output";
import { Reified } from "./reified/Reified";

const undo = (e: KeyboardEvent) => {
    SandboxManager.popHistory();
};

const redo = (e: KeyboardEvent) => {
    SandboxManager.redoHistory();
};

export const keybinds: Record<string, (e: KeyboardEvent) => void> = {
    "ControlLeft+ShiftLeft+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    },
    "ControlLeft+ShiftRight+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    },
    "ControlRight+ShiftLeft+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    },
    "ControlRight+ShiftRight+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    },
    "MetaLeft+ShiftLeft+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    },
    "MetaLeft+ShiftRight+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    },
    "MetaRight+ShiftLeft+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    },
    "MetaRight+ShiftRight+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    },
    "ControlLeft+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        undo(e);
    },
    "ControlRight+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        undo(e);
    },
    "MetaLeft+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        undo(e);
    },
    "MetaRight+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        undo(e);
    },
    Backspace: () => {
        const selected = SelectionManager.selected.clone();
        const deleted: [from: Element, to: Element][] = [];

        SandboxManager.pushHistory(
            () => {
                selected.forEach((component) => {
                    Reified.active.delete(component);

                    component.detach();

                    if (component instanceof Input) {
                        WiringManager.wires.forEach((wire) => {
                            if (wire.from === component.element) {
                                wire.destroy();

                                wire.to.classList.remove("activated");

                                deleted.push([wire.from, wire.to]);
                            }
                        });
                    } else if (component instanceof Output) {
                        WiringManager.wires.forEach((wire) => {
                            if (wire.to === component.element) {
                                wire.destroy();

                                deleted.push([wire.from, wire.to]);
                            }
                        });

                        component.element.classList.remove("activated");
                    } else if (component instanceof Component) {
                        WiringManager.wires.forEach((wire) => {
                            if (
                                component.inputs.some((i) => wire.to === i) ||
                                component.outputs.some((o) => wire.from === o)
                            ) {
                                wire.destroy();

                                wire.to.classList.remove("activated");

                                deleted.push([wire.from, wire.to]);
                            }
                        });

                        component.inputs.forEach((i) => i.classList.remove("activated"));
                    } else {
                        throw new Error("Unknown component type.");
                    }
                });

                SelectionManager.selected.clear();
            },
            () => {
                selected.forEach((component) => {
                    Reified.active.add(component);

                    component.attach();
                });

                WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new Wiring(from, to)));

                SelectionManager.selected = selected;
            },
        );
    },
};
