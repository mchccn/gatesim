export class MouseManager {
    static #mouse = { x: 0, y: 0 };

    static readonly #mousedowns = new Set<(e: MouseEvent) => void>();
    static readonly #mouseups = new Set<(e: MouseEvent) => void>();
    static readonly #touchstarts = new Set<(e: TouchEvent) => void>();
    static readonly #touchends = new Set<(e: TouchEvent) => void>();

    static #mousemove = (e: MouseEvent) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;
    };

    static #mousedown = (e: MouseEvent) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

        this.#mousedowns.forEach((l) => l.call(undefined, e));
    };

    static #mouseup = (e: MouseEvent) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

        this.#mouseups.forEach((l) => l.call(undefined, e));
    };

    static #touchmove = (e: TouchEvent) => {
        this.#mouse.x = e.touches[0].clientX;
        this.#mouse.y = e.touches[0].clientY;
    };

    static #touchstart = (e: TouchEvent) => {
        this.#mouse.x = e.touches[0].clientX;
        this.#mouse.y = e.touches[0].clientY;

        this.#touchstarts.forEach((l) => l.call(undefined, e));
    };

    static #touchend = (e: TouchEvent) => {
        this.#mouse.x = e.changedTouches[0].clientX;
        this.#mouse.y = e.changedTouches[0].clientY;

        this.#touchends.forEach((l) => l.call(undefined, e));
    };

    static start() {
        document.addEventListener("mousemove", this.#mousemove);
        document.addEventListener("mousedown", this.#mousedown);
        document.addEventListener("mouseup", this.#mouseup);
        document.addEventListener("touchmove", this.#touchmove);
        document.addEventListener("touchstart", this.#touchstart);
        document.addEventListener("touchend", this.#touchend);

        return this;
    }

    static stop() {
        document.removeEventListener("mousemove", this.#mousemove);
        document.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("mouseup", this.#mouseup);
        document.removeEventListener("touchmove", this.#touchmove);
        document.removeEventListener("touchstart", this.#touchstart);
        document.removeEventListener("touchend", this.#touchend);

        this.#mouse = { x: 0, y: 0 };

        return this;
    }

    static reset() {
        this.stop();

        this.#mousedowns.clear();
        this.#mouseups.clear();

        return this;
    }

    static onMouseDown(handler: (e: MouseEvent) => void) {
        this.#mousedowns.add(handler);

        return this;
    }

    static onMouseUp(handler: (e: MouseEvent) => void) {
        this.#mouseups.add(handler);

        return this;
    }

    static offMouseDown(handler: (e: MouseEvent) => void) {
        this.#mousedowns.delete(handler);

        return this;
    }

    static offMouseUp(handler: (e: MouseEvent) => void) {
        this.#mouseups.delete(handler);

        return this;
    }

    static onTouchStart(handler: (e: TouchEvent) => void) {
        this.#touchstarts.add(handler);

        return this;
    }

    static onTouchEnd(handler: (e: TouchEvent) => void) {
        this.#touchends.add(handler);

        return this;
    }

    static offTouchStart(handler: (e: TouchEvent) => void) {
        this.#touchstarts.delete(handler);

        return this;
    }

    static offTouchEnd(handler: (e: TouchEvent) => void) {
        this.#touchends.delete(handler);

        return this;
    }

    static get mouse() {
        return { ...this.#mouse };
    }
}
