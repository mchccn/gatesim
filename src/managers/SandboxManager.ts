import { ACTIVATED_CSS_COLOR } from "../constants";
import { fromFile, saveDiagram } from "../files";
import { html, Reified } from "../reified/Reified";
import { DraggingManager } from "./DraggingManager";
import { KeybindsManager } from "./KeybindsManager";
import { MenuManager, MenuManagerActions } from "./MenuManager";
import { MouseManager } from "./MouseManager";
import { StorageManager } from "./StorageManager";
import { ToastManager } from "./ToastManager";
import { Wiring, WiringManager } from "./WiringManager";

type SandboxConfig = {
    keybinds?: Record<string, (e: KeyboardEvent) => void>;
    menu?: MenuManagerActions;
    initial?: [components: Reified[], wires: Wiring[]];
    limits?: ({ type: "INPUT" | "OUTPUT"; count: number } | { type: "COMPONENT"; name?: string; count: number })[];
    states?: { inputs?: boolean[]; outputs?: boolean[]; callback: () => void }[];
    save?: string;
    overrideSaveIfExists?: boolean;
};

export class SandboxManager {
    static queueNewContext: ReturnType<typeof MenuManager["use"]>[0];

    static watchedUnresolvedPromises = new Set<() => void>();

    static #observer: MutationObserver | undefined;

    static #history = new Array<[command: () => void, redo: () => void]>();
    static #redos = new Array<[command: () => void, redo: () => void]>();

    static setup(config: SandboxConfig) {
        document.body.innerHTML = "";

        document.body.appendChild(html`<div class="modal-container modal-inactive"></div>`);
        document.body.appendChild(html`<div class="reified-root"></div>`);
        document.body.appendChild(html`<canvas></canvas>`);
        document.body.appendChild(html`<div class="toasts-container"></div>`);

        MouseManager.start();
        KeybindsManager.listen();
        DraggingManager.listen();
        WiringManager.start();

        if (typeof config.menu !== "undefined") [this.queueNewContext] = MenuManager.use(Reified.root, config.menu);

        if (typeof config.keybinds !== "undefined")
            Object.entries(config.keybinds).forEach(([chord, run]) => KeybindsManager.onKeyChord(chord, run));

        if (typeof config.initial !== "undefined") {
            this.clear();

            Reified.active = new Set(config.initial[0]);

            Reified.active.forEach((component) => component.attach());

            WiringManager.wires = new Set(config.initial[1]);
        }

        if (typeof config.save !== "undefined") {
            const file = StorageManager.get<string>("saves:" + config.save);

            if (file) {
                const {
                    error,
                    result: [components, wires],
                } = fromFile(file);

                if (error) {
                    ToastManager.toast({
                        message: "Unable to read from saves.",
                        color: ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });
                } else {
                    if (!config.overrideSaveIfExists) {
                        this.clear();

                        Reified.active = new Set(components);

                        Reified.active.forEach((component) => component.attach());

                        WiringManager.wires = new Set(wires);
                    }

                    StorageManager.set(
                        "saves:" + config.save,
                        saveDiagram([...Reified.active], [...WiringManager.wires]),
                    );
                }
            }
        }

        //TODO: Implement undo/redo
        this.#observer = new MutationObserver(() => {
            if (typeof config.save !== "undefined")
                StorageManager.set("saves:" + config.save, saveDiagram([...Reified.active], [...WiringManager.wires]));
        });

        this.#observer.observe(Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });

        //TODO: Implement limits
        //TODO: Implement diagram state check callbacks
    }

    static reset() {
        if (this.#observer) {
            this.#observer.disconnect();

            this.#observer = undefined;
        }

        MouseManager.reset();
        KeybindsManager.reset();
        DraggingManager.reset();
        WiringManager.stop();

        MenuManager.remove(Reified.root);

        this.clear();

        this.watchedUnresolvedPromises.forEach((finish) => finish.call(undefined));

        this.watchedUnresolvedPromises.clear();

        document.body.innerHTML = "";
    }

    static clear() {
        Reified.active.forEach((component) => component.detach());

        WiringManager.wires.forEach((wire) => wire.destroy());
    }

    static pushHistory(command: () => void, undo: () => void) {
        this.#redos.length = 0;

        this.#history.push([command, undo]);
    }

    static popHistory() {
        if (!this.#history.length)
            return void ToastManager.toast({
                message: "Nothing to undo.",
                color: ACTIVATED_CSS_COLOR,
                duration: 2500,
            });

        const [redo, undo] = this.#history.pop()!;

        this.#redos.push([redo, undo]);

        return undo.call(undefined);
    }

    static redoHistory() {
        if (!this.#redos.length)
            return void ToastManager.toast({
                message: "Nothing to redo.",
                color: ACTIVATED_CSS_COLOR,
                duration: 2500,
            });

        const [command, undo] = this.#redos.pop()!;

        this.#history.push([command, undo]);

        return command.call(undefined);
    }
}
