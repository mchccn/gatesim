import { IS_MAC_OS } from "../constants";

export class KeybindsManager {
    static #keymap = new Map<string, boolean>();

    static #keychords = new Array<[string, ((e: KeyboardEvent) => void)[]]>();

    static #keydown = (e: KeyboardEvent) => {
        this.#keymap.set(e.code, true);

        if (e.metaKey && (e.code === "ShiftLeft" || e.code === "ShiftRight") && IS_MAC_OS)
            this.#keymap = new Map([...this.#keymap.entries()].filter(([key]) => !key.startsWith("Key")));

        if (document.activeElement === document.body) {
            const [, runs] =
                this.#keychords.find(([chord]) => {
                    let keys = chord.split("+");

                    const checkShift = keys.includes("ShiftLeft") || keys.includes("ShiftRight");
                    const checkMeta = keys.includes("MetaLeft") || keys.includes("MetaRight");
                    const checkAlt = keys.includes("AltLeft") || keys.includes("AltRight");
                    const checkCtrl = keys.includes("ControlLeft") || keys.includes("ControlRight");

                    if (checkShift) keys = keys.filter((key) => key !== "ShiftLeft" && key !== "ShiftRight");
                    if (checkMeta) keys = keys.filter((key) => key !== "MetaLeft" && key !== "MetaRight");
                    if (checkAlt) keys = keys.filter((key) => key !== "AltLeft" && key !== "AltRight");
                    if (checkCtrl) keys = keys.filter((key) => key !== "ControlLeft" && key !== "ControlRight");

                    return (
                        keys.every((key) => this.#keymap.get(key)) &&
                        (checkShift ? e.shiftKey : true) &&
                        (checkMeta ? e.metaKey : true) &&
                        (checkAlt ? e.altKey : true) &&
                        (checkCtrl ? e.ctrlKey : true)
                    );
                }) ?? [];

            if (runs) runs.forEach((run) => run.call(undefined, e));
        }
    };

    static #keyup = (e: KeyboardEvent) => {
        this.#keymap.delete(e.code);

        if (!e.metaKey && (e.code === "MetaLeft" || e.code === "MetaRight") && IS_MAC_OS) this.#keymap.clear();
    };

    static #blur = () => {
        this.#keymap.clear();
    };

    static listen() {
        document.addEventListener("keydown", this.#keydown);
        document.addEventListener("keyup", this.#keyup);
        document.addEventListener("blur", this.#blur);
    }

    static deafen() {
        document.removeEventListener("keydown", this.#keydown);
        document.removeEventListener("keyup", this.#keyup);
        document.removeEventListener("blur", this.#blur);
    }

    static onKeyChord(chord: string, run: (e: KeyboardEvent) => void) {
        chord = chord.split("+").sort().join("+");

        if (!this.#keychords.find(([key]) => key === chord)?.[1].push(run)) this.#keychords.push([chord, [run]]);

        return this;
    }

    static isKeyDownAndNoFocus(key: string) {
        return !!this.#keymap.get(key) && document.activeElement === document.body;
    }

    static isKeyDown(key: string) {
        return !!this.#keymap.get(key);
    }

    static reset() {
        this.#keymap.clear();

        this.#keychords = [];

        this.deafen();
    }

    static expand(chord: string): string[] {
        const [key, ...rest] = chord.split("+");

        if (key === "Shift")
            return this.expand(rest.join("+")).flatMap((keys) => [`ShiftLeft+${keys}`, `ShiftRight+${keys}`]);

        if (key === "Control")
            return this.expand(rest.join("+")).flatMap((keys) => [`ControlLeft+${keys}`, `ControlRight+${keys}`]);

        if (key === "Alt")
            return this.expand(rest.join("+")).flatMap((keys) => [`AltLeft+${keys}`, `AltRight+${keys}`]);

        if (key === "Meta")
            return this.expand(rest.join("+")).flatMap((keys) => [`MetaLeft+${keys}`, `MetaRight+${keys}`]);

        if (key.length === 1 && key === key.toUpperCase()) return [[`Key${key}`, ...rest].join("+")];

        return [chord];
    }

    static assign(chord: string, run: (e: KeyboardEvent) => void) {
        return Object.fromEntries(this.expand(chord).map((keys) => [keys, run]));
    }
}
