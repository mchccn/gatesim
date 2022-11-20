import { html } from "./Reified";

export type MenuManagerContext = {
    menu: HTMLElement;
    clicks: Map<string, () => void>;
    listeners: {
        mousedown: (e: MouseEvent) => void;
        contextmenu: (e: MouseEvent) => void;
        click: (e: MouseEvent) => void;
    };
};

export class MenuManager {
    static readonly #elements = new Map<HTMLElement, MenuManagerContext>();

    static use(
        element: HTMLElement,
        actions: Array<Record<string, { label: string; callback: (e: MouseEvent) => void }>>
    ) {
        const menu = html`
            <div class="contextmenu">
                ${actions
                    .map((record) =>
                        Object.entries(record)
                            .map(([name, { label }]) => `<button class="${name}">${label}</button>`)
                            .join("")
                    )
                    .join('<div class="br"></div>')}
            </div>
        `;

        const clicks = new Map();

        actions.forEach((record) => {
            Object.keys(record).forEach((key) => {
                const click = record[key].callback.bind(undefined);

                menu.querySelector<HTMLElement>("." + key)!.addEventListener("click", click);
                menu.querySelector<HTMLElement>("." + key)!.addEventListener("contextmenu", click);

                clicks.set(key, clicks);
            });
        });

        menu.style.left = "0px";
        menu.style.top = "0px";
        menu.style.display = "none";

        document.body.appendChild(menu);

        const mousedown = () => {
            menu.style.left = "0px";
            menu.style.top = "0px";
            menu.style.display = "none";
        };

        const contextmenu = (e: MouseEvent) => {
            e.preventDefault();

            menu.style.display = "";
            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY + "px";
        };

        const click = (e: MouseEvent) => {
            e.preventDefault();

            menu.style.left = "0px";
            menu.style.top = "0px";
            menu.style.display = "none";
        };

        element.addEventListener("mousedown", mousedown);
        element.addEventListener("contextmenu", contextmenu);
        menu.addEventListener("click", click);
        menu.addEventListener("contextmenu", click);

        this.#elements.set(element, { menu, clicks, listeners: { mousedown, contextmenu, click } });
    }

    static remove(element: HTMLElement) {
        const { menu, clicks, listeners } = this.#elements.get(element) ?? {};

        if (!menu || !clicks || !listeners) throw new Error(`Elements are not being affected.`);

        element.removeEventListener("mousedown", listeners.mousedown);
        element.removeEventListener("contextmenu", listeners.contextmenu);
        menu.removeEventListener("click", listeners.click);
        menu.removeEventListener("contextmenu", listeners.click);

        Array.from(clicks).forEach(([key, listener]) => {
            menu.querySelector("." + key)!.removeEventListener("click", listener);
            menu.querySelector("." + key)!.removeEventListener("contextmenu", listener);
        });

        menu.remove();
    }
}
