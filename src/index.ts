import { keybinds } from "./keybinds";
import { SandboxManager } from "./managers/SandboxManager";
import { menu } from "./menu";

SandboxManager.setup({
    keybinds,
    menu,
    save: "sandbox",
    limits: { componentsTotal: 6, inputs: 2, outputs: 1, wirings: 4 },
});
