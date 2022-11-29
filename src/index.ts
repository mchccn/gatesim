import { ACTIVATED_CSS_COLOR } from "./constants";
import { keybinds } from "./keybinds";
import { SandboxManager } from "./managers/SandboxManager";
import { ToastManager } from "./managers/ToastManager";
import { menu } from "./menu";
import { premade } from "./premade";
import { loadStyles } from "./styles";

await loadStyles();

const shouldLoadPremade = new URL(location.href).searchParams.get("premade");

if (shouldLoadPremade && premade.has(shouldLoadPremade.trim().toLowerCase())) {
    premade.get(shouldLoadPremade.trim().toLowerCase())!();
} else {
    SandboxManager.setup({ keybinds, menu, save: "sandbox" });

    if (shouldLoadPremade) {
        ToastManager.toast({
            message: "No premades were found with that name.",
            color: ACTIVATED_CSS_COLOR,
            duration: 2500,
        });

        const url = new URL(location.href);

        url.searchParams.delete("premade");

        history.pushState(undefined, "", url);
    }
}
