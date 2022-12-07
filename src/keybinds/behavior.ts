import { LIGHT_GRAY_CSS_COLOR, TOAST_DURATION } from "../constants";
import { DraggingManager } from "../managers/DraggingManager";
import { SandboxManager } from "../managers/SandboxManager";
import { ToastManager } from "../managers/ToastManager";

export const behavior = {
    KeyG: async () => {
        //
        return SandboxManager.pushHistory(
            () => {
                DraggingManager.snapToGrid = !DraggingManager.snapToGrid;

                ToastManager.toast({
                    message: `Toggled snap to grid (now ${DraggingManager.snapToGrid}) [G].`,
                    color: LIGHT_GRAY_CSS_COLOR,
                    duration: TOAST_DURATION,
                });
            },
            () => {
                DraggingManager.snapToGrid = !DraggingManager.snapToGrid;
            },
        );
    },
} satisfies Record<string, (e: KeyboardEvent) => void>;
