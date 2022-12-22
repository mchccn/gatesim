import { LOCKED_FOR_TESTING, ORIGIN_POINT } from "../constants";
import type { MenuManagerAction } from "../managers/MenuManager";
import { ModalManager } from "../managers/ModalManager";
import { SandboxManager } from "../managers/SandboxManager";
import { SelectionManager } from "../managers/SelectionManager";
import { TestingManager } from "../managers/TestingManager";
import { Component } from "../reified/Component";
import { Display } from "../reified/Display";
import { Reified } from "../reified/Reified";
import { SevenSegmentDisplay } from "../reified/SevenSegmentDisplay";
import { chips } from "../reified/chips";

export const componentNameMap = new Map<string, () => Reified>([
    ["DISPLAY", () => new Display()],
    ["7SEG", () => new SevenSegmentDisplay()],
    ["7SD", () => new SevenSegmentDisplay()],
    ["SEVEN_SEG", () => new SevenSegmentDisplay()],
    ["SEVEN_SEGMENT_DISPLAY", () => new SevenSegmentDisplay()],
]);

export const insert = {
    "insert-component": {
        label: "Insert component",
        keybind: "A",
        callback: async (e, n?: string) => {
            if (TestingManager.testing) return LOCKED_FOR_TESTING();

            const name = typeof n === "string" ? n : await ModalManager.prompt("Enter the component's name:");

            if (typeof name !== "string" || !name.trim()) return;

            const chip = chips.get(name.toUpperCase());

            const componentName = name.toUpperCase();

            const component = chip
                ? new Component(Reflect.construct(chip, []), ORIGIN_POINT)
                : componentNameMap.get(componentName)?.();

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
