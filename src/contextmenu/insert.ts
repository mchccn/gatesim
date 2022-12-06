import { LOCKED_FOR_TESTING, ORIGIN_POINT } from "../constants";
import { MenuManagerAction } from "../managers/MenuManager";
import { ModalManager } from "../managers/ModalManager";
import { SandboxManager } from "../managers/SandboxManager";
import { SelectionManager } from "../managers/SelectionManager";
import { TestingManager } from "../managers/TestingManager";
import { chips } from "../reified/chips";
import { Component } from "../reified/Component";
import { Display } from "../reified/Display";
import { Reified } from "../reified/Reified";

export const insert = {
    "insert-component": {
        label: "Insert component",
        keybind: "A",
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
} satisfies MenuManagerAction;
