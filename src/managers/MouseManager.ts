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

    static start() {
        document.addEventListener("mousemove", this.#mousemove);
        document.addEventListener("mousedown", this.#mousedown);
        document.addEventListener("mouseup", this.#mouseup);
    }

    static stop() {
        document.removeEventListener("mousemove", this.#mousemove);
        document.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("mouseup", this.#mouseup);

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
