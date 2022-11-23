import { MouseTracker } from "./MouseTracker";
import { Wiring, WiringManager } from "./WiringManager";

export class NewWireContext {
    static from: HTMLElement | undefined;

    static {
        MouseTracker.onMouseDown((e) => {
            if (NewWireContext.from) {
                const { target } = e;

                if (target && target instanceof HTMLElement) {
                    if (
                        target.classList.contains("board-output") ||
                        target.classList.contains("component-input-button")
                    ) {
                        WiringManager.wires.add(new Wiring(NewWireContext.from, target));
                    }
                }

                NewWireContext.from = undefined;
            }
        });
    }
}
