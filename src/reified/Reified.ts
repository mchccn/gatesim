import { WatchedSet } from "../augments/WatchedSet";
import { SCUFFED_UUID } from "../constants";

export function html(template: TemplateStringsArray, ...values: unknown[]): HTMLElement;
export function html(html: string): HTMLElement;
export function html(...args: [string] | [TemplateStringsArray, ...unknown[]]) {
    const [template, ...values] = args;

    const html =
        typeof template === "string" ? template : template.reduce((html, text, i) => html + text + values[i] ?? "", "");

    return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
}

export function overlappedBounds(rect: DOMRect, from: { x: number; y: number }, to: { x: number; y: number }) {
    const bounds = {
        x: Math.min(from.x, to.x),
        y: Math.min(from.y, to.y),
        width: Math.abs(from.x - to.x),
        height: Math.abs(from.y - to.y),
    };

    return (
        rect.x <= bounds.x + bounds.width &&
        rect.x + rect.width >= bounds.x &&
        rect.y <= bounds.y + bounds.height &&
        rect.y + rect.height >= bounds.y
    );
}

export function preventDefault(e: Event) {
    e.preventDefault();
}

export abstract class Reified {
    readonly uuid = SCUFFED_UUID();

    protected PERMANENT = false;

    static active = new WatchedSet<Reified>();

    static get root() {
        return document.querySelector<HTMLElement>(".reified-root")!;
    }

    abstract readonly element: HTMLElement;

    move({ x, y, centered }: { x: number; y: number; centered?: boolean }) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";

        if (centered)
            setTimeout(() => {
                const { top, left, width, height } = getComputedStyle(this.element);

                this.move({
                    x: parseFloat(left) - parseFloat(width) / 2,
                    y: parseFloat(top) - parseFloat(height) / 2,
                });
            }, 0);
    }

    attach() {
        Reified.root.appendChild(this.element);

        return this;
    }

    detach() {
        this.element.remove();

        return this;
    }

    permanent() {
        this.PERMANENT = true;

        return this;
    }

    get permanence() {
        return this.PERMANENT;
    }
}
