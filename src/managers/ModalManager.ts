import { html } from "../reified/Reified";

export class ModalManager {
    static readonly container = document.querySelector<HTMLElement>(".modal-container")!;

    static #onModalMount() {
        if (this.container.childElementCount <= 0) this.container.classList.remove("modal-inactive");
        else this.container.lastElementChild!.classList.add("modal-inactive");
    }

    static #onModalResolved() {
        if (this.container.childElementCount <= 0) this.container.classList.add("modal-inactive");
        else {
            this.container.lastElementChild!.classList.remove("modal-inactive");

            if (this.container.lastElementChild!.classList.contains("modal-alert")) {
                this.container.lastElementChild!.querySelector<HTMLElement>(".alert-ok")!.focus();
            }
        }
    }

    static async alert(message: string) {
        this.#onModalMount();

        const alert = html`
            <div class="modal modal-alert">
                <p class="alert-message">${message}</p>
                <button class="alert-ok">Ok</button>
            </div>
        `;

        this.container.appendChild(alert);

        alert.querySelector<HTMLElement>(".alert-ok")!.focus();

        return new Promise<void>((resolve) => {
            alert.querySelector<HTMLElement>(".alert-ok")!.addEventListener("click", () => {
                alert.remove();

                this.#onModalResolved();

                return resolve(undefined);
            });
        });
    }
}
