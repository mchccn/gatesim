import { LOCKED_FOR_TESTING } from "../constants";
import { KeybindsManager } from "../managers/KeybindsManager";
import { SandboxManager } from "../managers/SandboxManager";
import { SelectionManager } from "../managers/SelectionManager";
import { TestingManager } from "../managers/TestingManager";
import { Component } from "../reified/Component";
import { Display } from "../reified/Display";

export const rotate = {
    ...KeybindsManager.assign("Shift+R", () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        if (!SelectionManager.selected.size) return;

        const selected = SelectionManager.selected.clone(true);

        return SandboxManager.pushHistory(
            () => {
                selected.forEach((component) => {
                    if (component instanceof Component || component instanceof Display) {
                        component.angle -= 90;
                    }
                });
            },
            () => {
                selected.forEach((component) => {
                    if (component instanceof Component || component instanceof Display) {
                        component.angle += 90;
                    }
                });
            },
        );
    }),
    ["KeyR"]: () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        if (!SelectionManager.selected.size) return;

        const selected = SelectionManager.selected.clone(true);

        return SandboxManager.pushHistory(
            () => {
                selected.forEach((component) => {
                    if (component instanceof Component || component instanceof Display) {
                        component.angle += 90;
                    }
                });
            },
            () => {
                selected.forEach((component) => {
                    if (component instanceof Component || component instanceof Display) {
                        component.angle -= 90;
                    }
                });
            },
        );
    },
} satisfies Record<string, (e: KeyboardEvent) => void>;
