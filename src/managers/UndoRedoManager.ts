import { DarkmodeManager } from "./DarkmodeManager";
import { SandboxManager } from "./SandboxManager";

export class UndoRedoManager {
    static get #undoElement() {
        return document.querySelector<HTMLElement>("button.undo")!;
    }

    static get #redoElement() {
        return document.querySelector<HTMLElement>("button.redo")!;
    }

    static #undoListener = () => {
        SandboxManager.popHistory();
    };

    static #redoListener = () => {
        SandboxManager.redoHistory();
    };

    static listen() {
        DarkmodeManager.onChange(() => {
            this.#undoElement.style.transition = "none";
            this.#redoElement.style.transition = "none";

            setTimeout(() => {
                this.#undoElement.style.transition = "";
                this.#redoElement.style.transition = "";
            });
        });

        this.#undoElement.innerText = "UNDO";
        this.#redoElement.innerText = "REDO";

        this.#undoElement.addEventListener("click", this.#undoListener);
        this.#redoElement.addEventListener("click", this.#redoListener);

        return this;
    }

    static stop() {
        this.#undoElement.removeEventListener("click", this.#undoListener);
        this.#redoElement.removeEventListener("click", this.#redoListener);

        return this;
    }
}
