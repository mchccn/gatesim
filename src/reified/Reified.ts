import { WatchedSet } from "../augments/WatchedSet";
import { SCUFFED_UUID } from "../constants";

export function html(template: TemplateStringsArray, ...values: unknown[]): HTMLElement;
export function html(html: string): HTMLElement;
export function html(...args: [string] | [TemplateStringsArray, ...unknown[]]) {
    const [template, ...values] = args;

    const html =
        typeof template === "string" ? template : template.reduce((html, s, i) => html + s + (values[i] ?? ""), "");

    return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
}

export function css(template: TemplateStringsArray, ...values: unknown[]): string;
export function css(css: string): string;
export function css(...args: [string] | [TemplateStringsArray, ...unknown[]]) {
    const [template, ...values] = args;

    const css =
        typeof template === "string" ? template : template.reduce((css, s, i) => css + s + (values[i] ?? ""), "");

    return css;
}

export function computeTransformOrigin(element: HTMLElement) {
    const { width, height, transform } = getComputedStyle(element);

    if (transform && transform !== "none") {
        const values = transform.match(/^matrix\((.+)\)$/)?.[1].split(", ");

        if (values) {
            element.style.translate = "";

            const [a, b] = values.map(Number);

            const angle = (Math.round(Math.atan2(b, a) * (180 / Math.PI)) + 360) % 360;

            if (angle === 0 || angle === 90) return parseFloat(height) / 2 + "px " + parseFloat(height) / 2 + "px";

            if (angle === 180) return "center";

            element.style.translate = "0 " + (parseFloat(width) - parseFloat(height)) + "px";

            return parseFloat(height) / 2 + "px " + parseFloat(height) / 2 + "px";
        }
    }

    return "center";
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

    move({ x, y, centered, relative }: { x?: number; y?: number; centered?: boolean; relative?: boolean }) {
        this.element.style.transformOrigin = computeTransformOrigin(this.element);

        if (relative) {
            this.element.style.left = parseFloat(this.element.style.left) + (x ?? 0) + "px";
            this.element.style.top = parseFloat(this.element.style.top) + (y ?? 0) + "px";
        } else {
            if (typeof x !== "undefined") this.element.style.left = x + "px";
            if (typeof y !== "undefined") this.element.style.top = y + "px";
        }

        if (centered)
            requestAnimationFrame(() => {
                const { top, left, width, height } = getComputedStyle(this.element);

                this.move({
                    x: parseFloat(left) - parseFloat(width) / 2,
                    y: parseFloat(top) - parseFloat(height) / 2,
                });
            });
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

    get pos() {
        return {
            x: parseFloat(this.element.style.left),
            y: parseFloat(this.element.style.top),
        };
    }
}
