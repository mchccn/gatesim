import { IS_MAC_OS } from "../circular";
import { EVEN_DARKER_GRAY_CSS_COLOR, EVEN_LIGHTER_GRAY_CSS_COLOR, GET_ACTIVATED_COLOR, GRID_SIZE } from "../constants";
import { quickpickComponents } from "../quickpicks/components";
import { quickpickGates } from "../quickpicks/gates";
import { Reified, computeTransformOrigin } from "../reified/Reified";
import { CanvasManager } from "./CanvasManager";
import { DarkmodeManager } from "./DarkmodeManager";
import { KeybindsManager } from "./KeybindsManager";
import { MouseManager } from "./MouseManager";
import { SandboxManager } from "./SandboxManager";
import { SelectionManager } from "./SelectionManager";

export class DraggingManager {
    static #dragged: HTMLElement | undefined;

    static readonly #watched = new Map();

    static #mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };

    static #topleft: Element | undefined;

    static #original: { x: number; y: number } | undefined;

    static #downpos = { x: -1, y: -1 };

    static #positions: { x: number; y: number }[] | undefined;

    static #snapToGrid = false;

    static get snapToGrid() {
        return this.#snapToGrid;
    }

    static set snapToGrid(value: boolean) {
        this.#snapToGrid = value;

        this.snapToGridBasedUpdate();

        SandboxManager.forceSave();
    }

    static snapToGridBasedUpdate(
        { forceClear = false, onlyUpdateColor = false }: { forceClear?: boolean; onlyUpdateColor?: boolean } = {
            forceClear: false,
            onlyUpdateColor: false,
        },
    ) {
        if (this.snapToGrid && !forceClear) {
            if (!onlyUpdateColor)
                requestAnimationFrame(() => {
                    Reified.active.forEach((component) => {
                        component.element.style.minWidth = "";
                        component.element.style.minHeight = "";

                        requestAnimationFrame(() => {
                            const style = getComputedStyle(component.element);
                            const top = parseFloat(style.top);
                            const left = parseFloat(style.left);
                            const width = parseFloat(style.width);
                            const height = parseFloat(style.height);

                            component.move({
                                x: Math.floor(left / GRID_SIZE) * GRID_SIZE,
                                y: Math.floor(top / GRID_SIZE) * GRID_SIZE,
                            });

                            component.element.style.minWidth = Math.ceil(width / GRID_SIZE) * GRID_SIZE + "px";
                            component.element.style.minHeight = Math.ceil(height / GRID_SIZE) * GRID_SIZE + "px";
                        });
                    });
                });

            document.body.style.backgroundSize = GRID_SIZE + "px " + GRID_SIZE + "px";

            if (DarkmodeManager.darkmodeEnabled) {
                document.body.style.backgroundImage = `linear-gradient(to right, ${EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            } else {
                document.body.style.backgroundImage = `linear-gradient(to right, ${EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            }
        } else {
            requestAnimationFrame(() => {
                Reified.active.forEach((component) => {
                    component.element.style.minWidth = "";
                    component.element.style.minHeight = "";
                });
            });

            document.body.style.backgroundSize = "";
            document.body.style.background = "";
        }
    }

    static watch(element: HTMLElement, target = element) {
        element.dataset.watched = "true";

        const mousedown = (e: { clientX: number; clientY: number }) => {
            this.#dragged = element;

            this.#dragged.dataset.dragged = "true";

            this.#dragged.style.cursor = "grabbing";

            const rect = this.#dragged.getBoundingClientRect();

            this.#mouse.x = e.clientX;
            this.#mouse.y = e.clientY;

            this.#mouse.ix = e.clientX;
            this.#mouse.iy = e.clientY;

            if (
                !SelectionManager.isSelected(element) &&
                !(
                    (IS_MAC_OS && (KeybindsManager.isKeyDown("MetaLeft") || KeybindsManager.isKeyDown("MetaRight"))) ||
                    (!IS_MAC_OS &&
                        (KeybindsManager.isKeyDown("ControlLeft") || KeybindsManager.isKeyDown("ControlRight")))
                )
            )
                SelectionManager.selected.clear();

            if (SelectionManager.selected.size <= 1) {
                this.#mouse.ox = e.clientX - rect.left;
                this.#mouse.oy = e.clientY - rect.top;
            } else {
                this.#positions = [...SelectionManager.selected].map((target) => target.pos);

                // store most top left element as an anchor for the others
                const topleft = [...SelectionManager.selected].sort((a, b) => {
                    const ax = parseFloat(a.element.style.left);
                    const ay = parseFloat(a.element.style.top);
                    const bx = parseFloat(b.element.style.left);
                    const by = parseFloat(b.element.style.top);
                    const ad = Math.sqrt(ax * ax + ay * ay);
                    const bd = Math.sqrt(bx * bx + by * by);
                    return ad - bd;
                })[0].element;

                const bounds = topleft.getBoundingClientRect();

                this.#mouse.ox = e.clientX - bounds.x;
                this.#mouse.oy = e.clientY - bounds.y;

                this.#topleft = topleft;
            }

            this.#original = { x: rect.left, y: rect.top };
        };

        const touchstart = (e: TouchEvent) => mousedown(e.touches[0]);

        target.addEventListener("mousedown", mousedown, { capture: true });
        target.addEventListener("touchstart", touchstart, { capture: true });

        this.#watched.set(target, { mousedown, touchstart });
    }

    static forget(element: HTMLElement, force?: boolean) {
        const listener = this.#watched.get(element);

        if (!listener && !force) throw new Error(`Element is not currently being watched.`);

        if (listener) {
            delete element.dataset.watched;

            element.removeEventListener("mousedown", listener.mousedown, { capture: true });
            element.removeEventListener("touchstart", listener.touchstart, { capture: true });

            this.#watched.delete(element);
        }
    }

    static reset() {
        this.#watched.forEach((_, element) => this.forget(element));

        this.#mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };

        this.#downpos = { x: -1, y: -1 };

        this.#topleft = undefined;

        this.#dragged = undefined;

        this.#original = undefined;

        this.#positions = undefined;

        this.deafen();
    }

    static render({ fg }: { fg: CanvasRenderingContext2D }) {
        if (
            DraggingManager.downpos.x !== -1 &&
            DraggingManager.downpos.y !== -1 &&
            MouseManager.mouse.x !== -1 &&
            MouseManager.mouse.y !== -1
        ) {
            fg.strokeStyle = GET_ACTIVATED_COLOR();

            fg.lineWidth = 2.5;

            fg.lineJoin = "miter";

            fg.strokeRect(
                DraggingManager.downpos.x,
                DraggingManager.downpos.y,
                MouseManager.mouse.x - DraggingManager.downpos.x,
                MouseManager.mouse.y - DraggingManager.downpos.y,
            );
        }
    }

    static listen() {
        this.snapToGridBasedUpdate();

        CanvasManager.addJob(this.render.bind(this));

        document.body.addEventListener("mousemove", this.#mousemove);
        window.addEventListener("mousedown", this.#mousedown);
        window.addEventListener("mouseup", this.#mouseup);
        document.body.addEventListener("touchmove", this.#touchmove);
        document.body.addEventListener("touchstart", this.#touchstart);
        document.body.addEventListener("touchend", this.#touchend);
    }

    static deafen() {
        this.snapToGridBasedUpdate({ forceClear: true });

        document.body.removeEventListener("mousemove", this.#mousemove);
        window.removeEventListener("mousedown", this.#mousedown);
        window.removeEventListener("mouseup", this.#mouseup);
        document.body.removeEventListener("touchmove", this.#touchmove);
        document.body.removeEventListener("touchstart", this.#touchstart);
        document.body.removeEventListener("touchend", this.#touchend);
    }

    static readonly #mousemove = (e: { clientX: number; clientY: number }) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

        if (this.#dragged) {
            this.#dragged.style.transformOrigin = computeTransformOrigin(this.#dragged);

            if (DraggingManager.snapToGrid) {
                if (SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left =
                        Math.floor((this.#mouse.x - this.#mouse.ox) / GRID_SIZE) * GRID_SIZE + "px";
                    this.#dragged.style.top =
                        Math.floor((this.#mouse.y - this.#mouse.oy) / GRID_SIZE) * GRID_SIZE + "px";
                } else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();

                    SelectionManager.selected.forEach((component) => {
                        const offset = component.element.getBoundingClientRect();

                        component.move({
                            x:
                                Math.floor((this.#mouse.x - this.#mouse.ox) / GRID_SIZE) * GRID_SIZE +
                                offset.left -
                                topleft.left,
                            y:
                                Math.floor((this.#mouse.y - this.#mouse.oy) / GRID_SIZE) * GRID_SIZE +
                                offset.top -
                                topleft.top,
                        });
                    });
                }
            } else {
                if (SelectionManager.selected.size <= 1) {
                    this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                    this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
                } else if (this.#topleft) {
                    const topleft = this.#topleft.getBoundingClientRect();

                    SelectionManager.selected.forEach((component) => {
                        const offset = component.element.getBoundingClientRect();

                        component.move({
                            x: this.#mouse.x - this.#mouse.ox + offset.left - topleft.left,
                            y: this.#mouse.y - this.#mouse.oy + offset.top - topleft.top,
                        });
                    });
                }
            }
        }
    };

    static readonly #mousedown = (e: MouseEvent | TouchEvent) => {
        const m = e instanceof MouseEvent ? e : e.touches[0];

        this.#mouse.x = m.clientX;
        this.#mouse.y = m.clientY;

        this.#mouse.ix = m.clientX;
        this.#mouse.iy = m.clientY;

        const target = e.target as Element;

        const isOnInvalidTarget = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
            target.closest("div.display"),
            target.closest("div.contextmenu"),
        ].find((element) => element !== null)!;

        if (e instanceof MouseEvent) {
            if (!isOnInvalidTarget && e.button === 0) {
                if (KeybindsManager.isKeyDown("KeyA") && KeybindsManager.isKeyDown("KeyS")) {
                } else if (KeybindsManager.isKeyDown("KeyA")) {
                    quickpickGates(e);
                } else if (KeybindsManager.isKeyDown("KeyS")) {
                    quickpickComponents(e);
                } else {
                    this.#downpos.x = m.clientX;
                    this.#downpos.y = m.clientY;
                }
            }
        } else {
            if (!isOnInvalidTarget) {
                this.#downpos.x = m.clientX;
                this.#downpos.y = m.clientY;
            }
        }

        this.#mouse.down = true;
    };

    static readonly #mouseup = (e: { clientX: number; clientY: number }) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

        if (this.#dragged) {
            document.querySelectorAll<HTMLElement>('[data-dragged="true"]').forEach((e) => {
                delete e.dataset.dragged;

                e.style.cursor = "";
            });

            if (SelectionManager.selected.size <= 1) {
                const target = this.#dragged;
                const mouse = this.#mouse;
                const original = this.#original!;
                const size = GRID_SIZE;

                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        SandboxManager.pushHistory(
                            () => {
                                target.style.transformOrigin = computeTransformOrigin(target);

                                target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                                target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                            },
                            () => {
                                target.style.transformOrigin = computeTransformOrigin(target);

                                target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                                target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                            },
                        );
                    else
                        SandboxManager.pushHistory(
                            () => {
                                target.style.transformOrigin = computeTransformOrigin(target);

                                target.style.left = mouse.x - mouse.ox - 1 + "px";
                                target.style.top = mouse.y - mouse.oy - 1 + "px";
                            },
                            () => {
                                target.style.transformOrigin = computeTransformOrigin(target);

                                target.style.left = original.x - 1 + "px";
                                target.style.top = original.y - 1 + "px";
                            },
                        );
            } else if (this.#topleft) {
                const mouse = this.#mouse;
                const targets = [...SelectionManager.selected];
                const positions = this.#positions!;
                const topleft = this.#topleft.getBoundingClientRect();
                const size = GRID_SIZE;

                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    if (DraggingManager.snapToGrid)
                        SandboxManager.pushHistory(
                            () => {
                                targets.forEach((component) => {
                                    const offset = component.element.getBoundingClientRect();

                                    component.move({
                                        x: Math.floor((mouse.x - mouse.ox) / size) * size + offset.left - topleft.left,
                                        y: Math.floor((mouse.y - mouse.oy) / size) * size + offset.top - topleft.top,
                                    });
                                });
                            },
                            () => {
                                targets.forEach((component, i) => {
                                    component.move(positions[i]);
                                });
                            },
                        );
                    else
                        SandboxManager.pushHistory(
                            () => {
                                targets.forEach((component) => {
                                    const offset = component.element.getBoundingClientRect();

                                    component.move({
                                        x: mouse.x - mouse.ox + offset.left - topleft.left,
                                        y: mouse.y - mouse.oy + offset.top - topleft.top,
                                    });
                                });
                            },
                            () => {
                                targets.forEach((component, i) => {
                                    component.move(positions[i]);
                                });
                            },
                        );
            }
        }

        if (
            this.#downpos.x !== -1 &&
            this.#downpos.y !== -1 &&
            MouseManager.mouse.x !== -1 &&
            MouseManager.mouse.y !== -1
        )
            SelectionManager.selectAllIn(DraggingManager.#downpos, MouseManager.mouse);

        this.#mouse = { x: -1, y: -1, ox: -1, oy: -1, ix: -1, iy: -1, down: false };

        this.#downpos = { x: -1, y: -1 };

        this.#topleft = undefined;

        this.#dragged = undefined;

        this.#original = undefined;

        this.#positions = undefined;
    };

    static readonly #touchmove = (e: TouchEvent) => this.#mousemove(e.touches[0]);

    static readonly #touchstart = (e: TouchEvent) => this.#mousedown(e);

    static readonly #touchend = (e: TouchEvent) => this.#mouseup(e.touches[0]);

    static get downpos() {
        return { ...this.#downpos };
    }
}
