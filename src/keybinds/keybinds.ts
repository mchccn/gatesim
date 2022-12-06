import { backspace } from "./backspace";
import { behavior } from "./behavior";
import { history } from "./history";
import { io } from "./io";
import { serde } from "./serde";

export const keybinds: Record<string, (e: KeyboardEvent) => void> = Object.assign(
    {},
    backspace,
    behavior,
    history,
    io,
    serde,
);
