import { IS_MAC_OS } from "../circular";
import { ACTIVATED_CSS_COLOR, TOAST_DURATION } from "../constants";
import { fromFile, saveDiagram } from "../files";
import { keybinds } from "../keybinds/keybinds";
import type { MenuManagerAction } from "../managers/MenuManager";
import { ModalManager } from "../managers/ModalManager";
import { SandboxManager } from "../managers/SandboxManager";
import { StorageManager } from "../managers/StorageManager";
import { ToastManager } from "../managers/ToastManager";
import { WiringManager } from "../managers/WiringManager";
import { Reified } from "../reified/Reified";
import { menu } from "./menu";

export const serde = {
    "save-to": {
        label: "Save with name",
        keybind: IS_MAC_OS ? "⌘ S" : "Ctrl S",
        callback: async () => {
            const save = await ModalManager.prompt("What should be the name of this save?");

            if (typeof save !== "string") return;

            await SandboxManager.saveTo(save);

            const hrefAsUrl = new URL(location.href);

            hrefAsUrl.searchParams.set("save", save);

            history.pushState(undefined, "", hrefAsUrl);
        },
    },
    "load-from": {
        label: "Load from saves",
        keybind: IS_MAC_OS ? "⌘ O" : "Ctrl O",
        callback: async () => {
            const save = await ModalManager.prompt("Which save would you like to load?");

            if (typeof save !== "string") return;

            if (!StorageManager.has("saves:" + save)) return ModalManager.alert("No save was found with that name.");

            SandboxManager.reset();

            SandboxManager.setup({ keybinds, menu, save });

            const hrefAsUrl = new URL(location.href);

            hrefAsUrl.searchParams.set("save", save);

            history.pushState(undefined, "", hrefAsUrl);
        },
    },
    "save-as": {
        label: "Save as file",
        keybind: IS_MAC_OS ? "⬆ ⌘ S" : "Ctrl Shift S",
        callback: () => {
            Object.assign(document.createElement("a"), {
                href: URL.createObjectURL(
                    new Blob([saveDiagram([...Reified.active], [...WiringManager.wires])], {
                        type: "application/json",
                    }),
                ),
                download: `${SandboxManager.savedName ?? "sandbox"}.gatesim.json`,
            }).click();
        },
    },
    "import-from": {
        label: "Import from file",
        keybind: IS_MAC_OS ? "⬆ ⌘ O" : "Ctrl Shift O",
        callback: async () => {
            const input = Object.assign(document.createElement("input"), { type: "file" });

            input.click();

            const file = await new Promise<File | undefined>((resolve) => {
                input.onchange = () => resolve(input.files?.[0] ?? undefined);

                input.onerror = () => resolve(undefined);
            });

            if (!file)
                return ToastManager.toast({
                    message: "No file was provided.",
                    color: ACTIVATED_CSS_COLOR,
                    duration: TOAST_DURATION,
                });

            const reader = new FileReader();

            reader.readAsText(file);

            const raw = await new Promise<string | undefined>((resolve) => {
                reader.onload = () => resolve(reader.result?.toString() ?? undefined);

                reader.onerror = () => resolve(undefined);
            });

            if (!raw)
                return ToastManager.toast({
                    message: "Unable to read the file.",
                    color: ACTIVATED_CSS_COLOR,
                    duration: TOAST_DURATION,
                });

            const {
                error,
                result: [settings, components, wires],
            } = fromFile(raw);

            if (error)
                return ToastManager.toast({
                    message: error,
                    color: ACTIVATED_CSS_COLOR,
                    duration: TOAST_DURATION,
                });

            SandboxManager.reset();

            const save = file.name.split(".").slice(0, -1).join(".");

            SandboxManager.setup({
                keybinds,
                menu,
                save: save.endsWith(".gatesim") ? save.slice(0, -".gatesim".length) : save,
                initial: [components!, wires!],
                overrideSaveIfExists: true,
                settings: {},
            });

            SandboxManager.applyRawSettings(settings!);

            SandboxManager.forceSave();
        },
    },
} satisfies MenuManagerAction;
