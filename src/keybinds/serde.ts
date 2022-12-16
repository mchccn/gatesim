import { IS_MAC_OS } from "../circular";
import { serde as menu } from "../contextmenu/serde";
import { KeybindsManager } from "../managers/KeybindsManager";
import { ToolsManager } from "../managers/ToolsManager";

export const serde = {
    ...KeybindsManager.assign("Control+K", (e) => {
        if (IS_MAC_OS) return;

        e.preventDefault();

        ToolsManager.actions[0]["copy-url"].callback();
    }),
    ...KeybindsManager.assign("Meta+K", (e) => {
        if (!IS_MAC_OS) return;

        e.preventDefault();

        ToolsManager.actions[0]["copy-url"].callback();
    }),
    ...KeybindsManager.assign("Control+S", (e) => {
        if (IS_MAC_OS) return;

        e.preventDefault();

        menu["save-to"].callback();
    }),
    ...KeybindsManager.assign("Meta+S", (e) => {
        if (!IS_MAC_OS) return;

        e.preventDefault();

        menu["save-to"].callback();
    }),
    ...KeybindsManager.assign("Control+O", (e) => {
        if (IS_MAC_OS) return;

        e.preventDefault();

        menu["load-from"].callback();
    }),
    ...KeybindsManager.assign("Meta+O", (e) => {
        if (!IS_MAC_OS) return;

        e.preventDefault();

        menu["load-from"].callback();
    }),
    ...KeybindsManager.assign("Control+Shift+S", (e) => {
        if (IS_MAC_OS) return;

        e.preventDefault();

        menu["save-as"].callback();
    }),
    ...KeybindsManager.assign("Meta+Shift+S", (e) => {
        if (!IS_MAC_OS) return;

        e.preventDefault();

        menu["save-as"].callback();
    }),
    ...KeybindsManager.assign("Control+Shift+O", (e) => {
        if (IS_MAC_OS) return;

        e.preventDefault();

        menu["import-from"].callback();
    }),
    ...KeybindsManager.assign("Meta+Shift+O", (e) => {
        if (!IS_MAC_OS) return;

        e.preventDefault();

        menu["import-from"].callback();
    }),
} satisfies Record<string, (e: KeyboardEvent) => void>;
