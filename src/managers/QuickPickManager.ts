import { GET_GRAY_COLOR, QUICKPICK_SIZE } from "../constants";
import { html } from "../reified/Reified";

export type QuickPickContext = {
    listeners: {
        mouseup: (e: MouseEvent) => void;
    };
};

export type QuickPickActions = {
    label: string;
    callback: (e: MouseEvent) => void;
}[];

export class QuickPickManager {
    static line: [from: MouseEvent, to: MouseEvent] | undefined;

    static async activate(event: MouseEvent, actions: QuickPickActions) {
        const quickpick = html`<div class="quickpick"></div>`;

        const keys = actions.map(({ label }) => label);

        if (keys.length !== new Set(keys).size) throw new Error("Duplicate labels in quickpick actions.");

        quickpick.innerHTML = actions
            .map(({ label }, i) => `<div class="quickpick-item index-${i}">${label}</div>`)
            .join("");

        setTimeout(() => {
            const circle = html`
                <svg
                    class="quickpick-circle"
                    width="${QUICKPICK_SIZE * 2}"
                    height="${QUICKPICK_SIZE * 2}"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="${QUICKPICK_SIZE}"
                        cy="${QUICKPICK_SIZE}"
                        r="${QUICKPICK_SIZE / 2 - 1 - 1}"
                        stroke="${GET_GRAY_COLOR()}"
                        stroke-width="2px"
                        fill="none"
                    />
                    ${actions.map((_, i) => {
                        const angle = ((2 * Math.PI) / actions.length) * i - Math.PI / 2 - Math.PI / actions.length;

                        const linePath = `M${Math.cos(angle) * (QUICKPICK_SIZE - 1 - 1) + QUICKPICK_SIZE},${
                            Math.sin(angle) * (QUICKPICK_SIZE - 1 - 1) + QUICKPICK_SIZE
                        } L${Math.cos(angle) * (QUICKPICK_SIZE / 2 - 1 - 1) + QUICKPICK_SIZE},${
                            Math.sin(angle) * (QUICKPICK_SIZE / 2 - 1 - 1) + QUICKPICK_SIZE
                        }`;

                        return `<path d="${linePath}" style="stroke: ${GET_GRAY_COLOR()}; stroke-width: 2px; fill: none;" />`;
                    })}
                </svg>
            `;

            quickpick.appendChild(circle);

            setTimeout(() => {
                const { width, height } = circle.getBoundingClientRect();

                circle.style.left = event.clientX - width / 2 + "px";
                circle.style.top = event.clientY - height / 2 + "px";
            });

            actions.forEach((_, i) => {
                const angle = ((2 * Math.PI) / actions.length) * i - Math.PI / 2;

                const x = Math.cos(angle) * QUICKPICK_SIZE;
                const y = Math.sin(angle) * QUICKPICK_SIZE;

                const item = quickpick.querySelector<HTMLElement>(".index-" + i)!;

                const { width, height } = item.getBoundingClientRect();

                item.style.transitionDelay = i * (200 / actions.length) + "ms";
                item.style.animationDelay = i * (200 / actions.length) + "ms";

                item.style.left = event.clientX + (2 * x) / 3 - width / 2 + "px";
                item.style.top = event.clientY + (2 * y) / 3 - height / 2 + "px";

                setTimeout(() => {
                    item.style.left = event.clientX + x - width / 2 + "px";
                    item.style.top = event.clientY + y - height / 2 + "px";
                });
            });
        });

        document.body.appendChild(quickpick);

        const mousemove = (e: MouseEvent) => {
            this.line = [event, e];
        };

        document.body.addEventListener("mousemove", mousemove);

        document.body.addEventListener(
            "mouseup",
            (e: MouseEvent) => {
                const distance = Math.hypot(e.clientX - event.clientX, e.clientY - event.clientY);

                if (distance >= QUICKPICK_SIZE / 2) {
                    const angle = Math.atan2(e.clientY - event.clientY, e.clientX - event.clientX) + Math.PI / 2;

                    const closest =
                        (Math.round(angle / ((2 * Math.PI) / actions.length)) + actions.length) % actions.length;

                    actions[closest].callback.call(undefined, event);
                }

                quickpick.remove();

                document.body.removeEventListener("mousemove", mousemove);

                this.line = undefined;
            },
            { once: true },
        );

        document.body.addEventListener(
            "mouseleave",
            () => {
                quickpick.remove();

                document.body.removeEventListener("mousemove", mousemove);

                this.line = undefined;
            },
            { once: true },
        );
    }
}
