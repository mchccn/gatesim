import { keybinds } from "../keybinds";
import { SandboxManager } from "../managers/SandboxManager";
import { menu } from "../menu";

export const premade = new Map<string, () => void>([
    ["sandbox", () => SandboxManager.setup({ keybinds, menu, save: "sandbox" })],
]);
