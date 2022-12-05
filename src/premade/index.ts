import { keybinds } from "../keybinds/keybinds";
import { SandboxManager } from "../managers/SandboxManager";
import { menu } from "../menu/menu";
import { example } from "./example";
import { nand } from "./nand";

export const premade = new Map<string, (ctx: { name: string }) => void>([
    ...Object.entries(example),
    ["sandbox", () => SandboxManager.setup({ keybinds, menu, save: "sandbox" })],
    ...Object.entries(nand),
]);
