import { keybinds } from "../keybinds";
import { SandboxManager } from "../managers/SandboxManager";
import { menu } from "../menu";
import { nands } from "./nands";

export const premade = new Map<string, (ctx: { name: string }) => void>([
    ["sandbox", () => SandboxManager.setup({ keybinds, menu, save: "sandbox" })],
    ...Object.entries(nands),
]);
