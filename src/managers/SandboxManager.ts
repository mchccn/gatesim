import { WatchedSet } from "../augments/WatchedSet";
import { ACTIVATED_CSS_COLOR, GRID_SIZE, IN_DEBUG_MODE, LIGHT_GRAY_CSS_COLOR, TOAST_DURATION } from "../constants";
import { fromFile, saveDiagram, SerializedDiagram } from "../files";
import { Component } from "../reified/Component";
import { Display } from "../reified/Display";
import { Input } from "../reified/Input";
import { Output } from "../reified/Output";
import { html, Reified } from "../reified/Reified";
import { CanvasManager } from "./CanvasManager";
import { DarkmodeManager } from "./DarkmodeManager";
import { DraggingManager } from "./DraggingManager";
import { KeybindsManager } from "./KeybindsManager";
import { MenuManager, MenuManagerActions } from "./MenuManager";
import { ModalManager } from "./ModalManager";
import { MouseManager } from "./MouseManager";
import { QuickPickManager } from "./QuickPickManager";
import { SelectionManager } from "./SelectionManager";
import { StorageManager } from "./StorageManager";
import { ToastManager } from "./ToastManager";
import { UndoRedoManager } from "./UndoRedoManager";
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
    checkInterval?: number;
    checkState?: (reified: WatchedSet<Reified>, wirings: WatchedSet<Wiring>) => boolean;
    ifStateChecked?: () => void;
    settings?: { snapToGrid?: boolean };
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
            } else if (item instanceof Display) {
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
    static killMenu: ReturnType<typeof MenuManager["use"]>[1];

    static watchedUnresolvedPromises = new Set<() => void>();

    static #interval = -1;
    static #observer: MutationObserver | undefined;

    static #history = new Array<[command: () => void, redo: () => void]>();
    static #redos = new Array<[command: () => void, redo: () => void]>();

    static #config: SandboxConfig;

    static setup(config: SandboxConfig) {
        if (this.#observer) this.#observer.disconnect();

        clearInterval(this.#interval);

        this.#config = config;

        document.body.innerHTML = "";

        document.body.appendChild(html`<div class="modal-container modal-inactive"></div>`);
        document.body.appendChild(html`<div class="reified-root"></div>`);
        document.body.appendChild(html`<canvas class="background-canvas"></canvas>`);
        document.body.appendChild(html`<canvas class="foreground-canvas"></canvas>`);
        document.body.appendChild(html`<div class="toasts-container"></div>`);
        document.body.appendChild(html`<button class="darkmode"></button>`);
        document.body.appendChild(html`<button class="undo"></button>`);
        document.body.appendChild(html`<button class="redo"></button>`);

        MouseManager.start();
        KeybindsManager.listen();
        DraggingManager.listen();
        SelectionManager.listen();
        WiringManager.init();
        QuickPickManager.init();

        CanvasManager.start();

        DarkmodeManager.listen().onChange(() => DraggingManager.snapToGridBasedUpdate({ onlyUpdateColor: true }));

        UndoRedoManager.listen();

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
                            duration: TOAST_DURATION,
                        });

                        return false;
                    }

                    if (totals.inputsTotal > (this.#config.limits?.inputs ?? Infinity)) {
                        ToastManager.toast({
                            message: "Exceeded total inputs limit.",
                            color: ACTIVATED_CSS_COLOR,
                            duration: TOAST_DURATION,
                        });

                        return false;
                    }

                    if (totals.outputsTotal > (this.#config.limits?.outputs ?? Infinity)) {
                        ToastManager.toast({
                            message: "Exceeded total outputs limit.",
                            color: ACTIVATED_CSS_COLOR,
                            duration: TOAST_DURATION,
                        });

                        return false;
                    }

                    if (totals.chipsTotal > (this.#config.limits?.chipsTotal ?? Infinity)) {
                        ToastManager.toast({
                            message: "Exceeded total chips limit.",
                            color: ACTIVATED_CSS_COLOR,
                            duration: TOAST_DURATION,
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
                            duration: TOAST_DURATION,
                        });

                        return false;
                    }

                    return true;
                })
                .onAdd((component) => {
                    DraggingManager.snapToGridBasedUpdate();

                    setTimeout(() => {
                        component.move({
                            x: Math.floor(component.pos.x / GRID_SIZE) * GRID_SIZE,
                            y: Math.floor(component.pos.y / GRID_SIZE) * GRID_SIZE,
                        });
                    });

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
                            duration: TOAST_DURATION,
                        });

                        return false;
                    }

                    return true;
                })
                .addAll(wirings);

        if (typeof this.#config.menu !== "undefined")
            [this.queueNewContext, this.killMenu] = MenuManager.use(Reified.root, this.#config.menu);

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
                    result: [settings, components, wires],
                } = fromFile(file);

                if (error) {
                    StorageManager.delete("saves:" + this.#config.save);

                    if (IN_DEBUG_MODE) console.error("Failed to read from saves:", error);

                    ToastManager.toast({
                        message: "Unable to read from saves.",
                        color: ACTIVATED_CSS_COLOR,
                        duration: TOAST_DURATION,
                    });
                } else {
                    if (!this.#config.overrideSaveIfExists) {
                        this.clear();

                        this.applyRawSettings(settings!);

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

        this.#interval = setInterval(() => {
            const check = this.#config.checkState?.(Reified.active.clone(), WiringManager.wires.clone()) ?? false;

            if (check) this.#config.ifStateChecked?.();
        }, this.#config.checkInterval ?? 50) as never;

        if (!StorageManager.get("usedhelp"))
            ToastManager.toast({
                message: "Press '?' for help.",
                color: LIGHT_GRAY_CSS_COLOR,
                duration: TOAST_DURATION,
            });

        return this;
    }

    static forceSave() {
        if (typeof this.#config.save !== "undefined")
            StorageManager.set(
                "saves:" + this.#config.save,
                saveDiagram([...Reified.active], [...WiringManager.wires]),
            );

        return this;
    }

    static reset() {
        if (this.#observer) {
            this.#observer.disconnect();

            this.#observer = undefined;
        }

        clearInterval(this.#interval);

        this.#interval = -1;

        MouseManager.reset();
        KeybindsManager.reset();
        DraggingManager.reset();
        SelectionManager.reset();

        CanvasManager.stop();

        DarkmodeManager.stop();
        UndoRedoManager.stop();

        MenuManager.remove(Reified.root);

        this.clear();

        this.watchedUnresolvedPromises.forEach((finish) => finish.call(undefined));

        this.watchedUnresolvedPromises.clear();

        document.body.innerHTML = "";

        this.#config = {};

        this.#history = [];
        this.#redos = [];

        return this;
    }

    static clear() {
        Reified.active.forEach((component) => component.detach());

        WiringManager.wires.forEach((wire) => wire.destroy());

        SelectionManager.selected.clear();

        return this;
    }

    static pushHistory(command: () => void, undo: () => void) {
        this.#redos.length = 0;

        command.call(undefined);

        this.#history.push([command, undo]);

        return this;
    }

    static popHistory() {
        if (!this.#history.length) {
            ToastManager.toast({
                message: "Nothing to undo.",
                color: ACTIVATED_CSS_COLOR,
                duration: TOAST_DURATION,
            });

            return this;
        }

        const [redo, undo] = this.#history.pop()!;

        this.#redos.push([redo, undo]);

        undo.call(undefined);

        return this;
    }

    static redoHistory() {
        if (!this.#redos.length) {
            ToastManager.toast({
                message: "Nothing to redo.",
                color: ACTIVATED_CSS_COLOR,
                duration: TOAST_DURATION,
            });

            return this;
        }

        const [command, undo] = this.#redos.pop()!;

        this.#history.push([command, undo]);

        command.call(undefined);

        return this;
    }

    static applySettings(settings: SandboxConfig["settings"] & {}) {
        DraggingManager.snapToGrid = settings.snapToGrid ?? false;

        return this;
    }

    static applyRawSettings(settings: SerializedDiagram["settings"]) {
        DraggingManager.snapToGrid = settings["DraggingManager.snapToGrid"];

        return this;
    }

    static get savedName() {
        return this.#config.save;
    }

    static async saveTo(save: string) {
        this.#config.save = save;

        if (
            StorageManager.has("saves:" + this.#config.save) &&
            !(await ModalManager.confirm(
                "There is already a save with this name. Are you sure you want to replace it?",
            ))
        )
            return;

        StorageManager.set("saves:" + this.#config.save, saveDiagram([...Reified.active], [...WiringManager.wires]));

        return this;
    }
}
