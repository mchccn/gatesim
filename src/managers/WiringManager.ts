import { ACTIVATED_CSS_COLOR, LIGHT_GRAY_CSS_COLOR } from "../constants";
import { MouseManager } from "./MouseManager";

export class NewWireContext {
    static from: HTMLElement | undefined;

    static {
        MouseManager.onMouseDown((e) => {
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

export class Wiring {
    #destroyed = false;
    #observer;

    constructor(readonly from: Element, readonly to: Element) {
        this.#observer = new MutationObserver(() => {
            to.classList.toggle("activated", from.classList.contains("activated"));
        });

        this.#observer.observe(from, { attributeFilter: ["class"], attributes: true });
    }

    destroy() {
        this.#destroyed = true;

        this.#observer.disconnect();
    }

    get destroyed() {
        return this.#destroyed;
    }
}

export class WiringManager {
    static #rAF: number | undefined = -1;

    static wires = new Set<Wiring>();

    static render() {
        const ctx = document.querySelector("canvas")!.getContext("2d")!;

        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        this.wires = new Set([...this.wires].filter((wire) => !wire.destroyed));

        this.wires.forEach((wire) => {
            const from = wire.from.getBoundingClientRect();
            const to = wire.to.getBoundingClientRect();

            if (wire.from.classList.contains("activated")) wire.to.classList.add("activated");

            ctx.strokeStyle = wire.from.classList.contains("activated") ? ACTIVATED_CSS_COLOR : LIGHT_GRAY_CSS_COLOR;

            ctx.lineWidth = 5;

            ctx.lineJoin = "round";

            ctx.beginPath();
            ctx.moveTo(from.x + from.width / 2, from.y + from.height / 2);
            ctx.lineTo(to.x + to.width / 2, to.y + to.height / 2);
            ctx.closePath();
            ctx.stroke();
        });

        if (NewWireContext.from) {
            const from = NewWireContext.from.getBoundingClientRect();

            ctx.strokeStyle = NewWireContext.from.classList.contains("activated")
                ? ACTIVATED_CSS_COLOR
                : LIGHT_GRAY_CSS_COLOR;

            ctx.lineWidth = 5;

            ctx.lineJoin = "round";

            ctx.beginPath();
            ctx.moveTo(from.x + from.width / 2, from.y + from.height / 2);
            ctx.lineTo(MouseManager.mouse.x, MouseManager.mouse.y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    static loop(): () => void {
        if (typeof this.#rAF === "undefined") {
            this.#rAF = -1;

            return () => undefined;
        }

        this.render();

        this.#rAF = requestAnimationFrame(this.loop.bind(this));

        return () => (this.#rAF = undefined);
    }
}
