//TODO: Fix dumb fucking bug where holding a key makes it somehow pressed forever...
export class KeybindsManager {
    static #keymap = new Map<string, boolean>();

    static #keychords = new Array<[string, ((e: KeyboardEvent) => void)[]]>();

    static #keydown = (e: KeyboardEvent) => {
        this.#keymap.set(e.code, true);

        if (document.activeElement === document.body) {
            const entry = this.#keychords.find(([chord]) => chord.split("+").every((key) => this.#keymap.get(key)));

            if (entry) entry[1].forEach((run) => run.call(undefined, e));
        }
    };

    static #keyup = (e: KeyboardEvent) => {
        this.#keymap.delete(e.code);
    };

    static listen() {
        document.addEventListener("keydown", this.#keydown);
        document.addEventListener("keyup", this.#keyup);
    }

    static deafen() {
        document.removeEventListener("keydown", this.#keydown);
        document.removeEventListener("keyup", this.#keyup);
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
