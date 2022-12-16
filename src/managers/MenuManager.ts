import { html } from "../reified/Reified";

export type MenuManagerContext = {
    menu: HTMLElement;
    clicks: Map<string, () => void>;
    listeners: {
        mousedown: (e: MouseEvent) => void;
        contextmenu: (e: MouseEvent) => void;
        click: (e: MouseEvent) => void;
    };
};

export type MenuManagerActions = Array<
    Record<string, { label: string; keybind?: string; callback: (e: MouseEvent) => void }>
>;

export type MenuManagerAction = MenuManagerActions[number];

export class MenuManager {
    static readonly #elements = new Map<HTMLElement, MenuManagerContext>();

    static #opened: MouseEvent;

    static use(
        element: HTMLElement,
        actions: MenuManagerActions,
    ): [queueNewContext: (newContext: (prev: MenuManagerActions) => MenuManagerActions) => void, killMenu: () => void] {
        const menu = html`<div class="contextmenu"></div>`;

        const clicks = new Map();

        const setup = (actions: MenuManagerActions) => {
            clicks.clear();

            const keys = actions.flatMap((record) => Object.keys(record));

            if (keys.length !== new Set(keys).size) throw new Error("Duplicate keys in menu actions.");

            menu.innerHTML = actions
                .map((record) =>
                    Object.entries(record)
                        .map(([name, { label, keybind }]) =>
                            keybind
                                ? `<button class="${name}">${label}<p class="menu-keybind">${keybind
                                      .split(" ")
                                      .map((key) => `<span>${key}</span>`)
                                      .join("")}</p></button>`
                                : `<button class="${name}">${label}</button>`,
                        )
                        .join(""),
                )
                .join('<div class="br"></div>');

            actions.forEach((record) => {
                Object.keys(record).forEach((key) => {
                    const click = record[key].callback.bind(undefined);

                    const listener = () => click(this.#opened);

                    menu.querySelector<HTMLElement>("." + key)!.addEventListener("mousedown", listener);

                    clicks.set(key, listener);
                });
            });
        };

        let context: MenuManagerActions | undefined;

        const getActions = () => {
            if (context) {
                const actions = context;

                context = undefined;

                return actions;
            }

            return actions;
        };

        setup(getActions());

        menu.style.left = "0px";
        menu.style.top = "0px";
        menu.style.display = "none";

        document.body.appendChild(menu);

        const mousedown = (e: MouseEvent) => {
            setup(getActions());

            this.#opened = e;

            menu.style.left = "0px";
            menu.style.top = "0px";
            menu.style.display = "none";
        };

        const contextmenu = (e: MouseEvent) => {
            e.preventDefault();

            setup(getActions());

            menu.style.display = "";
            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY + "px";
        };

        const click = (e: MouseEvent) => {
            e.preventDefault();

            setup(getActions());

            menu.style.left = "0px";
            menu.style.top = "0px";
            menu.style.display = "none";
        };

        element.addEventListener("mousedown", mousedown);
        element.addEventListener("contextmenu", contextmenu);
        menu.addEventListener("click", click);
        menu.addEventListener("contextmenu", click);

        this.#elements.set(element, { menu, clicks, listeners: { mousedown, contextmenu, click } });

        return [
            (newContext: (prev: MenuManagerActions) => MenuManagerActions) => {
                context = newContext.call(undefined, [...actions]);
            },
            () => {
                setup(getActions());

                menu.style.left = "0px";
                menu.style.top = "0px";
                menu.style.display = "none";
            },
        ];
    }

    static remove(element: HTMLElement) {
        const { menu, clicks, listeners } = this.#elements.get(element) ?? {};

        if (!menu || !clicks || !listeners) throw new Error(`Elements are not being affected.`);

        element.removeEventListener("mousedown", listeners.mousedown);
        element.removeEventListener("contextmenu", listeners.contextmenu);
        menu.removeEventListener("click", listeners.click);
        menu.removeEventListener("contextmenu", listeners.click);

        Array.from(clicks).forEach(([key, listener]) => {
            menu.querySelector("." + key)!.removeEventListener("mousedown", listener);
        });

        menu.remove();

        return this;
    }
}
