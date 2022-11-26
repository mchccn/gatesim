import { SandboxManager } from "./SandboxManager";

export class DraggingManager {
    static #dragged: HTMLElement | undefined;

    static readonly #mouse = {
        x: -1,
        y: -1,
        ox: -1,
        oy: -1,
        down: false,
    };

    static readonly #watched = new Map();

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
            //EXPERIMENTAL
            const target = this.#dragged;
            const prevLeft = target.style.left;
            const prevTop = target.style.top;
            console.log(prevLeft, prevTop);

            SandboxManager.pushHistory(
                () => {
                    target.style.left = this.#mouse.x - this.#mouse.ox + "px";
                    target.style.top = this.#mouse.y - this.#mouse.oy + "px";
                },
                () => {
                    target.style.left = prevLeft;
                    target.style.top = prevTop;
                },
            );
            //END-EXPERIMENTAL
        }
    };

    static readonly #mousedown = (e: MouseEvent) => {
        this.#mouse.down = true;
    };

    static readonly #mouseup = () => {
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
    };
}
