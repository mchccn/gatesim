import { IS_MAC_OS } from "../constants";
import { KeybindsManager } from "../managers/KeybindsManager";
import { SandboxManager } from "../managers/SandboxManager";

const undo = (e: KeyboardEvent) => {
    SandboxManager.popHistory();
};

const redo = (e: KeyboardEvent) => {
    SandboxManager.redoHistory();
};

export const history = {
    ...KeybindsManager.assign("Control+Shift+Z", (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    }),
    ...KeybindsManager.assign("Meta+Shift+Z", (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    }),
    ...KeybindsManager.assign("Control+Z", (e) => {
        if (IS_MAC_OS) return;

        undo(e);
    }),
    ...KeybindsManager.assign("Meta+Z", (e) => {
        if (!IS_MAC_OS) return;

        undo(e);
    }),
} satisfies Record<string, (e: KeyboardEvent) => void>;
