import { backspace } from "./backspace";
import { behavior } from "./behavior";
import { history } from "./history";
import { howtouse } from "./howtouse";
import { io } from "./io";
import { select } from "./select";
import { serde } from "./serde";

export const keybinds: Record<string, (e: KeyboardEvent) => void> = Object.assign(
    {},
    backspace,
    behavior,
    history,
    howtouse,
    io,
    select,
    serde,
);
