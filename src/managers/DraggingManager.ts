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

    static watch(element: HTMLElement, target = element) {
        element.dataset.watched = "true";

        const mousedown = (e: MouseEvent) => {
            this.#dragged = element;

            this.#dragged.dataset.dragged = "true";

            this.#dragged.style.cursor = "grabbing";

            const rect = this.#dragged.getBoundingClientRect();

            const body = this.#dragged.parentElement?.getBoundingClientRect() ?? new DOMRect();

            this.#mouse.x = e.clientX;
            this.#mouse.y = e.clientY;

            this.#mouse.ix = e.clientX;
            this.#mouse.iy = e.clientY;

            if (SelectionManager.selected.size <= 1) {
                this.#mouse.ox = e.clientX - rect.left + body.left;
                this.#mouse.oy = e.clientY - rect.top + body.top;
            } else {
                this.#positions = [...SelectionManager.selected].map((target) => ({
                    x: parseFloat(target.element.style.left),
                    y: parseFloat(target.element.style.top),
                }));

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

            const body = this.#dragged.parentElement?.getBoundingClientRect() ?? new DOMRect();

            this.#mouse.x = touch.clientX;
            this.#mouse.y = touch.clientY;

            this.#mouse.ix = touch.clientX;
            this.#mouse.iy = touch.clientY;

            if (SelectionManager.selected.size <= 1) {
                this.#mouse.ox = touch.clientX - rect.left + body.left;
                this.#mouse.oy = touch.clientY - rect.top + body.top;
            } else {
                this.#positions = [...SelectionManager.selected].map((target) => ({
                    x: parseFloat(target.element.style.left),
                    y: parseFloat(target.element.style.top),
                }));

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
        document.body.addEventListener("mousemove", this.#mousemove);
        window.addEventListener("mousedown", this.#mousedown);
        window.addEventListener("mouseup", this.#mouseup);
        document.body.addEventListener("touchmove", this.#touchmove);
        document.body.addEventListener("touchstart", this.#touchstart);
        document.body.addEventListener("touchend", this.#touchend);
    }

    static deafen() {
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
            if (SelectionManager.selected.size <= 1) {
                this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
            } else {
                const topleft = this.#topleft!.getBoundingClientRect();

                SelectionManager.selected.forEach((component) => {
                    const offset = component.element.getBoundingClientRect();

                    component.move({
                        x: this.#mouse.x - this.#mouse.ox + offset.left - topleft.left,
                        y: this.#mouse.y - this.#mouse.oy + offset.top - topleft.top,
                    });
                });
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
            target.closest("div.contextmenu"),
        ].find((element) => element !== null)!;

        if (!isOnInvalidTarget && e.button === 0) {
            this.#downpos.x = e.clientX;
            this.#downpos.y = e.clientY;
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

                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
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
            } else {
                const mouse = this.#mouse;
                const targets = [...SelectionManager.selected];
                const positions = this.#positions!;
                const topleft = this.#topleft!.getBoundingClientRect();

                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
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
            if (SelectionManager.selected.size <= 1) {
                this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
            } else {
                const topleft = this.#topleft!.getBoundingClientRect();

                SelectionManager.selected.forEach((component) => {
                    const offset = component.element.getBoundingClientRect();

                    component.move({
                        x: this.#mouse.x - this.#mouse.ox + offset.left - topleft.left,
                        y: this.#mouse.y - this.#mouse.oy + offset.top - topleft.top,
                    });
                });
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

                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
                    SandboxManager.pushHistory(
                        () => {
                            target.style.left = mouse.x - mouse.ox + "px";
                            target.style.top = mouse.y - mouse.oy + "px";
                        },
                        () => {
                            target.style.left = original.x - 1 + "px";
                            target.style.top = original.y - 1 + "px";
                        },
                    );
            } else {
                const mouse = this.#mouse;
                const targets = [...SelectionManager.selected];
                const positions = this.#positions!;
                const topleft = this.#topleft!.getBoundingClientRect();

                if (mouse.x !== mouse.ix || mouse.y !== mouse.iy)
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
