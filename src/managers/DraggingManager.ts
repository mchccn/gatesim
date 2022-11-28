import { SandboxManager } from "./SandboxManager";

export class DraggingManager {
    static #dragged: HTMLElement | undefined;

    static readonly #watched = new Map();

    static #mouse = { x: -1, y: -1, ox: -1, oy: -1, down: false };

    static #original: { x: number; y: number } | undefined;

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

            this.#mouse.ox = e.clientX - rect.left + body.left;
            this.#mouse.oy = e.clientY - rect.top + body.top;

            this.#original = { x: rect.left, y: rect.top };
        };

        target.addEventListener("mousedown", mousedown, { capture: true });

        this.#watched.set(target, mousedown);
    }

    static forget(element: HTMLElement, force?: boolean) {
        const listener = this.#watched.get(element);

        if (!listener && !force) throw new Error(`Element is not currently being watched.`);

        delete element.dataset.watched;

        element.removeEventListener("mousedown", listener, { capture: true });

        this.#watched.delete(element);
    }

    static reset() {
        this.#mouse.x = -1;
        this.#mouse.y = -1;
        this.#mouse.ox = -1;
        this.#mouse.oy = -1;
        this.#mouse.down = false;

        this.#watched.forEach((_, element) => this.forget(element));

        this.#dragged = undefined;

        this.deafen();
    }

    static listen() {
        document.body.addEventListener("mousemove", this.#mousemove);
        window.addEventListener("mousedown", this.#mousedown);
        window.addEventListener("mouseup", this.#mouseup);
    }

    static deafen() {
        document.body.removeEventListener("mousemove", this.#mousemove);
        window.removeEventListener("mousedown", this.#mousedown);
        window.removeEventListener("mouseup", this.#mouseup);
    }

    static readonly #mousemove = (e: MouseEvent) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

        if (this.#dragged) {
            this.#dragged.style.left = this.#mouse.x - this.#mouse.ox + "px";
            this.#dragged.style.top = this.#mouse.y - this.#mouse.oy + "px";
        }
    };

    static readonly #mousedown = (e: MouseEvent) => {
        this.#mouse.x = e.clientX;
        this.#mouse.y = e.clientY;

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

            if (this.#original) {
                const target = this.#dragged;
                const mouse = this.#mouse;
                const original = this.#original;

                if (
                    Math.round(parseFloat(target.style.left)) !== mouse.x - mouse.ox - 1 ||
                    Math.round(parseFloat(target.style.top)) !== mouse.y - mouse.oy - 1
                )
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
            }
        }

        this.#mouse = { x: -1, y: -1, ox: -1, oy: -1, down: false };

        this.#dragged = undefined;

        this.#original = undefined;
    };
}
