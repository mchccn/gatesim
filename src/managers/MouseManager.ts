export class MouseManager {
    static #mouse = { x: 0, y: 0 };

    static readonly #mousedowns = new Set<(e: MouseEvent) => void>();
    static readonly #mouseups = new Set<(e: MouseEvent) => void>();

    static #mousemove = (e: MouseEvent) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
    };

    static #mousedown = (e: MouseEvent) => {
        this.#mousedowns.forEach((l) => l.call(undefined, e));
    };

    static #mouseup = (e: MouseEvent) => {
        this.#mouseups.forEach((l) => l.call(undefined, e));
    };

    static #touchmove = (e: TouchEvent) => {
        this.#mouse.x = e.touches[0].clientX;
        this.#mouse.y = e.touches[0].clientY;
    };

    static #touchstart = (e: TouchEvent) => {
        this.#mouse.x = e.touches[0].clientX;
        this.#mouse.y = e.touches[0].clientY;
    };

    static #touchend = (e: TouchEvent) => {
        this.#mouse.x = e.changedTouches[0].clientX;
        this.#mouse.y = e.changedTouches[0].clientY;
    };

    static start() {
        document.addEventListener("mousemove", this.#mousemove);
        document.addEventListener("mousedown", this.#mousedown);
        document.addEventListener("mouseup", this.#mouseup);
        document.addEventListener("touchmove", this.#touchmove);
        document.addEventListener("touchstart", this.#touchstart);
        document.addEventListener("touchend", this.#touchend);
    }

    static stop() {
        document.removeEventListener("mousemove", this.#mousemove);
        document.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("mouseup", this.#mouseup);
        document.removeEventListener("touchmove", this.#touchmove);
        document.removeEventListener("touchstart", this.#touchstart);
        document.removeEventListener("touchend", this.#touchend);

        this.#mouse = { x: 0, y: 0 };
    }

    static reset() {
        this.stop();

        this.#mousedowns.clear();
        this.#mouseups.clear();
    }

    static onMouseDown(handler: (e: MouseEvent) => void) {
        this.#mousedowns.add(handler);
    }

    static onMouseUp(handler: (e: MouseEvent) => void) {
        this.#mouseups.add(handler);
    }

    static offMouseDown(handler: (e: MouseEvent) => void) {
        this.#mousedowns.delete(handler);
    }

    static offMouseUp(handler: (e: MouseEvent) => void) {
        this.#mouseups.delete(handler);
    }

    static get mouse() {
        return { ...this.#mouse };
    }
}
