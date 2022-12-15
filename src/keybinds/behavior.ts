import { GRID_SIZE, LIGHT_GRAY_CSS_COLOR, LOCKED_FOR_TESTING, TOAST_DURATION } from "../constants";
import { DraggingManager } from "../managers/DraggingManager";
import { SandboxManager } from "../managers/SandboxManager";
import { SelectionManager } from "../managers/SelectionManager";
import { TestingManager } from "../managers/TestingManager";
import { ToastManager } from "../managers/ToastManager";
import { Reified } from "../reified/Reified";

export const behavior = {
    ["ArrowLeft"]: () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        if (!SelectionManager.selected.size) return;

        const selected = SelectionManager.selected.clone(true);

        return SandboxManager.pushHistory(
            () => {
                selected.forEach((component) => {
                    component.move({ x: -GRID_SIZE, relative: true });
                });
            },
            () => {
                selected.forEach((component) => {
                    component.move({ x: GRID_SIZE, relative: true });
                });
            },
        );
    },
    ["ArrowRight"]: () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        if (!SelectionManager.selected.size) return;

        const selected = SelectionManager.selected.clone(true);

        return SandboxManager.pushHistory(
            () => {
                selected.forEach((component) => {
                    component.move({ x: GRID_SIZE, relative: true });
                });
            },
            () => {
                selected.forEach((component) => {
                    component.move({ x: -GRID_SIZE, relative: true });
                });
            },
        );
    },
    ["ArrowUp"]: () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        if (!SelectionManager.selected.size) return;

        const selected = SelectionManager.selected.clone(true);

        return SandboxManager.pushHistory(
            () => {
                selected.forEach((component) => {
                    component.move({ y: -GRID_SIZE, relative: true });
                });
            },
            () => {
                selected.forEach((component) => {
                    component.move({ y: GRID_SIZE, relative: true });
                });
            },
        );
    },
    ["ArrowDown"]: () => {
        if (TestingManager.testing) return LOCKED_FOR_TESTING();

        if (!SelectionManager.selected.size) return;

        const selected = SelectionManager.selected.clone(true);

        return SandboxManager.pushHistory(
            () => {
                selected.forEach((component) => {
                    component.move({ y: GRID_SIZE, relative: true });
                });
            },
            () => {
                selected.forEach((component) => {
                    component.move({ y: -GRID_SIZE, relative: true });
                });
            },
        );
    },
    ["KeyG"]: () => {
        const components = [...Reified.active];
        const positions = components.map(({ pos }) => pos);

        const size = GRID_SIZE;

        return SandboxManager.pushHistory(
            () => {
                DraggingManager.snapToGrid = !DraggingManager.snapToGrid;

                components.forEach((component) => {
                    component.move({
                        x: Math.floor(component.pos.x / size) * size,
                        y: Math.floor(component.pos.y / size) * size,
                    });
                });

                ToastManager.toast({
                    message: `Toggled snap to grid (now ${DraggingManager.snapToGrid}) [G].`,
                    color: LIGHT_GRAY_CSS_COLOR,
                    duration: TOAST_DURATION,
                });
            },
            () => {
                DraggingManager.snapToGrid = !DraggingManager.snapToGrid;

                components.forEach((component, i) => {
                    component.move(positions[i]);
                });
            },
        );
    },
} satisfies Record<string, (e: KeyboardEvent) => void>;
