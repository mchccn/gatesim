import * as circular from "./circular";
import * as constants from "./constants";
import { ACTIVATED_CSS_COLOR, TOAST_DURATION } from "./constants";
import { menu } from "./contextmenu/menu";
import { fromFile } from "./files";
import { keybinds } from "./keybinds/keybinds";
import { SandboxManager } from "./managers/SandboxManager";
import { ToastManager } from "./managers/ToastManager";
import { premade } from "./premade";
import { attachStyles } from "./styling/attacher";

Object.assign(globalThis, constants, circular);

await attachStyles([
    "style",
    "component",
    "io",
    "contextmenu",
    "toast",
    "modals",
    "buttons",
    "darkmode",
    "quickpick",
    "settings",
]);

const hrefAsUrl = new URL(location.href);

const shouldLoadInline = hrefAsUrl.searchParams.get("inline");

if (shouldLoadInline) {
    try {
        const inlined = atob(shouldLoadInline);

        const {
            error,
            result: [settings, components, wirings],
        } = fromFile(inlined);

        if (error) throw new Error(error);

        SandboxManager.setup({ keybinds, menu, initial: [components!, wirings!] });

        SandboxManager.applyRawSettings(settings!);
    } catch {
        SandboxManager.setup({ keybinds, menu, save: "sandbox" });

        ToastManager.toast({
            message: "Diagram is not correctly encoded.",
            color: ACTIVATED_CSS_COLOR,
            duration: TOAST_DURATION,
        });

        hrefAsUrl.searchParams.delete("inline");

        history.pushState(undefined, "", hrefAsUrl);
    }
} else {
    const save = hrefAsUrl.searchParams.get("save");

    if (save) {
        SandboxManager.setup({ keybinds, menu, save });
    } else {
        const shouldLoadPremade = hrefAsUrl.searchParams.get("premade");

        if (shouldLoadPremade && premade.has(shouldLoadPremade.trim().toLowerCase())) {
            premade.get(shouldLoadPremade.trim().toLowerCase())!({ name: shouldLoadPremade.trim().toLowerCase() });
        } else {
            SandboxManager.setup({ keybinds, menu, save: "sandbox" });

            if (shouldLoadPremade) {
                ToastManager.toast({
                    message: "No premades were found with that name.",
                    color: ACTIVATED_CSS_COLOR,
                    duration: TOAST_DURATION,
                });

                hrefAsUrl.searchParams.delete("premade");

                history.pushState(undefined, "", hrefAsUrl);
            }
        }
    }
}
