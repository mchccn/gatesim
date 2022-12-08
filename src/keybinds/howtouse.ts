import { KeybindsManager } from "../managers/KeybindsManager";

export const howtouse = {
    ...KeybindsManager.assign("Shift+Slash", () => {
        //TODO: Popup that says how to use this thing
    }),
} satisfies Record<string, (e: KeyboardEvent) => void>;
