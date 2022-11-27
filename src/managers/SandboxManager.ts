import { WatchedSet } from "../augments/WatchedSet";
import { ACTIVATED_CSS_COLOR } from "../constants";
import { fromFile, saveDiagram } from "../files";
import { Component } from "../reified/Component";
import { Input } from "../reified/Input";
import { Output } from "../reified/Output";
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
    limits?: {
        inputs?: number;
        outputs?: number;
        wirings?: number;
        chips?: Record<string, number>;
        chipsTotal?: number;
        componentsTotal?: number;
    };
    states?: { inputs?: boolean[]; outputs?: boolean[]; callback: () => void }[];
    save?: string;
    overrideSaveIfExists?: boolean;
};

const calculateReifiedTotals = (set: Set<Reified>) =>
    [...set].reduce(
        (map, item) => {
            if (item instanceof Input) {
                map.inputsTotal++;
            } else if (item instanceof Output) {
                map.outputsTotal++;
            } else if (item instanceof Component) {
                map.chipsTotal++;

                map.chips.set(item.chip.name, (map.chips.get(item.chip.name) ?? 0) + 1);
            } else {
                throw new Error("Unknown component type.");
            }

            return map;
        },
        {
            inputsTotal: 0,
            outputsTotal: 0,
            chipsTotal: 0,
            chips: new Map<string, number>(),
        },
    );

export class SandboxManager {
    static queueNewContext: ReturnType<typeof MenuManager["use"]>[0];

    static watchedUnresolvedPromises = new Set<() => void>();

    static #observer: MutationObserver | undefined;

    static #history = new Array<[command: () => void, redo: () => void]>();
    static #redos = new Array<[command: () => void, redo: () => void]>();

    static #config: SandboxConfig;

    static setup(config: SandboxConfig) {
        this.#config = config;

        document.body.innerHTML = "";

        document.body.appendChild(html`<div class="modal-container modal-inactive"></div>`);
        document.body.appendChild(html`<div class="reified-root"></div>`);
        document.body.appendChild(html`<canvas></canvas>`);
        document.body.appendChild(html`<div class="toasts-container"></div>`);

        MouseManager.start();
        KeybindsManager.listen();
        DraggingManager.listen();
        WiringManager.start();

        const createReifiedActive = (components: Reified[]) =>
            new WatchedSet<Reified>()
                .onAdd((item, set) => {
                    const totals = calculateReifiedTotals(set.clone().add(item));

                    if (
                        totals.chipsTotal + totals.inputsTotal + totals.outputsTotal >
                        (this.#config.limits?.componentsTotal ?? Infinity)
                    ) {
                        ToastManager.toast({
                            message: "Exceeded total components limit.",
                            color: ACTIVATED_CSS_COLOR,
                            duration: 2500,
                        });

                        return false;
                    }

                    if (totals.inputsTotal > (this.#config.limits?.inputs ?? Infinity)) {
                        ToastManager.toast({
                            message: "Exceeded total inputs limit.",
                            color: ACTIVATED_CSS_COLOR,
                            duration: 2500,
                        });

                        return false;
                    }

                    if (totals.outputsTotal > (this.#config.limits?.outputs ?? Infinity)) {
                        ToastManager.toast({
                            message: "Exceeded total outputs limit.",
                            color: ACTIVATED_CSS_COLOR,
                            duration: 2500,
                        });

                        return false;
                    }

                    if (totals.chipsTotal > (this.#config.limits?.chipsTotal ?? Infinity)) {
                        ToastManager.toast({
                            message: "Exceeded total chips limit.",
                            color: ACTIVATED_CSS_COLOR,
                            duration: 2500,
                        });

                        return false;
                    }

                    if (
                        item instanceof Component &&
                        totals.chips.has(item.chip.name) &&
                        totals.chips.get(item.chip.name)! > (this.#config.limits?.chips?.[item.chip.name] ?? Infinity)
                    ) {
                        ToastManager.toast({
                            message: `Exceeded total '${item.chip.name}' limit.`,
                            color: ACTIVATED_CSS_COLOR,
                            duration: 2500,
                        });

                        return false;
                    }

                    return true;
                })
                .addAll(components);

        const createWiringsSet = (wirings: Wiring[]) =>
            new WatchedSet<Wiring>()
                .onAdd((_, set) => {
                    if (set.size + 1 > (this.#config.limits?.wirings ?? Infinity)) {
                        ToastManager.toast({
                            message: "Exceeded total wirings limit.",
                            color: ACTIVATED_CSS_COLOR,
                            duration: 2500,
                        });

                        return false;
                    }

                    return true;
                })
                .addAll(wirings);

        if (typeof this.#config.menu !== "undefined")
            [this.queueNewContext] = MenuManager.use(Reified.root, this.#config.menu);

        if (typeof this.#config.keybinds !== "undefined")
            Object.entries(this.#config.keybinds).forEach(([chord, run]) => KeybindsManager.onKeyChord(chord, run));

        if (typeof this.#config.initial !== "undefined") {
            this.clear();

            Reified.active = createReifiedActive(this.#config.initial[0]);

            Reified.active.forEach((component) => component.attach());

            WiringManager.wires = createWiringsSet(this.#config.initial[1]);
        }

        if (typeof this.#config.save !== "undefined") {
            const file = StorageManager.get<string>("saves:" + this.#config.save);

            if (file) {
                const {
                    error,
                    result: [components, wires],
                } = fromFile(file);

                if (error) {
                    StorageManager.delete("saves:" + this.#config.save);

                    ToastManager.toast({
                        message: "Unable to read from saves.",
                        color: ACTIVATED_CSS_COLOR,
                        duration: 2500,
                    });
                } else {
                    if (!this.#config.overrideSaveIfExists) {
                        this.clear();

                        Reified.active = createReifiedActive(components!);

                        Reified.active.forEach((component) => component.attach());

                        WiringManager.wires = createWiringsSet(wires!);
                    }

                    StorageManager.set(
                        "saves:" + this.#config.save,
                        saveDiagram([...Reified.active], [...WiringManager.wires]),
                    );
                }
            }
        }

        this.#observer = new MutationObserver(() => {
            if (typeof this.#config.save !== "undefined")
                StorageManager.set(
                    "saves:" + this.#config.save,
                    saveDiagram([...Reified.active], [...WiringManager.wires]),
                );
        });

        this.#observer.observe(Reified.root, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
        });

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

        this.#config = {};
    }

    static clear() {
        Reified.active.forEach((component) => component.detach());

        WiringManager.wires.forEach((wire) => wire.destroy());
    }

    static pushHistory(command: () => void, undo: () => void) {
        this.#redos.length = 0;

        command.call(undefined);

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
