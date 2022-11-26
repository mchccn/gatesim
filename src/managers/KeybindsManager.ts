import { IS_MAC_OS } from "../constants";

export class KeybindsManager {
    static #keymap = new Map<string, boolean>();

    static #keychords = new Array<[string, ((e: KeyboardEvent) => void)[]]>();

    static #keydown = (e: KeyboardEvent) => {
        this.#keymap.set(e.code, true);

        if (document.activeElement === document.body) {
            const [, runs] =
                this.#keychords.find(([chord]) => chord.split("+").every((key) => this.#keymap.get(key))) ?? [];

            if (runs) runs.forEach((run) => run.call(undefined, e));
        }
    };

    static #keyup = (e: KeyboardEvent) => {
        this.#keymap.delete(e.code);

        if (!e.metaKey && (e.code === "MetaLeft" || e.code === "MetaRight") && IS_MAC_OS) this.#keymap.clear();
        if (e.metaKey && (e.code === "ShiftLeft" || e.code === "ShiftRight") && IS_MAC_OS)
            this.#keymap = new Map([...this.#keymap.entries()].filter(([key]) => !key.startsWith("Key")));
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
}
