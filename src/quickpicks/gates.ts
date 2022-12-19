import { ORIGIN_POINT } from "../constants";
import { QuickPickManager } from "../managers/QuickPickManager";
import { SandboxManager } from "../managers/SandboxManager";
import { SelectionManager } from "../managers/SelectionManager";
import { Component } from "../reified/Component";
import { Reified } from "../reified/Reified";
import { gates } from "../reified/chips";

export const quickpickGates = (e: MouseEvent) =>
    QuickPickManager.activate(
        e,
        gates.map((gate) => ({
            label: gate.NAME,
            callback(e) {
                const component = new Component(Reflect.construct(gate, []), ORIGIN_POINT);

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
        })),
    );
