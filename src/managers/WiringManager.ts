import { WatchedSet } from "../augments/WatchedSet";
import { ACTIVATED_CSS_COLOR, LIGHT_GRAY_CSS_COLOR, LOCKED_FOR_TESTING } from "../constants";
import { MouseManager } from "./MouseManager";
import { SandboxManager } from "./SandboxManager";
import { TestingManager } from "./TestingManager";

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
                        if (TestingManager.testing) return LOCKED_FOR_TESTING();

                        const from = NewWireContext.from;

                        SandboxManager.pushHistory(
                            () => {
                                WiringManager.wires.add(new Wiring(from, target));
                            },
                            () => {
                                for (const wire of WiringManager.wires) {
                                    if (wire.from === from && wire.to === target) {
                                        WiringManager.wires.delete(wire);

                                        break;
                                    }
                                }
                            },
                        );
                    }
                }

                NewWireContext.from = undefined;
            }

            return undefined;
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

        this.go();
    }

    destroy() {
        this.#destroyed = true;

        this.#observer.disconnect();
    }

    go() {
        this.#destroyed = false;

        this.#observer.observe(this.from, { attributeFilter: ["class"], attributes: true });
    }

    get destroyed() {
        return this.#destroyed;
    }
}

export class WiringManager {
    static #rAF = -1;
    static #stopped = false;

    static wires = new WatchedSet<Wiring>();

    static update() {
        const ctx = document.querySelector("canvas")!.getContext("2d")!;

        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        this.wires.forEach((wire) => {
            if (wire.destroyed) {
                if (this.wires.locked) wire.go();
                else this.wires.delete(wire);

                return;
            }

            const from = wire.from.getBoundingClientRect();
            const to = wire.to.getBoundingClientRect();

            wire.to.classList.toggle("activated", wire.from.classList.contains("activated"));

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

    static start() {
        if (this.#stopped) {
            this.#rAF = -1;

            this.#stopped = false;

            return;
        }

        this.update();

        const id = requestAnimationFrame(this.start.bind(this));

        this.#rAF = id;
    }

    static stop() {
        this.#stopped = true;

        cancelAnimationFrame(this.#rAF);
    }
}
