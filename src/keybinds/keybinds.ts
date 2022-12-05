import { backspace } from "./backspace";
import { behavior } from "./behavior";
import { history } from "./history";
import { io } from "./io";

export const keybinds: Record<string, (e: KeyboardEvent) => void> = Object.assign({}, history, behavior, io, backspace);
