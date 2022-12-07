import { IS_MAC_OS, LOCKED_FOR_TESTING } from "../constants";
import { KeybindsManager } from "../managers/KeybindsManager";
import { SandboxManager } from "../managers/SandboxManager";
import { SelectionManager } from "../managers/SelectionManager";
import { TestingManager } from "../managers/TestingManager";
import { Wiring, WiringManager } from "../managers/WiringManager";
import { Component } from "../reified/Component";
import { Display } from "../reified/Display";
import { Input } from "../reified/Input";
import { Output } from "../reified/Output";
import { Reified } from "../reified/Reified";

export const backspace = {
    ...KeybindsManager.assign("Control+X", () => {
        if (IS_MAC_OS) return;

        backspace["Backspace"]();
    }),
    ...KeybindsManager.assign("Meta+X", () => {
        if (!IS_MAC_OS) return;

        backspace["Backspace"]();
    }),
    ...KeybindsManager.assign("Control+Shift+X", () => {
        if (IS_MAC_OS) return;

        backspace["Shift+Backspace"]();
    }),
    ...KeybindsManager.assign("Meta+Shift+X", () => {
        if (!IS_MAC_OS) return;

        backspace["Shift+Backspace"]();
    }),
    ...KeybindsManager.assign("Shift+Backspace", () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        if (!SelectionManager.selected.size) return;

        const selected = SelectionManager.selected.clone(true);
        const deleted: [from: Element, to: Element][] = [];

        return SandboxManager.pushHistory(
            () => {
                selected.forEach((component) => {
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
                    } else if (component instanceof Component || component instanceof Display) {
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
            },
            () => {
                WiringManager.wires.addAll(deleted.splice(0, deleted.length).map(([from, to]) => new Wiring(from, to)));

                SelectionManager.selected = selected.clone(true);
            },
        );
    }),
    ["Backspace"]: () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        if (!SelectionManager.selected.size) return;

        const selected = SelectionManager.selected.clone(true);
        const deleted: [from: Element, to: Element][] = [];

        return SandboxManager.pushHistory(
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
                    } else if (component instanceof Component || component instanceof Display) {
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

                SelectionManager.selected = selected.clone(true);
            },
        );
    },
} satisfies Record<string, (e: KeyboardEvent) => void>;
