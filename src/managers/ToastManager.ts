import { html } from "../reified/Reified";

export interface ToastData {
    message: string;
    color: string;
    duration: number;
}

export class ToastManager {
    static readonly container = document.querySelector<HTMLElement>(".toasts-container")!;

    static async toast({ message, color, duration }: ToastData) {
        const toast = html`
            <div class="toast">
                <div class="toast-color"></div>
                <p class="toast-message">${message}</p>
                <button class="close-toast">╳</button>
            </div>
        `;

        toast.querySelector<HTMLElement>(".toast-color")!.style.backgroundColor = color;

        toast.style.animationDelay = duration + "ms";

        this.container.appendChild(toast);

        return new Promise<void>((resolve) => {
            toast.querySelector<HTMLElement>(".close-toast")!.addEventListener("click", () => {
                toast.remove();

                return resolve(undefined);
            });

            toast.addEventListener("animationend", () => {
                toast.remove();

                return resolve(undefined);
            });
        });
    }
}
