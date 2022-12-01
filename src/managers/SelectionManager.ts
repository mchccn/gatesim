import { ACTIVATED_CSS_COLOR, IN_DEBUG_MODE } from "../constants";
import { Reified } from "../reified/Reified";
import { ToastManager } from "./ToastManager";

export class SelectionManager {
    static selected = new Set<Reified>();

    static readonly #click = (e: MouseEvent) => {
        if (e.target === Reified.root || e.target === document.body) {
            return this.selected.clear();
        }

        const target = e.target as Element;

        const element = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
        ].find((element) => element !== null)!;

        const reified = [...Reified.active].find((component) => component.element === element);

        if (reified) {
            this.select(reified);
        } else {
            if (IN_DEBUG_MODE)
                ToastManager.toast({
                    message: "Unable to select component.",
                    color: ACTIVATED_CSS_COLOR,
                    duration: 2500,
                });
        }
    };

    static select(reified: Reified) {
        this.selected.clear();

        this.selected.add(reified);
    }

    static listen() {
        document.body.addEventListener("click", this.#click);
    }

    static deafen() {
        document.body.addEventListener("click", this.#click);
    }

    static reset() {
        this.selected.clear();

        this.deafen();
    }
}
