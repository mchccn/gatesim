import { GRID_SIZE, LIGHT_GRAY_CSS_COLOR, TOAST_DURATION } from "../constants";
import { DraggingManager } from "../managers/DraggingManager";
import { SandboxManager } from "../managers/SandboxManager";
import { ToastManager } from "../managers/ToastManager";
import { Reified } from "../reified/Reified";

export const behavior = {
    ["KeyG"]: async () => {
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
