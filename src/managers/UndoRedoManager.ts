import { LIGHT_GRAY_CSS_COLOR } from "../constants";
import { css } from "../reified/Reified";
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

        this.#undoElement.style.cssText = css`
            & {
                color: ${LIGHT_GRAY_CSS_COLOR};
                left: ${64}px;
                bottom: 24px;
                position: absolute;
                font-size: 16px;
                border: none;
                background: transparent;
                cursor: pointer;
                user-select: none;
            }
        `;

        this.#redoElement.style.cssText = css`
            & {
                color: ${LIGHT_GRAY_CSS_COLOR};
                left: ${122}px;
                bottom: 24px;
                position: absolute;
                font-size: 16px;
                border: none;
                background: transparent;
                cursor: pointer;
                user-select: none;
            }
        `;

        this.#undoElement.addEventListener("click", this.#undoListener);
        this.#redoElement.addEventListener("click", this.#redoListener);
    }

    static stop() {
        this.#undoElement.removeEventListener("click", this.#undoListener);
        this.#redoElement.removeEventListener("click", this.#redoListener);
    }
}
