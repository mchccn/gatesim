import { ZoomingManager } from "./ZoomingManager";

export class DraggingManager {
    static #dragged = undefined as HTMLElement | undefined;

    static #mouse = {
        x: -1,
        y: -1,
        ox: -1,
        oy: -1,
        down: false,
    };

    static #watched = new Map();

    static watch(element: HTMLElement, target = element) {
        element.dataset.watched = "true";

        const mousedown = (e: MouseEvent) => {
            this.#dragged = element;

            this.#dragged.dataset.dragged = "true";

            this.#dragged.style.cursor = "grabbing";

            const rect = this.#dragged.getBoundingClientRect();

            const body = this.#dragged.parentElement?.getBoundingClientRect() ?? new DOMRect();

            this.#mouse.ox = e.clientX - rect.left + body.left;
            this.#mouse.oy = e.clientY - rect.top + body.top;
        };

        target.addEventListener("mousedown", mousedown, { capture: true });

        this.#watched.set(target, mousedown);
    }

    static forget(element: HTMLElement) {
        const listener = this.#watched.get(element);

        if (!listener) throw new Error(`Element is not currently being watched.`);

        delete element.dataset.watched;

        element.removeEventListener("mousedown", listener, { capture: true });

        this.#watched.delete(element);
    }

    static listen() {
        document.body.addEventListener("mousemove", this.mousemove);
        window.addEventListener("mousedown", this.mousedown);
        window.addEventListener("mouseup", this.mouseup);
    }

    static deafen() {
        document.body.removeEventListener("mousemove", this.mousemove);
        window.removeEventListener("mousedown", this.mousedown);
        window.removeEventListener("mouseup", this.mouseup);
    }

    static mousemove(e: MouseEvent) {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

        if (this.#dragged) {
            if (this.#dragged === ZoomingManager.target) {
                this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
                this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
            } else {
                this.#dragged.style.left =
                    (this.#mouse.x - this.#mouse.ox) *
                        (1 / +(ZoomingManager.target?.style.scale ?? 1)) +
                    "px";
                this.#dragged.style.top =
                    (this.#mouse.y - this.#mouse.oy) *
                        (1 / +(ZoomingManager.target?.style.scale ?? 1)) +
                    "px";
            }
        }
    }

    static mousedown(e: MouseEvent) {
        this.#mouse.down = true;
    }

    static mouseup() {
        if (this.#dragged) {
            document.querySelectorAll<HTMLElement>('[data-dragged="true"]').forEach((e) => {
                delete e.dataset.dragged;

                e.style.cursor = "";
            });
        }

        this.#mouse.down = false;

        this.#mouse.x = -1;
        this.#mouse.y = -1;

        this.#mouse.ox = -1;
        this.#mouse.oy = -1;

        this.#dragged = undefined;
    }

    static {
        this.mousemove = this.mousemove.bind(this);
        this.mousedown = this.mousedown.bind(this);
        this.mouseup = this.mouseup.bind(this);
    }
}
