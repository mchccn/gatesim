import { EVEN_DARKER_GRAY_CSS_COLOR, EVEN_LIGHTER_GRAY_CSS_COLOR, GRID_SIZE, ORIGIN_POINT } from "../constants";
import { gates } from "../reified/chips";
import { Component } from "../reified/Component";
import { Reified } from "../reified/Reified";
import { DarkmodeManager } from "./DarkmodeManager";
import { KeybindsManager } from "./KeybindsManager";
import { MouseManager } from "./MouseManager";
import { QuickPickManager } from "./QuickPickManager";
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

    static snapToGridBasedUpdate({ forceClear = false }: { forceClear?: boolean } = { forceClear: false }) {
        if (this.snapToGrid && !forceClear) {
            setTimeout(() => {
                Reified.active.forEach((component) => {
                    component.element.style.minWidth = "";
                    component.element.style.minHeight = "";

                    setTimeout(() => {
                        const style = getComputedStyle(component.element);
                        const width = parseFloat(style.width);
                        const height = parseFloat(style.height);

                        component.element.style.minWidth = Math.ceil(width / GRID_SIZE) * GRID_SIZE + "px";
                        component.element.style.minHeight = Math.ceil(height / GRID_SIZE) * GRID_SIZE + "px";
                    });
                });
            });

            document.body.style.backgroundSize = GRID_SIZE + "px " + GRID_SIZE + "px";

            if (DarkmodeManager.enabled) {
                document.body.style.backgroundImage = `linear-gradient(to right, ${EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${EVEN_DARKER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            } else {
                document.body.style.backgroundImage = `linear-gradient(to right, ${EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${EVEN_LIGHTER_GRAY_CSS_COLOR} 1px, transparent 1px)`;
            }
        } else {
            setTimeout(() => {
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

        const mousedown = (e: MouseEvent) => {
            this.#dragged = element;

            this.#dragged.dataset.dragged = "true";

            this.#dragged.style.cursor = "grabbing";

            const rect = this.#dragged.getBoundingClientRect();

            this.#mouse.x = e.clientX;
            this.#mouse.y = e.clientY;

            this.#mouse.ix = e.clientX;
            this.#mouse.iy = e.clientY;

            if (!SelectionManager.isSelected(element)) SelectionManager.selected.clear();

            if (SelectionManager.selected.size <= 1) {
                this.#mouse.ox = e.clientX - rect.left;
                this.#mouse.oy = e.clientY - rect.top;
            } else {
                this.#positions = [...SelectionManager.selected].map((target) => target.pos);

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

        const touchstart = (e: TouchEvent) => {
            const [touch] = e.touches;

            this.#dragged = element;

            this.#dragged.dataset.dragged = "true";

            this.#dragged.style.cursor = "grabbing";

            const rect = this.#dragged.getBoundingClientRect();

            this.#mouse.x = touch.clientX;
            this.#mouse.y = touch.clientY;

            this.#mouse.ix = touch.clientX;
            this.#mouse.iy = touch.clientY;

            if (SelectionManager.selected.size <= 1) {
                this.#mouse.ox = touch.clientX - rect.left;
                this.#mouse.oy = touch.clientY - rect.top;
            } else {
                this.#positions = [...SelectionManager.selected].map((target) => target.pos);

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

                this.#mouse.ox = touch.clientX - bounds.x;
                this.#mouse.oy = touch.clientY - bounds.y;

                this.#topleft = topleft;
            }

            this.#original = { x: rect.left, y: rect.top };
        };

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

    static listen() {
        this.snapToGridBasedUpdate();

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

    static readonly #mousemove = (e: MouseEvent) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

        if (this.#dragged) {
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

    static readonly #mousedown = (e: MouseEvent) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

        this.#mouse.ix = e.clientX;
        this.#mouse.iy = e.clientY;

        const target = e.target as Element;

        const isOnInvalidTarget = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
            target.closest("div.display"),
            target.closest("div.contextmenu"),
        ].find((element) => element !== null)!;

        if (!isOnInvalidTarget && e.button === 0) {
            if (KeybindsManager.isKeyDown("KeyA")) {
                QuickPickManager.activate(
                    e,
                    gates.map((gate) => ({
                        label: gate.NAME,
                        callback(e) {
                            const component = new Component(Reflect.construct(gate, []), ORIGIN_POINT);

                            const selection = SelectionManager.selected.clone(true);

                            return SandboxManager.pushHistory(
                                () => {
                                    Reified.active.add(component);

                                    if (Reified.active.has(component)) {
                                        component.attach();

                                        const { width, height } = getComputedStyle(component.element);

                                        component.move({
                                            x: e.clientX - parseFloat(width) / 2,
                                            y: e.clientY - parseFloat(height) / 2,
                                        });

                                        SelectionManager.select(component);
                                    }
                                },
                                () => {
                                    Reified.active.delete(component);

                                    component.detach();

                                    SelectionManager.selected = selection;
                                },
                            );
                        },
                    })),
                );
            } else {
                this.#downpos.x = e.clientX;
                this.#downpos.y = e.clientY;
            }
        }

        this.#mouse.down = true;
    };

    static readonly #mouseup = (e: MouseEvent) => {
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
                                target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                                target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                            },
                            () => {
                                target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                                target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                            },
                        );
                    else
                        SandboxManager.pushHistory(
                            () => {
                                target.style.left = mouse.x - mouse.ox - 1 + "px";
                                target.style.top = mouse.y - mouse.oy - 1 + "px";
                            },
                            () => {
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

    static readonly #touchmove = (e: TouchEvent) => {
        const [touch] = e.touches;

        this.#mouse.x = touch.clientX;
        this.#mouse.y = touch.clientY;

        if (this.#dragged) {
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

    static readonly #touchstart = (e: TouchEvent) => {
        const [touch] = e.touches;

        this.#mouse.x = touch.clientX;
        this.#mouse.y = touch.clientY;

        this.#mouse.ix = touch.clientX;
        this.#mouse.iy = touch.clientY;

        const target = e.target as Element;

        const isOnInvalidTarget = [
            target.closest("button.board-input"),
            target.closest("button.board-output"),
            target.closest("div.component"),
            target.closest("div.display"),
            target.closest("div.contextmenu"),
        ].find((element) => element !== null)!;

        if (!isOnInvalidTarget) {
            this.#downpos.x = touch.clientX;
            this.#downpos.y = touch.clientY;
        }

        this.#mouse.down = true;
    };

    static readonly #touchend = (e: TouchEvent) => {
        const [touch] = e.changedTouches;

        this.#mouse.x = touch.clientX;
        this.#mouse.y = touch.clientY;

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
                                target.style.left = Math.floor((mouse.x - mouse.ox - 1) / size) * size + "px";
                                target.style.top = Math.floor((mouse.y - mouse.oy - 1) / size) * size + "px";
                            },
                            () => {
                                target.style.left = Math.floor((original.x - 1) / size) * size + "px";
                                target.style.top = Math.floor((original.y - 1) / size) * size + "px";
                            },
                        );
                    else
                        SandboxManager.pushHistory(
                            () => {
                                target.style.left = mouse.x - mouse.ox - 1 + "px";
                                target.style.top = mouse.y - mouse.oy - 1 + "px";
                            },
                            () => {
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

    static get downpos() {
        return { ...this.#downpos };
    }
}
