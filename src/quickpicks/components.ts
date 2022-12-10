import { insert } from "../contextmenu/insert";
import { io } from "../contextmenu/io";
import { QuickPickManager } from "../managers/QuickPickManager";

export const quickpickComponents = (e: MouseEvent) =>
    QuickPickManager.activate(e, [
        {
            label: "Display",
            callback(e) {
                insert["insert-component"].callback.call(undefined, e, "DISPLAY");
            },
        },
        {
            label: "Output",
            callback(e) {
                io["new-output"].callback.call(undefined, e);
            },
        },
        {
            label: "Input",
            callback(e) {
                io["new-input"].callback.call(undefined, e);
            },
        },
    ]);
