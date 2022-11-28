import { WatchedSet } from "../augments/WatchedSet";

export function html(template: TemplateStringsArray, ...values: unknown[]): HTMLElement;
export function html(html: string): HTMLElement;
export function html(...args: [string] | [TemplateStringsArray, ...unknown[]]) {
    const [template, ...values] = args;

    const html =
        typeof template === "string" ? template : template.reduce((html, text, i) => html + text + values[i] ?? "", "");

    return new DOMParser().parseFromString(html, "text/html").body.childNodes[0];
}

export function preventDefault(e: Event) {
    e.preventDefault();
}

export abstract class Reified {
    protected PERMANENT = false;

    static active = new WatchedSet<Reified>();

    static get root() {
        return document.querySelector<HTMLElement>(".reified-root")!;
    }

    abstract readonly element: HTMLElement;

    move({ x, y }: { x: number; y: number }) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
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
}
