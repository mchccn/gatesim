import { keybinds } from "./keybinds";
import { SandboxManager } from "./managers/SandboxManager";
import { menu } from "./menu";
import { loadStyles } from "./styles";

await loadStyles();

SandboxManager.setup({ keybinds, menu, save: "sandbox" });
