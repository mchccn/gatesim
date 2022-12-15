import { KeybindsManager } from "../managers/KeybindsManager";
import { ModalManager } from "../managers/ModalManager";
import { SettingsManager } from "../managers/SettingsManager";
import { StorageManager } from "../managers/StorageManager";
import { html } from "../reified/Reified";

export const howtouse = {
    ...KeybindsManager.assign("Shift+Slash", async () => {
        //TODO: add stuff
        await ModalManager.popup(html`
            <div>
                <h1>gatesim</h1>
            </div>
        `);

        StorageManager.set("usedhelp", "true");
    }),
    ["Backslash"]: async () => {
        await SettingsManager.bringUpForm();
    },
} satisfies Record<string, (e: KeyboardEvent) => void>;
