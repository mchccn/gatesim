import { WatchedSet } from "../augments/WatchedSet";
import { GET_ACTIVATED_COLOR, GET_GRAY_COLOR, LOCKED_FOR_TESTING } from "../constants";
import { CanvasManager } from "./CanvasManager";
import { MouseManager } from "./MouseManager";
import { SandboxManager } from "./SandboxManager";
import { StorageManager } from "./StorageManager";
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
                                        wire.destroy();

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
            if (!WiringManager.wires.has(this)) {
                if (![...WiringManager.wires].some((wire) => wire.to === this.to)) to.classList.remove("activated");

                return this.destroy();
            }

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
    static wires = new WatchedSet<Wiring>();

    static render({ bg }: { bg: CanvasRenderingContext2D }) {
        this.wires.forEach((wire) => {
            if (wire.destroyed) {
                if (this.wires.locked) wire.go();
                else this.wires.delete(wire);

                return;
            }

            const from = wire.from.getBoundingClientRect();
            const to = wire.to.getBoundingClientRect();

            const sources = [...this.wires].filter((w) => w.to === wire.to);

            wire.to.classList.toggle(
                "activated",
                sources.some((w) => w.from.classList.contains("activated")),
            );

            bg.strokeStyle = wire.from.classList.contains("activated") ? GET_ACTIVATED_COLOR() : GET_GRAY_COLOR();

            bg.lineWidth = 5;

            bg.lineJoin = "round";

            const xaxis = from.x + from.width / 2 - (to.x + to.width / 2);
            const yaxis = from.y + from.height / 2 - (to.y + to.width / 2);

            const points: [number, number][] =
                !this.#FANCY_WIRES || Math.abs(xaxis) < 10 || Math.abs(yaxis) < 10
                    ? [
                          [from.x + from.width / 2, from.y + from.height / 2],
                          [to.x + to.width / 2, to.y + to.height / 2],
                      ]
                    : Math.abs(xaxis) > Math.abs(yaxis)
                    ? [
                          [from.x + from.width / 2, from.y + from.height / 2],
                          [from.x + from.width / 2 - xaxis / 2, from.y + from.height / 2],
                          [to.x + to.width / 2 + xaxis / 2, to.y + to.height / 2],
                          [to.x + to.width / 2, to.y + to.height / 2],
                      ]
                    : [
                          [from.x + from.width / 2, from.y + from.height / 2],
                          [from.x + from.width / 2, from.y + from.height / 2 - yaxis / 2],
                          [to.x + to.width / 2, to.y + to.height / 2 + yaxis / 2],
                          [to.x + to.width / 2, to.y + to.height / 2],
                      ];

            points.slice(0, -1).forEach((_, i) => {
                bg.beginPath();
                bg.moveTo(...points[i]);
                bg.lineTo(...points[i + 1]);
                bg.closePath();
                bg.stroke();
            });
        });

        if (NewWireContext.from) {
            const from = NewWireContext.from.getBoundingClientRect();

            bg.strokeStyle = NewWireContext.from.classList.contains("activated")
                ? GET_ACTIVATED_COLOR()
                : GET_GRAY_COLOR();

            bg.lineWidth = 5;

            bg.lineJoin = "round";

            const xaxis = from.x + from.width / 2 - MouseManager.mouse.x;
            const yaxis = from.y + from.height / 2 - MouseManager.mouse.y;

            const points: [number, number][] =
                !this.#FANCY_WIRES || Math.abs(xaxis) < 10 || Math.abs(yaxis) < 10
                    ? [
                          [from.x + from.width / 2, from.y + from.height / 2],
                          [MouseManager.mouse.x, MouseManager.mouse.y],
                      ]
                    : Math.abs(xaxis) > Math.abs(yaxis)
                    ? [
                          [from.x + from.width / 2, from.y + from.height / 2],
                          [from.x + from.width / 2 - xaxis / 2, from.y + from.height / 2],
                          [MouseManager.mouse.x + xaxis / 2, MouseManager.mouse.y],
                          [MouseManager.mouse.x, MouseManager.mouse.y],
                      ]
                    : [
                          [from.x + from.width / 2, from.y + from.height / 2],
                          [from.x + from.width / 2, from.y + from.height / 2 - yaxis / 2],
                          [MouseManager.mouse.x, MouseManager.mouse.y + yaxis / 2],
                          [MouseManager.mouse.x, MouseManager.mouse.y],
                      ];

            points.slice(0, -1).forEach((_, i) => {
                bg.beginPath();
                bg.moveTo(...points[i]);
                bg.lineTo(...points[i + 1]);
                bg.closePath();
                bg.stroke();
            });
        }
    }

    static init() {
        CanvasManager.addJob(this.render.bind(this));
    }

    static #FANCY_WIRES = true;

    static get FANCY_WIRES() {
        return this.#FANCY_WIRES;
    }

    static set FANCY_WIRES(v: boolean) {
        this.#FANCY_WIRES = v;

        StorageManager.set("settings.fancyWires", this.#FANCY_WIRES);
    }

    static {
        this.#FANCY_WIRES = StorageManager.get("settings.fancyWires") ?? this.#FANCY_WIRES;
    }
}
