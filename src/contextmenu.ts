import { MenuManager } from "./MenuManager";
import { Reified } from "./Reified";

export const [queueNewContext] = MenuManager.use(Reified.root, [
    {
        "insert-chip": {
            label: "Insert chip",
            callback: () => {},
        },
    },
    {
        "new-input": {
            label: "New input",
            callback: () => {},
        },
        "new-output": {
            label: "New output",
            callback: () => {},
        },
    },
    {
        "new-chip": {
            label: "New chip from diagram",
            callback: () => {},
        },
    },
    {
        "save-as": {
            label: "Save as file",
            callback: () => {},
        },
        "import-from": {
            label: "Import from file",
            callback: () => {},
        },
    },
]);
