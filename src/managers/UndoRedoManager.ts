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
        this.#undoElement.innerText = "UNDO";
        this.#redoElement.innerText = "REDO";

        this.#undoElement.addEventListener("click", this.#undoListener);
        this.#redoElement.addEventListener("click", this.#redoListener);
    }

    static stop() {
        this.#undoElement.removeEventListener("click", this.#undoListener);
        this.#redoElement.removeEventListener("click", this.#redoListener);
    }
}
