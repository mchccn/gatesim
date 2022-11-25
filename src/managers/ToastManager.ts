import { html } from "../reified/Reified";
import { SandboxManager } from "./SandboxManager";

export interface ToastData {
    message: string;
    color: string;
    duration: number;
}

export class ToastManager {
    static get container() {
        return document.querySelector<HTMLElement>(".toasts-container")!;
    }

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
            const finish = () => resolve(undefined);

            SandboxManager.watchedUnresolvedPromises.add(finish);

            const handler = () => {
                toast.remove();

                SandboxManager.watchedUnresolvedPromises.delete(finish);

                return finish();
            };

            toast.querySelector<HTMLElement>(".close-toast")!.addEventListener("click", handler);

            toast.addEventListener("animationend", handler);
        });
    }
}
