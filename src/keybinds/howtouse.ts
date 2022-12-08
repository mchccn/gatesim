import { KeybindsManager } from "../managers/KeybindsManager";

export const howtouse = {
    ...KeybindsManager.assign("Shift+Slash", () => {
        console.log("YES");
    }),
} satisfies Record<string, (e: KeyboardEvent) => void>;
