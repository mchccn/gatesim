import { keybinds } from "./keybinds";
import { SandboxManager } from "./managers/SandboxManager";
import { menu } from "./menu";

SandboxManager.setup({ keybinds, menu, save: "sandbox" });
