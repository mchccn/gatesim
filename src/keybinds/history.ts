import { IS_MAC_OS } from "../constants";
import { KeybindsManager } from "../managers/KeybindsManager";
import { SandboxManager } from "../managers/SandboxManager";

const undo = () => {
    SandboxManager.popHistory();
};

const redo = () => {
    SandboxManager.redoHistory();
};

export const history = {
    ...KeybindsManager.assign("Control+Shift+Z", () => {
        if (IS_MAC_OS) return;

        redo();
    }),
    ...KeybindsManager.assign("Meta+Shift+Z", () => {
        if (!IS_MAC_OS) return;

        redo();
    }),
    ...KeybindsManager.assign("Control+Z", () => {
        if (IS_MAC_OS) return;

        undo();
    }),
    ...KeybindsManager.assign("Meta+Z", () => {
        if (!IS_MAC_OS) return;

        undo();
    }),
} satisfies Record<string, (e: KeyboardEvent) => void>;
