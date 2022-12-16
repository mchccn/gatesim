import { IS_MAC_OS } from "../circular";
import { KeybindsManager } from "../managers/KeybindsManager";
import { SelectionManager } from "../managers/SelectionManager";
import { Reified } from "../reified/Reified";

export const select = {
    ...KeybindsManager.assign("Control+A", () => {
        if (IS_MAC_OS) return;

        Reified.active.forEach((component) => SelectionManager.addSelection(component));
    }),
    ...KeybindsManager.assign("Meta+A", () => {
        if (!IS_MAC_OS) return;

        Reified.active.forEach((component) => SelectionManager.addSelection(component));
    }),
} satisfies Record<string, (e: KeyboardEvent) => void>;
