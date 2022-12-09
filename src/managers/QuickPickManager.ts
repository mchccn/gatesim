import { QUICKPICK_SIZE } from "../constants";
import { html } from "../reified/Reified";

export type MenuManagerContext = {
    listeners: {
        mouseup: (e: MouseEvent) => void;
    };
};

export type QuickPickActions = { label: string; callback: (e: MouseEvent) => void }[];

export class QuickPickManager {
    static readonly #elements = new Map<HTMLElement, MenuManagerContext>();

    static async activate(event: MouseEvent, actions: QuickPickActions) {
        const quickpick = html`<div class="quickpick"></div>`;

        const keys = actions.map(({ label }) => label);

        if (keys.length !== new Set(keys).size) throw new Error("Duplicate labels in quickpick actions.");

        quickpick.innerHTML =
            actions.map(({ label }, i) => `<div class="quickpick-item index-${i}">${label}</div>`).join("") +
            `<div class="quickpick-circle" style="width: ${QUICKPICK_SIZE}px; height: ${QUICKPICK_SIZE}px;"></div>`;

        setTimeout(() => {
            const circle = quickpick.querySelector<HTMLElement>(".quickpick-circle")!;

            const { width, height } = circle.getBoundingClientRect();

            circle.style.left = event.clientX - width / 2 + "px";
            circle.style.top = event.clientY - height / 2 + "px";

            actions.forEach((_, i) => {
                const angle = ((2 * Math.PI) / actions.length) * i - Math.PI / 2;

                const x = Math.cos(angle) * 50;
                const y = Math.sin(angle) * 50;

                const item = quickpick.querySelector<HTMLElement>(".index-" + i)!;

                const { width, height } = item.getBoundingClientRect();

                item.style.left = event.clientX + x - width / 2 + "px";
                item.style.top = event.clientY + y - height / 2 + "px";
            });
        });

        document.body.appendChild(quickpick);

        const mouseup = (e: MouseEvent) => {
            const distance = Math.hypot(e.clientX - event.clientX, e.clientY - event.clientY);

            // CHECK IF DISTANCE > CIRCLE RADIUS
            distance;

            const angle = Math.atan2(e.clientY - event.clientY, e.clientX - event.clientX) + Math.PI / 2;

            // GET ITEM CLOSEST TO ANGLE
            console.log((angle * 180) / Math.PI);

            quickpick.remove();
        };

        document.body.addEventListener("mouseup", mouseup, { once: true });

        this.#elements.set(document.body, { listeners: { mouseup } });
    }
}
