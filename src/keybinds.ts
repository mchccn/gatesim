import { IS_MAC_OS } from "./constants";
import { SandboxManager } from "./managers/SandboxManager";

const undo = (e: KeyboardEvent) => {
    SandboxManager.popHistory();
};

const redo = (e: KeyboardEvent) => {
    SandboxManager.redoHistory();
};

export const keybinds: Record<string, (e: KeyboardEvent) => void> = {
    "ControlLeft+ShiftLeft+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    },
    "ControlLeft+ShiftRight+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    },
    "ControlRight+ShiftLeft+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    },
    "ControlRight+ShiftRight+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        redo(e);
    },
    "MetaLeft+ShiftLeft+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    },
    "MetaLeft+ShiftRight+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    },
    "MetaRight+ShiftLeft+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    },
    "MetaRight+ShiftRight+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        redo(e);
    },
    "ControlLeft+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        undo(e);
    },
    "ControlRight+KeyZ": (e) => {
        if (IS_MAC_OS) return;

        undo(e);
    },
    "MetaLeft+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        undo(e);
    },
    "MetaRight+KeyZ": (e) => {
        if (!IS_MAC_OS) return;

        undo(e);
    },
};
